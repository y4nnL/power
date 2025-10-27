"use client";

import { useEffect, useMemo, useState } from "react";
import { openDB } from "idb";
import { Button, Card, Input } from "@power/ui";
import { useTracing } from "../../../providers/tracing-provider";

interface WorkoutLoggerProps {
  assignment: any;
}

interface DraftLog {
  setId: string;
  performedReps?: number;
  performedLoad?: number;
  perceivedRpe?: number;
  notes?: string;
}

export default function WorkoutLogger({ assignment }: WorkoutLoggerProps) {
  const tracing = useTracing();
  const [drafts, setDrafts] = useState<Record<string, DraftLog>>({});

  useEffect(() => {
    const loadDrafts = async () => {
      const db = await openDB("power-athlete", 1, {
        upgrade(database) {
          database.createObjectStore("logs");
        }
      });
      const cached = (await db.get("logs", assignment.id)) as Record<string, DraftLog> | undefined;
      setDrafts(cached ?? {});
    };
    loadDrafts();
  }, [assignment.id]);

  const workouts = useMemo(() => assignment.program.phases.flatMap((phase: any) => phase.workouts), [assignment.program.phases]);

  const updateDraft = async (setId: string, draft: DraftLog) => {
    const newDrafts = { ...drafts, [setId]: { ...drafts[setId], ...draft } };
    setDrafts(newDrafts);
    const db = await openDB("power-athlete", 1, {
      upgrade(database) {
        database.createObjectStore("logs");
      }
    });
    await db.put("logs", newDrafts, assignment.id);
  };

  const syncDrafts = async () => {
    await Promise.all(
      Object.values(drafts).map((draft) =>
        fetch("/api/workout-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...draft,
            assignmentId: assignment.id,
            athleteId: assignment.athleteId,
            setId: draft.setId
          })
        })
      )
    );
    const db = await openDB("power-athlete", 1);
    await db.delete("logs", assignment.id);
    setDrafts({});
    tracing.track("completeWorkout", { assignmentId: assignment.id });
  };

  return (
    <div className="space-y-4">
      {workouts.map((workout: any) => (
        <Card key={workout.id} title={workout.name} description={workout.notes ?? undefined} className="bg-slate-800/40 text-white">
          <div className="space-y-3">
            {workout.sets.map((set: any) => (
              <div key={set.id} className="grid grid-cols-1 gap-3 rounded-lg bg-slate-900/40 p-3 md:grid-cols-4">
                <div>
                  <p className="text-sm font-semibold">{set.exercise.name}</p>
                  <p className="text-xs text-slate-400">{set.targetReps ? `${set.targetReps} reps` : "Libre"}</p>
                </div>
                <Input
                  type="number"
                  value={drafts[set.id]?.performedReps ?? ""}
                  onChange={(event) => updateDraft(set.id, { setId: set.id, performedReps: Number(event.target.value) })}
                  placeholder="Reps"
                />
                <Input
                  type="number"
                  value={drafts[set.id]?.performedLoad ?? ""}
                  onChange={(event) => updateDraft(set.id, { setId: set.id, performedLoad: Number(event.target.value) })}
                  placeholder="Charge"
                />
                <Input
                  type="number"
                  value={drafts[set.id]?.perceivedRpe ?? ""}
                  onChange={(event) => updateDraft(set.id, { setId: set.id, perceivedRpe: Number(event.target.value) })}
                  placeholder="RPE"
                />
                <Input
                  value={drafts[set.id]?.notes ?? ""}
                  onChange={(event) => updateDraft(set.id, { setId: set.id, notes: event.target.value })}
                  placeholder="Notes"
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
      <Button onClick={syncDrafts}>Synchroniser les logs</Button>
    </div>
  );
}
