import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const { type, data } = payload;

  if (type === "video.asset.ready") {
    const playbackId = data?.playback_ids?.[0]?.id;
    const assetId = data?.id;

    if (assetId && playbackId) {
      await prisma.media.updateMany({
        where: { muxAssetId: assetId },
        data: { muxPlaybackId: playbackId }
      });
    }
  }

  return NextResponse.json({ received: true });
}
