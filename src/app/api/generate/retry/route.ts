import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

/**
 * POST /api/generate/retry
 *
 * Resets a failed video so the generation pipeline can be re-triggered from the
 * beginning. This:
 *   1. Validates the video belongs to the user and is in "failed" status
 *   2. Resets status to "generating"
 *   3. Clears step metadata (cutJobs, error, pipelineStep) from sourceReview
 *      while preserving the original cut definitions and format
 *   4. Returns the reset video so the frontend can re-drive the pipeline
 */
export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { videoId } = body as { videoId: string };

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    const video = await prisma.video.findFirst({
      where: { id: videoId, userId: user.id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (video.status !== "failed") {
      return NextResponse.json(
        { error: `Cannot retry a video with status "${video.status}". Only failed videos can be retried.` },
        { status: 400 }
      );
    }

    // Clear step metadata but preserve original script / format info
    // The expand step will re-populate cuts and cutJobs from scratch
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        status: "generating",
        sourceReview: null, // Clear all pipeline metadata so it starts fresh
        videoUrl: null,
        thumbnailUrl: null,
      },
    });

    return NextResponse.json({
      video: updatedVideo,
      message: "Video reset for retry. Re-trigger the pipeline from the expand step.",
    });
  } catch (error) {
    console.error("[POST /api/generate/retry] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
