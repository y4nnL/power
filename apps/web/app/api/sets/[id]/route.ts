import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { ensureOrgAccess, getContext, requireCoach } from "../../_utils";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const deleted = await prisma.set.deleteMany({
      where: { id: params.id, workout: { phase: { program: { orgId: context.orgId } } } }
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Set introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to delete set" }, { status: 500 });
  }
}
