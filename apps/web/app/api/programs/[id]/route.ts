import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { programSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../../_utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const program = await prisma.program.findFirst({
      where: { id: params.id, orgId: context.orgId },
      include: {
        phases: {
          include: { workouts: { include: { sets: true } } }
        }
      }
    });

    return NextResponse.json(program);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch program" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = programSchema.partial().parse(await req.json());
    const program = await prisma.program.updateMany({
      where: { id: params.id, orgId: context.orgId },
      data
    });

    if (program.count === 0) {
      return NextResponse.json({ error: "Programme introuvable" }, { status: 404 });
    }

    return NextResponse.json(await prisma.program.findFirst({ where: { id: params.id, orgId: context.orgId } }));
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to update program" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const deleted = await prisma.program.deleteMany({ where: { id: params.id, orgId: context.orgId } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Programme introuvable" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to delete program" }, { status: 500 });
  }
}
