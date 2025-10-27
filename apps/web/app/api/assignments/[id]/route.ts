import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { assignmentSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../../_utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = assignmentSchema.partial().parse(await req.json());
    const assignment = await prisma.assignment.updateMany({
      where: { id: params.id, program: { orgId: context.orgId } },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined
      }
    });

    if (assignment.count === 0) {
      return NextResponse.json({ error: "Assignment introuvable" }, { status: 404 });
    }

    return NextResponse.json(
      await prisma.assignment.findFirst({ where: { id: params.id, program: { orgId: context.orgId } } })
    );
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to update assignment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const deleted = await prisma.assignment.deleteMany({ where: { id: params.id, program: { orgId: context.orgId } } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Assignment introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to delete assignment" }, { status: 500 });
  }
}
