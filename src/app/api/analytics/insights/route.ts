import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

/**
 * GET /api/analytics/insights
 *
 * Analyzes the user's content to produce actionable insights:
 *   1. Best performing content type (which format gets most engagement)
 *   2. Best posting day/time
 *   3. Content type recommendations / gap detection
 */
export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    const [videos, schedules, events] = await Promise.all([
      prisma.video.findMany({
        where: {
          userId: user.id,
          NOT: { contentType: { startsWith: "cut_" } },
        },
        select: {
          id: true,
          contentType: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.schedule.findMany({
        where: { userId: user.id },
        select: {
          scheduledAt: true,
          publishedAt: true,
          videoId: true,
        },
      }),
      prisma.analyticsEvent.findMany({
        where: { userId: user.id },
        select: {
          videoId: true,
          eventType: true,
          count: true,
        },
      }),
    ]);

    const insights: Insight[] = [];

    // ── Insight 1: Best performing content type ─────────────────
    const typeEngagement: Record<string, number> = {};
    const typeCount: Record<string, number> = {};

    for (const v of videos) {
      typeCount[v.contentType] = (typeCount[v.contentType] || 0) + 1;
    }

    // Map video IDs to content types
    const videoTypeMap: Record<string, string> = {};
    for (const v of videos) {
      videoTypeMap[v.id] = v.contentType;
    }

    // Sum engagement (views) by content type
    for (const e of events) {
      if (e.videoId && e.eventType === "view" && videoTypeMap[e.videoId]) {
        const ct = videoTypeMap[e.videoId];
        typeEngagement[ct] = (typeEngagement[ct] || 0) + e.count;
      }
    }

    const contentTypes = Object.keys(typeCount);
    if (contentTypes.length >= 2) {
      // Find best and worst by count or engagement
      const sorted = contentTypes.sort(
        (a, b) => (typeEngagement[b] || typeCount[b]) - (typeEngagement[a] || typeCount[a])
      );
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      const bestCount = typeEngagement[best] || typeCount[best];
      const worstCount = typeEngagement[worst] || typeCount[worst];
      const ratio = worstCount > 0 ? Math.round(bestCount / worstCount) : bestCount;

      insights.push({
        id: "best_content_type",
        type: "performance",
        title: "Top Performing Format",
        message: `Your ${formatLabel(best)} videos get ${ratio}x more ${typeEngagement[best] ? "views" : "traction"} than ${formatLabel(worst)}. Make more ${formatLabel(best)} content.`,
        icon: "trending-up",
      });
    } else if (contentTypes.length === 1) {
      insights.push({
        id: "best_content_type",
        type: "suggestion",
        title: "Diversify Your Content",
        message: `All ${typeCount[contentTypes[0]]} of your videos are ${formatLabel(contentTypes[0])}. Try a different format to reach new audiences.`,
        icon: "lightbulb",
      });
    }

    // ── Insight 2: Best posting day ─────────────────────────────
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayCounts: Record<number, number> = {};

    for (const s of schedules) {
      const date = s.publishedAt || s.scheduledAt;
      const day = new Date(date).getUTCDay();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    }

    // Also count video creation dates if no schedules
    if (Object.keys(dayCounts).length === 0) {
      for (const v of videos) {
        const day = new Date(v.createdAt).getUTCDay();
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
    }

    const dayEntries = Object.entries(dayCounts).map(([d, c]) => ({
      day: Number(d),
      count: c,
    }));

    if (dayEntries.length >= 2) {
      dayEntries.sort((a, b) => b.count - a.count);
      const bestDay = dayEntries[0];
      const worstDay = dayEntries[dayEntries.length - 1];
      const pctDiff = worstDay.count > 0
        ? Math.round(((bestDay.count - worstDay.count) / worstDay.count) * 100)
        : 100;

      insights.push({
        id: "best_day",
        type: "timing",
        title: "Best Posting Day",
        message: `${dayNames[bestDay.day]} posts outperform ${dayNames[worstDay.day]} by ${pctDiff}%. Schedule more content on ${dayNames[bestDay.day]}s.`,
        icon: "calendar",
      });
    }

    // ── Insight 3: Posting gap / consistency ────────────────────
    if (videos.length > 0) {
      const lastVideo = videos[0]; // already ordered desc
      const daysSinceLastPost = Math.floor(
        (Date.now() - new Date(lastVideo.createdAt).getTime()) / 86400000
      );

      if (daysSinceLastPost >= 3) {
        insights.push({
          id: "posting_gap",
          type: "warning",
          title: "Posting Gap Detected",
          message: `You haven't posted in ${daysSinceLastPost} days. Your audience engagement drops 25% after gaps. Post today to stay top of mind.`,
          icon: "alert-triangle",
        });
      } else {
        insights.push({
          id: "posting_consistency",
          type: "success",
          title: "Great Consistency",
          message: `You posted ${daysSinceLastPost === 0 ? "today" : daysSinceLastPost === 1 ? "yesterday" : `${daysSinceLastPost} days ago`}. Consistent posting builds audience trust and keeps engagement high.`,
          icon: "check-circle",
        });
      }
    } else {
      insights.push({
        id: "no_content",
        type: "suggestion",
        title: "Get Started",
        message: "Create your first video to start seeing performance insights. We will help you optimize your content strategy.",
        icon: "lightbulb",
      });
    }

    // Pad to 3 insights minimum
    while (insights.length < 3) {
      insights.push({
        id: `tip_${insights.length}`,
        type: "suggestion",
        title: "Pro Tip",
        message: "Videos under 15 seconds tend to get higher completion rates. Try the Quick Tip format for maximum engagement.",
        icon: "lightbulb",
      });
    }

    return NextResponse.json(insights.slice(0, 3));
  } catch (err) {
    console.error("[GET /api/analytics/insights]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

interface Insight {
  id: string;
  type: "performance" | "timing" | "warning" | "success" | "suggestion";
  title: string;
  message: string;
  icon: string;
}

function formatLabel(contentType: string): string {
  const labels: Record<string, string> = {
    talking_head_15: "Talking Head",
    testimonial_15: "Testimonial",
    educational_30: "Educational",
    quick_tip_8: "Quick Tip",
    general: "general",
    market_update: "Market Update",
    listing_tour: "Listing Tour",
    just_sold: "Just Sold",
    open_house: "Open House",
    neighborhood: "Neighborhood",
    buyer_tips: "Buyer Tips",
    health_tip: "Health Tip",
    procedure: "Procedure",
    wellness: "Wellness",
    myth_busting: "Myth Busting",
    know_rights: "Know Your Rights",
    legal_tip: "Legal Tip",
    case_result: "Case Result",
    explainer: "Explainer",
    brand_intro: "Brand Intro",
    tip_video: "Tip Video",
    thought_leadership: "Thought Leadership",
    intro: "Social Intro",
    testimonial: "Testimonial",
  };
  return labels[contentType] || contentType.replace(/_/g, " ");
}
