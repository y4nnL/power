import { NextRequest, NextResponse } from "next/server";
import { requireCoach, getContext, ensureOrgAccess } from "../../_utils";
import { pusher } from "../../../lib/pusher";

const allowedEvents = new Set(["SET_START", "SET_DONE", "NOTE"]);

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    requireCoach(context);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const { assignmentId, type, message } = await req.json();
    if (!assignmentId || !allowedEvents.has(type)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await pusher.trigger(`workout:${assignmentId}`, type, {
      message,
      timestamp: new Date().toISOString(),
      userId: context.clerkUserId
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to emit event" }, { status: 500 });
  }
}
