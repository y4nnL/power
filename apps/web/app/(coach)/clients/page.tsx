import { prisma } from "@power/db";
import { Card, Button } from "@power/ui";
import Link from "next/link";
import { headers } from "next/headers";

export default async function ClientsPage() {
  const orgId = headers().get("x-org-id");
  const athletes = await prisma.athleteProfile.findMany({
    where: orgId ? { user: { memberships: { some: { orgId } } } } : undefined,
    include: {
      user: true,
      assignments: {
        include: { program: true }
      }
    },
    orderBy: { user: { firstName: "asc" } }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Athlètes</h1>
          <p className="text-slate-500">Suivez l'engagement et assignez des programmes personnalisés.</p>
        </div>
        <Button asChild>
          <Link href="/coach/assignments/new">Assigner un programme</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {athletes.map((athlete) => (
          <Card
            key={athlete.id}
            title={`${athlete.user.firstName ?? ""} ${athlete.user.lastName ?? ""}`.trim() || athlete.user.email}
            description={athlete.selfCoached ? "Auto-coaching" : `Coaché depuis ${athlete.createdAt.toLocaleDateString("fr-FR")}`}
            actions={
              <Button asChild variant="secondary">
                <Link href={`/coach/athletes/${athlete.id}`}>Voir le profil</Link>
              </Button>
            }
          >
            <ul className="space-y-2 text-sm">
              {athlete.assignments.map((assignment) => (
                <li key={assignment.id} className="flex items-center justify-between">
                  <span>{assignment.program.name}</span>
                  <span className="text-slate-500">{assignment.status}</span>
                </li>
              ))}
              {athlete.assignments.length === 0 && (
                <li className="text-slate-500">Aucun programme assigné pour le moment.</li>
              )}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
