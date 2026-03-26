import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public endpoint -- no auth required
// Returns video metadata for the public share page
export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const videoId = params.videoId;
    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true,
        thumbnailUrl: true,
        duration: true,
        contentType: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Only show published/completed videos publicly
    if (video.status !== "complete" && video.status !== "published") {
      return NextResponse.json(
        { error: "Video is not available for sharing" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: video.id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      contentType: video.contentType,
      createdAt: video.createdAt,
      creator: {
        name: `${video.user.firstName} ${video.user.lastName}`,
        avatarUrl: video.user.avatarUrl,
      },
    });
  } catch (err) {
    console.error("[GET /api/share/:videoId]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
