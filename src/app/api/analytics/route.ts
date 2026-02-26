import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  // Aggregate analytics
  const totalVideos = await prisma.video.count({ where: { userId: user.id } });
  const publishedVideos = await prisma.video.count({
    where: { userId: user.id, status: "published" },
  });
  const pendingApproval = await prisma.video.count({
    where: { userId: user.id, status: "review" },
  });
  const scheduledPosts = await prisma.schedule.count({
    where: { userId: user.id, status: "scheduled" },
  });

  // Get analytics events summary
  const events = await prisma.analyticsEvent.groupBy({
    by: ["eventType"],
    where: { userId: user.id },
    _sum: { count: true },
  });

  const eventMap: Record<string, number> = {};
  events.forEach((e) => {
    eventMap[e.eventType] = e._sum.count || 0;
  });

  // Recent videos
  const recentVideos = await prisma.video.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { schedule: true },
  });

  return NextResponse.json({
    overview: {
      totalVideos,
      publishedVideos,
      pendingApproval,
      scheduledPosts,
      totalViews: eventMap.view || 0,
      totalLikes: eventMap.like || 0,
      totalShares: eventMap.share || 0,
      totalComments: eventMap.comment || 0,
    },
    recentVideos,
  });
}
