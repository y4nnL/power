import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@power/db";
import LiveWorkoutClient from "./live-client";

async function LiveWorkoutServer() {
  const { userId } = auth();
  if (!userId) return null;

  const assignment = await prisma.assignment.findFirst({
    where: {
      athlete: { user: { clerkUserId: userId } },
      status: "ACTIVE"
    },
    include: {
      program: true
    }
  });

  if (!assignment) {
    return <p>Pas de séance live pour le moment.</p>;
  }

  return <LiveWorkoutClient assignmentId={assignment.id} programName={assignment.program.name} />;
}

export default function LivePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Session Live</h1>
        <p className="text-sm text-slate-300">Partagez vos progrès en direct avec votre coach.</p>
      </div>
      <Suspense fallback={<p>Connexion au canal en cours…</p>}>
        {/* @ts-expect-error Async Server Component */}
        <LiveWorkoutServer />
      </Suspense>
    </div>
  );
}
