import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { getContext, ensureOrgAccess } from "../_utils";

export async function GET(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const subscription = await prisma.subscription.findFirst({
      where: { orgId: context.orgId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(subscription);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch subscription" }, { status: 500 });
  }
}
