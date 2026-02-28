import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { generateVideo, pollJobUntilDone, type AIModel } from "@/lib/generate";

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

  const selectedModel: AIModel = model || "kling_2.6";

  // Create/update video record
  if (!video) {
    video = await prisma.video.create({
      data: {
        userId: user.id,
        title: script?.substring(0, 50) || "New Video",
        script,
        model: selectedModel,
        photoId: photo.id,
        voiceId: voice.id,
        status: "generating",
      },
    });
  } else {
    video = await prisma.video.update({
      where: { id: video.id },
      data: { status: "generating", model: selectedModel },
    });
  }

  // Call AI generation
  const result = await generateVideo({
    model: selectedModel,
    photoUrl: photo.url,
    voiceUrl: voice.url,
    script: script || video.script || "",
    duration: 8,
  });

  // Handle immediate failure
  if (result.status === "failed") {
    await prisma.video.update({
      where: { id: video.id },
      data: { status: "failed" },
    });

    return NextResponse.json({
      video: { ...video, status: "failed" },
      generation: result,
    });
  }

  // Handle immediate completion (demo mode)
  if (result.status === "completed") {
    const updatedVideo = await prisma.video.update({
      where: { id: video.id },
      data: {
        status: "review",
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

  // Job is processing -- start background polling (fire-and-forget)
  // The polling function will update the Video record status in the DB
  // when the job completes or fails.
  pollJobUntilDone(video.id, result.jobId, selectedModel).catch((err) => {
    console.error(`[Generate] Background poll error for video ${video!.id}:`, err);
  });

  // Update video record with processing state
  const updatedVideo = await prisma.video.update({
    where: { id: video.id },
    data: {
      status: "generating",
      duration: 8,
    },
  });

  return NextResponse.json({
    video: updatedVideo,
    generation: result,
  });
}
