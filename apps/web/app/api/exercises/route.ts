import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { exerciseSchema } from "@power/utils";
import { ensureOrgAccess, getContext, requireCoach } from "../_utils";

export async function GET(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [{ orgId: null }, { orgId: context.orgId }]
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json(exercises);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch exercises" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = exerciseSchema.parse(await req.json());
    const exercise = await prisma.exercise.create({
      data: {
        ...data,
        orgId: data.orgId ?? context.orgId
      }
    });

    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create exercise" }, { status: 500 });
  }
}
