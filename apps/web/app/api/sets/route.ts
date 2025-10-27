import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { setSchema } from "@power/utils";
import { z } from "zod";
import { ensureOrgAccess, getContext, requireCoach } from "../_utils";

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = setSchema.parse(await req.json());
    const workout = await prisma.workout.findFirst({
      where: { id: data.workoutId, phase: { program: { orgId: context.orgId } } }
    });

    if (!workout) {
      return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });
    }

    const exercise = await prisma.exercise.findFirst({
      where: { id: data.exerciseId, OR: [{ orgId: context.orgId }, { orgId: null }] }
    });

    if (!exercise) {
      return NextResponse.json({ error: "Exercice introuvable" }, { status: 404 });
    }

    const set = await prisma.set.create({ data });
    return NextResponse.json(set, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create set" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const updateSchema = setSchema.partial().extend({ id: z.string().cuid() });
    const { id, ...data } = updateSchema.parse(await req.json());
    const updated = await prisma.set.updateMany({
      where: { id, workout: { phase: { program: { orgId: context.orgId } } } },
      data
    });
    if (updated.count === 0) {
      return NextResponse.json({ error: "Set introuvable" }, { status: 404 });
    }
    return NextResponse.json(
      await prisma.set.findFirst({ where: { id, workout: { phase: { program: { orgId: context.orgId } } } } })
    );
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to update set" }, { status: 500 });
  }
}
