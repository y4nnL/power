import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@power/db";
import { mediaSchema } from "@power/utils";
import { ensureOrgAccess, getContext } from "../_utils";

export async function GET(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const media = await prisma.media.findMany({
      where: {
        OR: [{ orgId: null }, { orgId: context.orgId }]
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(media);
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to fetch media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getContext(req);
    await ensureOrgAccess(context.orgId, context.clerkUserId);

    const data = mediaSchema.parse(await req.json());
    const asset = await prisma.media.create({
      data: {
        ...data,
        orgId: data.orgId ?? context.orgId
      }
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: "Unable to create media" }, { status: 500 });
  }
}
