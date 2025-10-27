import { notFound } from "next/navigation";
import { prisma } from "@power/db";
import WorkoutLogger from "./workout-logger";

interface PageProps {
  params: { assignmentId: string };
}

export default async function AssignmentPage({ params }: PageProps) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: params.assignmentId },
    include: {
      program: {
        include: {
          phases: {
            include: {
              workouts: {
                include: { sets: { include: { exercise: true } } },
                orderBy: { sequence: "asc" }
              }
            },
            orderBy: { order: "asc" }
          }
        }
      }
    }
  });

  if (!assignment) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{assignment.program.name}</h1>
      <WorkoutLogger assignment={assignment} />
    </div>
  );
}
