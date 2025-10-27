import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { workoutSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../_utils";

export async function GET(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const workouts = await prisma.workout.findMany({
      where: { phase: { program: { orgId: context.orgId } } },
      include: { sets: true }
    });

    return NextResponse.json(workouts);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch workouts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = workoutSchema.parse(await req.json());
    const workout = await prisma.workout.create({
      data: {
        name: data.name,
        sequence: data.sequence,
        notes: data.notes,
        phaseId: data.phaseId
      }
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create workout" }, { status: 500 });
  }
}
