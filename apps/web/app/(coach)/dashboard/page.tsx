import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@power/db";
import { Card } from "@power/ui";
import { headers } from "next/headers";

async function DashboardMetrics() {
  const orgId = headers().get("x-org-id");
  const where = orgId ? { orgId } : {};
  const [programs, athletes, assignments] = await Promise.all([
    prisma.program.count({ where }),
    prisma.athleteProfile.count({ where: orgId ? { user: { memberships: { some: { orgId } } } } : undefined }),
    prisma.assignment.count({ where: orgId ? { program: { orgId } } : undefined })
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card title="Programmes" description="Total actifs">
        <p className="text-4xl font-semibold">{programs}</p>
      </Card>
      <Card title="Athlètes" description="Suivis">
        <p className="text-4xl font-semibold">{athletes}</p>
      </Card>
      <Card title="Assignments" description="En cours">
        <p className="text-4xl font-semibold">{assignments}</p>
      </Card>
    </div>
  );
}

export default async function CoachDashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Bonjour {user?.firstName ?? "Coach"}</h1>
        <p className="text-slate-500">Suivez vos athlètes en temps réel et pilotez vos abonnements.</p>
      </div>
      <Suspense fallback={<div>Chargement…</div>}>
        <DashboardMetrics />
      </Suspense>
    </div>
  );
}
