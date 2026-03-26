import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { scheduleCreateSchema } from "@/lib/validations";
import { validateBody } from "@/lib/validate";

export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    const schedules = await prisma.schedule.findMany({
      where: { userId: user.id },
      include: { video: true },
      orderBy: { scheduledAt: "asc" },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("[GET /api/schedule] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validation = validateBody(scheduleCreateSchema, body);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error, fieldErrors: validation.fieldErrors },
        { status: 400 }
      );
    }

    const { videoId, platform, scheduledAt } = validation.data;

    const video = await prisma.video.findFirst({
      where: { id: videoId, userId: user.id, status: "approved" },
    });
    if (!video) {
      return NextResponse.json(
        { error: "Video not found or must be approved before scheduling" },
        { status: 400 }
      );
    }

    const schedule = await prisma.schedule.create({
      data: {
        videoId,
        userId: user.id,
        platform,
        scheduledAt: new Date(scheduledAt),
      },
      include: { video: true },
    });

    return NextResponse.json(
      {
        ...schedule,
        scheduledAt: schedule.scheduledAt.toISOString(),
        publishedAt: schedule.publishedAt?.toISOString() ?? null,
        createdAt: schedule.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/schedule] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
