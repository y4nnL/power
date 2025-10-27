import { prisma } from "@power/db";
import { Card, Button } from "@power/ui";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { formatDate } from "@power/utils";

export default async function AthleteWorkoutsPage() {
  const { userId } = auth();
  if (!userId) {
    return null;
  }

  const athlete = await prisma.athleteProfile.findFirst({
    where: { user: { clerkUserId: userId } },
    include: {
      assignments: {
        include: {
          program: {
            include: {
              phases: { include: { workouts: { include: { sets: true } } } }
            }
          }
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Vos entraînements</h1>
        <p className="text-sm text-slate-300">
          Synchronisez vos séances même hors ligne. Les logs seront envoyés automatiquement.
        </p>
      </div>
      <div className="space-y-4">
        {athlete?.assignments.map((assignment) => (
          <Card
            key={assignment.id}
            title={assignment.program.name}
            description={`Début ${formatDate(assignment.startDate)}${assignment.endDate ? ` · Fin ${formatDate(assignment.endDate)}` : ""}`}
            actions={
              <Button asChild>
                <Link href={`/athlete/workouts/${assignment.id}`}>Ouvrir</Link>
              </Button>
            }
            className="bg-slate-800/60 text-white"
          >
            <ul className="space-y-2 text-sm text-slate-200">
              {assignment.program.phases.map((phase) => (
                <li key={phase.id}>
                  <p className="font-medium">{phase.name}</p>
                  <p className="text-xs text-slate-400">{phase.workouts.length} séances</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
        {athlete?.assignments.length === 0 && <p>Aucun programme pour le moment.</p>}
      </div>
    </div>
  );
}
