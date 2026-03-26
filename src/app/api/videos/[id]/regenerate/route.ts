import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

/**
 * POST /api/videos/{id}/regenerate
 *
 * Creates a NEW video with the same prompt, format, and model as the original,
 * then triggers generation via POST /api/generate.
 *
 * Returns the new video record so the client can redirect to it.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    if (!params.id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    // 1. Find the original video
    const original = await prisma.video.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!original) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // 2. Create a new video record with the same parameters
    const newVideo = await prisma.video.create({
      data: {
        userId: user.id,
        title: `${original.title} (v2)`,
        description: original.description,
        script: original.script,
        model: original.model,
        contentType: original.contentType,
        sourceReview: original.sourceReview,
        photoId: original.photoId,
        voiceId: original.voiceId,
        status: "generating",
        duration: original.duration,
      },
    });

    // 3. Trigger generation via the internal generate endpoint
    const baseUrl = req.nextUrl.origin;
    const generateRes = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify({
        videoId: newVideo.id,
        model: original.model,
        script: original.script || "",
        format: original.contentType,
        photoId: original.photoId || undefined,
        voiceId: original.voiceId || undefined,
      }),
    });

    let generateData = null;
    if (generateRes.ok) {
      generateData = await generateRes.json();
    }

    return NextResponse.json({
      success: true,
      originalVideoId: original.id,
      newVideo: {
        id: newVideo.id,
        title: newVideo.title,
        status: newVideo.status,
        model: newVideo.model,
        contentType: newVideo.contentType,
      },
      generation: generateData,
    });
  } catch (error) {
    console.error("[POST /api/videos/:id/regenerate] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
