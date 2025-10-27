import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { workoutLogSchema } from "@power/utils";
import { ensureOrgAccess, getContext } from "../../_utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = workoutLogSchema.partial().parse(await req.json());
    const log = await prisma.workoutLog.updateMany({
      where: { id: params.id, assignment: { program: { orgId: context.orgId } } },
      data: {
        ...data,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined
      }
    });

    if (log.count === 0) {
      return NextResponse.json({ error: "Log introuvable" }, { status: 404 });
    }

    return NextResponse.json(
      await prisma.workoutLog.findFirst({ where: { id: params.id, assignment: { program: { orgId: context.orgId } } } })
    );
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to update log" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const deleted = await prisma.workoutLog.deleteMany({
      where: { id: params.id, assignment: { program: { orgId: context.orgId } } }
    });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Log introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to delete log" }, { status: 500 });
  }
}
