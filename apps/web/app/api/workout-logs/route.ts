import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { workoutLogSchema } from "@power/utils";
import { ensureOrgAccess, getContext } from "../_utils";

export async function GET(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const searchParams = req.nextUrl.searchParams;
    const assignmentId = searchParams.get("assignmentId") ?? undefined;

    const logs = await prisma.workoutLog.findMany({
      where: {
        assignmentId: assignmentId ?? undefined,
        assignment: { program: { orgId: context.orgId } }
      },
      include: {
        set: { include: { exercise: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(logs);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch logs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = workoutLogSchema.parse(await req.json());

    const assignment = await prisma.assignment.findFirst({
      where: { id: data.assignmentId, program: { orgId: context.orgId } }
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment introuvable" }, { status: 404 });
    }

    const log = await prisma.workoutLog.create({
      data: {
        ...data,
        startedAt: data.startedAt ? new Date(data.startedAt) : null,
        completedAt: data.completedAt ? new Date(data.completedAt) : null
      }
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create log" }, { status: 500 });
  }
}
