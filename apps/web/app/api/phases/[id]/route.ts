import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { phaseSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../../_utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = phaseSchema.partial().parse(await req.json());
    const updated = await prisma.phase.updateMany({
      where: { id: params.id, program: { orgId: context.orgId } },
      data
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Phase introuvable" }, { status: 404 });
    }

    return NextResponse.json(
      await prisma.phase.findFirst({ where: { id: params.id, program: { orgId: context.orgId } } })
    );
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to update phase" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const deleted = await prisma.phase.deleteMany({ where: { id: params.id, program: { orgId: context.orgId } } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Phase introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to delete phase" }, { status: 500 });
  }
}
