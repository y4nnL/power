import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { workoutSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../../_utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = workoutSchema.partial().parse(await req.json());
    const updated = await prisma.workout.updateMany({
      where: { id: params.id, phase: { program: { orgId: context.orgId } } },
      data
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });
    }

    return NextResponse.json(
      await prisma.workout.findFirst({ where: { id: params.id, phase: { program: { orgId: context.orgId } } } })
    );
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to update workout" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const deleted = await prisma.workout.deleteMany({
      where: { id: params.id, phase: { program: { orgId: context.orgId } } }
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Séance introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to delete workout" }, { status: 500 });
  }
}
