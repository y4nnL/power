import { NextRequest, NextResponse } from "next/server";
import { ensureOrgAccess, getContext } from "../../_utils";
import { getR2Client } from "../../../lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mux } from "../../../lib/mux";
import { prisma } from "@power/db";
import { z } from "zod";

const requestSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  scope: z.enum(["PROGRAM", "WORKOUT", "WORKOUT_LOG", "PROFILE"]),
  workoutLogId: z.string().optional(),
  programId: z.string().optional(),
  workoutId: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const payload = requestSchema.parse(await req.json());

    const bucket = process.env.R2_BUCKET;
    if (!bucket) {
      return NextResponse.json({ error: "Missing R2 config" }, { status: 500 });
    }

    const key = `${context.orgId}/${Date.now()}-${payload.fileName}`;
    const client = getR2Client();
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: payload.contentType });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });

    const muxUpload = await mux.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_APP_URL,
      new_asset_settings: { playback_policy: ["public"] }
    });

    const media = await prisma.media.create({
      data: {
        url: key,
        scope: payload.scope,
        ownerId: context.userId,
        orgId: context.orgId,
        muxAssetId: muxUpload.data?.id,
        workoutLogId: payload.workoutLogId,
        programId: payload.programId,
        workoutId: payload.workoutId
      }
    });

    return NextResponse.json({ uploadUrl, key, mux: muxUpload.data, mediaId: media.id });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create upload" }, { status: 500 });
  }
}
