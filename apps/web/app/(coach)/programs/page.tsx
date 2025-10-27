import Link from "next/link";
import { prisma } from "@power/db";
import { Card, Button } from "@power/ui";
import { headers } from "next/headers";

export default async function ProgramsPage() {
  const orgId = headers().get("x-org-id");
  const programs = await prisma.program.findMany({
    where: orgId ? { orgId } : undefined,
    include: {
      phases: {
        include: { workouts: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Programmes</h1>
          <p className="text-slate-500">Structurez vos cycles et phases pour chaque athlète.</p>
        </div>
        <Button asChild>
          <Link href="/coach/programs/new">Nouveau programme</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {programs.map((program) => (
          <Card
            key={program.id}
            title={program.name}
            description={`${program.phases.length} phases`}
            actions={
              <Button asChild variant="secondary">
                <Link href={`/coach/programs/${program.id}`}>Ouvrir</Link>
              </Button>
            }
          >
            <ul className="space-y-2 text-sm">
              {program.phases.map((phase) => (
                <li key={phase.id} className="flex justify-between">
                  <span>{phase.name}</span>
                  <span className="text-slate-500">{phase.workouts.length} séances</span>
                </li>
              ))}
              {program.phases.length === 0 && (
                <li className="text-slate-500">Ajoutez votre première phase.</li>
              )}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
