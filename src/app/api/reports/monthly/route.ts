import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get this month's videos
    const thisMonthVideos = await prisma.video.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: startOfMonth },
        NOT: { contentType: { startsWith: "cut_" } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get last month's videos for comparison
    const lastMonthVideos = await prisma.video.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        NOT: { contentType: { startsWith: "cut_" } },
      },
    });

    // Get analytics events for this month
    const thisMonthEvents = await prisma.analyticsEvent.findMany({
      where: {
        userId: user.id,
        date: { gte: startOfMonth },
      },
    });

    // Aggregate events
    const eventTotals: Record<string, number> = {};
    for (const e of thisMonthEvents) {
      eventTotals[e.eventType] = (eventTotals[e.eventType] || 0) + e.count;
    }

    const totalViews = eventTotals.view || 0;
    const totalLikes = eventTotals.like || 0;
    const totalShares = eventTotals.share || 0;
    const totalComments = eventTotals.comment || 0;

    // Calculate estimated reach (views + shares * 3 for amplification)
    const estimatedReach = totalViews + (totalShares * 3);

    // Find best performing video (by views or by engagement proxy)
    let bestVideo = null;
    if (thisMonthVideos.length > 0) {
      // Get per-video engagement
      const videoEvents = await prisma.analyticsEvent.groupBy({
        by: ["videoId"],
        where: {
          userId: user.id,
          date: { gte: startOfMonth },
          videoId: { not: null },
        },
        _sum: { count: true },
      });

      const videoEngagement: Record<string, number> = {};
      for (const ve of videoEvents) {
        if (ve.videoId) {
          videoEngagement[ve.videoId] = ve._sum.count || 0;
        }
      }

      // Sort videos by engagement, fall back to most recent
      const sortedVideos = [...thisMonthVideos].sort((a, b) => {
        const engA = videoEngagement[a.id] || 0;
        const engB = videoEngagement[b.id] || 0;
        return engB - engA;
      });

      const best = sortedVideos[0];
      bestVideo = {
        id: best.id,
        title: best.title,
        contentType: best.contentType,
        views: videoEngagement[best.id] || 0,
        engagement: videoEngagement[best.id] || 0,
        createdAt: best.createdAt,
      };
    }

    // Growth rate calculation
    const thisMonthCount = thisMonthVideos.length;
    const lastMonthCount = lastMonthVideos.length;
    const growthRate = lastMonthCount > 0
      ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
      : thisMonthCount > 0 ? 100 : 0;

    // Content type breakdown
    const contentTypeBreakdown: Record<string, number> = {};
    for (const v of thisMonthVideos) {
      contentTypeBreakdown[v.contentType] = (contentTypeBreakdown[v.contentType] || 0) + 1;
    }

    // Published vs draft ratio
    const publishedThisMonth = thisMonthVideos.filter(v => v.status === "published").length;

    // ROI calculation (estimated)
    // Assuming $50 avg cost per video (AI generation), value per engagement at $0.10
    const estimatedCost = thisMonthCount * 50;
    const estimatedEngagementValue = (totalViews * 0.01) + (totalLikes * 0.05) + (totalShares * 0.15) + (totalComments * 0.10);
    const roi = estimatedCost > 0
      ? Math.round((estimatedEngagementValue / estimatedCost) * 100)
      : 0;

    // Recommended content types for next month
    const recommendations: string[] = [];
    const topContentTypes = Object.entries(contentTypeBreakdown)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type);

    if (topContentTypes.length > 0) {
      recommendations.push(`Continue creating ${formatContentType(topContentTypes[0])} content - it's your most produced format this month.`);
    }
    if (thisMonthCount < 16) {
      recommendations.push("Increase posting frequency to at least 4 videos per week for optimal algorithm engagement.");
    }
    if (publishedThisMonth < thisMonthCount * 0.7) {
      recommendations.push("You have drafts that haven't been published. Review and publish pending content to maximize reach.");
    }
    if (totalShares < totalViews * 0.02) {
      recommendations.push("Focus on creating more shareable content. Add strong call-to-actions and value-packed tips.");
    }
    recommendations.push("Experiment with a new content format you haven't tried yet to diversify your audience.");

    const report = {
      period: {
        month: now.toLocaleString("en-US", { month: "long" }),
        year: now.getFullYear(),
        startDate: startOfMonth.toISOString(),
        endDate: now.toISOString(),
      },
      summary: {
        totalVideosPosted: thisMonthCount,
        publishedVideos: publishedThisMonth,
        totalEstimatedReach: estimatedReach,
        totalViews,
        totalLikes,
        totalShares,
        totalComments,
      },
      bestPerformingVideo: bestVideo,
      growth: {
        thisMonth: thisMonthCount,
        lastMonth: lastMonthCount,
        growthRate,
        trend: growthRate > 0 ? "up" : growthRate < 0 ? "down" : "flat",
      },
      roi: {
        estimatedCost,
        estimatedEngagementValue: Math.round(estimatedEngagementValue * 100) / 100,
        roiPercentage: roi,
      },
      contentTypeBreakdown,
      recommendations: recommendations.slice(0, 4),
      generatedAt: now.toISOString(),
    };

    return NextResponse.json(report);
  } catch (err) {
    console.error("[GET /api/reports/monthly]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function formatContentType(ct: string): string {
  return ct
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
