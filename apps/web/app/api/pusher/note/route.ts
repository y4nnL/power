import { NextRequest, NextResponse } from "next/server";
import { getContext, ensureOrgAccess } from "../../_utils";
import { pusher } from "../../../lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const { assignmentId, message } = await req.json();
    if (!assignmentId || !message) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await pusher.trigger(`workout:${assignmentId}`, "NOTE", {
      message,
      timestamp: new Date().toISOString(),
      userId: context.clerkUserId
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to broadcast note" }, { status: 500 });
  }
}
