import { NextRequest, NextResponse } from "next/server";
import { getContext, ensureOrgAccess } from "../../_utils";
import { pusher } from "../../../lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const body = await req.json();
    const { channel_name: channelName, socket_id: socketId } = body;

    if (!channelName || !socketId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const authResponse = pusher.authorizeChannel(socketId, channelName, {
      user_id: context.clerkUserId,
      user_info: { role: context.role, orgId: context.orgId }
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to authorize" }, { status: 500 });
  }
}
