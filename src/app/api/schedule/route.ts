import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  const schedules = await prisma.schedule.findMany({
    where: { userId: user.id },
    include: { video: true },
    orderBy: { scheduledAt: "asc" },
  });
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { videoId, platform, scheduledAt } = await req.json();

  const video = await prisma.video.findFirst({
    where: { id: videoId, userId: user.id, status: "approved" },
  });
  if (!video) {
    return NextResponse.json({ error: "Video must be approved before scheduling" }, { status: 400 });
  }

  const schedule = await prisma.schedule.create({
    data: {
      videoId,
      userId: user.id,
      platform,
      scheduledAt: new Date(scheduledAt),
    },
  });

  return NextResponse.json(schedule);
}
