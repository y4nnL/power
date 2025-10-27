import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { phaseSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../_utils";

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = phaseSchema.parse(await req.json());
    const phase = await prisma.phase.create({
      data: {
        name: data.name,
        order: data.order,
        description: data.description,
        programId: data.programId
      }
    });

    return NextResponse.json(phase, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create phase" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const phases = await prisma.phase.findMany({
      where: { program: { orgId: context.orgId } },
      include: { workouts: true }
    });

    return NextResponse.json(phases);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch phases" }, { status: 500 });
  }
}
