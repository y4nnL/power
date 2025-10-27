import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { exerciseSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../../_utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = exerciseSchema.partial().parse(await req.json());
    const exercise = await prisma.exercise.updateMany({
      where: { id: params.id, orgId: context.orgId },
      data
    });

    if (exercise.count === 0) {
      return NextResponse.json({ error: "Exercice introuvable" }, { status: 404 });
    }

    return NextResponse.json(
      await prisma.exercise.findFirst({ where: { id: params.id, orgId: context.orgId } })
    );
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to update exercise" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const deleted = await prisma.exercise.deleteMany({ where: { id: params.id, orgId: context.orgId } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Exercice introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to delete exercise" }, { status: 500 });
  }
}
