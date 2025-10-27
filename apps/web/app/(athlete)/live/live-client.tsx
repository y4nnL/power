"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { Button, Card, Input } from "@power/ui";

interface Props {
  assignmentId: string;
  programName: string;
}

type EventType = "SET_START" | "SET_DONE" | "NOTE" | "HEARTBEAT";

interface EventPayload {
  type: EventType;
  message?: string;
  timestamp: string;
}

export default function LiveWorkoutClient({ assignmentId, programName }: Props) {
  const [events, setEvents] = useState<EventPayload[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY ?? "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher/auth"
    });

    const channel = pusher.subscribe(`workout:${assignmentId}`);
    channel.bind_global((event: EventType, data: EventPayload) => {
      setEvents((prev) => [...prev, { ...data, type: event }]);
    });

    const heartbeat = setInterval(() => {
      fetch("/api/pusher/heartbeat", {
        method: "POST",
        body: JSON.stringify({ assignmentId })
      }).catch(() => {});
    }, 15_000);

    return () => {
      clearInterval(heartbeat);
      channel.unbind_all();
      pusher.disconnect();
    };
  }, [assignmentId]);

  const submitNote = async () => {
    await fetch("/api/pusher/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, message: note })
    });
    setNote("");
  };

  return (
    <Card title={programName} description="Temps réel">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ajouter une note pour votre coach"
          />
          <Button onClick={submitNote}>Envoyer</Button>
        </div>
        <ul className="space-y-3 text-sm">
          {events.map((event, index) => (
            <li key={`${event.timestamp}-${index}`} className="rounded-lg bg-slate-800/60 p-3">
              <p className="font-semibold">{event.type}</p>
              {event.message && <p className="text-slate-300">{event.message}</p>}
              <p className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</p>
            </li>
          ))}
          {events.length === 0 && <li className="text-slate-400">En attente d'activité…</li>}
        </ul>
      </div>
    </Card>
  );
}
