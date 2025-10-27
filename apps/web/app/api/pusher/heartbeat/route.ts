import { NextRequest, NextResponse } from "next/server";
import { pusher } from "../../../lib/pusher";
import { getContext, ensureOrgAccess } from "../../_utils";

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const { assignmentId } = await req.json();
    if (!assignmentId) {
      return NextResponse.json({ error: "Missing assignmentId" }, { status: 400 });
    }

    await pusher.trigger(`workout:${assignmentId}`, "HEARTBEAT", {
      timestamp: new Date().toISOString(),
      userId: context.clerkUserId
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to emit heartbeat" }, { status: 500 });
  }
}
