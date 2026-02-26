import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { generateVideo } from "@/lib/generate";

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { videoId, model, script, photoId, voiceId } = await req.json();

  // Get or create video record
  let video;
  if (videoId) {
    video = await prisma.video.findFirst({ where: { id: videoId, userId: user.id } });
    if (!video) return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  // Get photo and voice
  const photo = photoId
    ? await prisma.photo.findFirst({ where: { id: photoId, userId: user.id } })
    : await prisma.photo.findFirst({ where: { userId: user.id, isPrimary: true } });

  const voice = voiceId
    ? await prisma.voiceSample.findFirst({ where: { id: voiceId, userId: user.id } })
    : await prisma.voiceSample.findFirst({ where: { userId: user.id, isDefault: true } });

  if (!photo) return NextResponse.json({ error: "No photo available. Please upload a photo first." }, { status: 400 });
  if (!voice) return NextResponse.json({ error: "No voice sample available. Please record your voice first." }, { status: 400 });

  // Create/update video record
  if (!video) {
    video = await prisma.video.create({
      data: {
        userId: user.id,
        title: script?.substring(0, 50) || "New Video",
        script,
        model: model || "kling_2.6",
        photoId: photo.id,
        voiceId: voice.id,
        status: "generating",
      },
    });
  } else {
    await prisma.video.update({
      where: { id: video.id },
      data: { status: "generating", model: model || video.model },
    });
  }

  // Call AI generation
  const result = await generateVideo({
    model: model || "kling_2.6",
    photoUrl: photo.url,
    voiceUrl: voice.url,
    script: script || video.script || "",
    duration: 8,
  });

  // Update video with result
  const updatedVideo = await prisma.video.update({
    where: { id: video.id },
    data: {
      status: result.status === "completed" ? "review" : "generating",
      videoUrl: result.videoUrl || null,
      thumbnailUrl: result.thumbnailUrl || null,
      duration: 8,
    },
  });

  return NextResponse.json({
    video: updatedVideo,
    generation: result,
  });
}
