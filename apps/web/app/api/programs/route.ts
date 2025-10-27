import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { programSchema } from "@power/utils";
import { getContext, requireCoach, ensureOrgAccess } from "../_utils";

export async function GET(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const programs = await prisma.program.findMany({
      where: { orgId: context.orgId },
      include: {
        phases: { include: { workouts: true } }
      }
    });

    return NextResponse.json(programs);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch programs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = programSchema.omit({ orgId: true }).parse(await req.json());

    const program = await prisma.program.create({
      data: {
        name: data.name,
        description: data.description,
        orgId: context.orgId,
        ownerId: data.ownerId
      }
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create program" }, { status: 500 });
  }
}
