import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { ensureOrgAccess, getContext } from "../../_utils";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const deleted = await prisma.media.deleteMany({ where: { id: params.id, orgId: context.orgId } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Média introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to delete media" }, { status: 500 });
  }
}
