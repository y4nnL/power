import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { assignmentSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../_utils";

export async function GET(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const assignments = await prisma.assignment.findMany({
      where: { program: { orgId: context.orgId } },
      include: {
        program: true,
        athlete: { include: { user: true } }
      }
    });

    return NextResponse.json(assignments);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch assignments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = assignmentSchema.parse(await req.json());
    const program = await prisma.program.findFirst({
      where: { id: data.programId, orgId: context.orgId }
    });

    if (!program) {
      return NextResponse.json({ error: "Programme introuvable" }, { status: 404 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        programId: data.programId,
        athleteId: data.athleteId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: "ACTIVE"
      }
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create assignment" }, { status: 500 });
  }
}
