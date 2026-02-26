import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const contentType = searchParams.get("type");

  const where: any = { userId: user.id };
  if (status) where.status = status;
  if (contentType) where.contentType = contentType;

  const videos = await prisma.video.findMany({
    where,
    include: { photo: true, voice: true, schedule: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const video = await prisma.video.create({
    data: {
      userId: user.id,
      title: body.title,
      description: body.description,
      script: body.script,
      model: body.model || "kling_2.6",
      contentType: body.contentType || "general",
      sourceReview: body.sourceReview,
      photoId: body.photoId,
      voiceId: body.voiceId,
      status: "draft",
    },
  });

  return NextResponse.json(video);
}
