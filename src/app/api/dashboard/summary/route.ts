import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

/**
 * GET /api/dashboard/summary
 *
 * Aggregated endpoint for the dashboard landing page.
 * Returns setup status (face/voice/business), pending approvals,
 * and analytics summary in a single request.
 */
export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    // Run all queries in parallel
    const [
      photos,
      voiceSamples,
      brandProfile,
      pendingVideos,
      videoStats,
      analyticsAgg,
      socialAccounts,
      streakData,
    ] = await Promise.all([
      // Face status
      prisma.photo.findMany({
        where: { userId: user.id },
        select: { id: true, url: true, isPrimary: true, photoAnalysis: true },
      }),

      // Voice status
      prisma.voiceSample.findMany({
        where: { userId: user.id },
        select: { id: true, providerVoiceId: true },
      }),

      // Business status
      prisma.brandProfile.findUnique({
        where: { userId: user.id },
        select: { brandName: true, tagline: true, toneOfVoice: true, targetAudience: true },
      }),

      // Pending approvals
      prisma.video.findMany({
        where: {
          userId: user.id,
          status: "review",
          NOT: { contentType: { startsWith: "cut_" } },
        },
        select: {
          id: true,
          title: true,
          description: true,
          contentType: true,
          model: true,
          videoUrl: true,
          thumbnailUrl: true,
          duration: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),

      // Video counts
      prisma.video.groupBy({
        by: ["status"],
        where: {
          userId: user.id,
          NOT: { contentType: { startsWith: "cut_" } },
        },
        _count: true,
      }),

      // Analytics totals
      prisma.analyticsEvent.aggregate({
        where: { userId: user.id },
        _sum: { count: true },
      }),

      // Connected platforms
      prisma.socialAccount.findMany({
        where: { userId: user.id, connected: true },
        select: { platform: true },
      }),

      // Streak (inline calculation)
      getStreak(user.id),
    ]);

    // ── Compute face status ──
    const primaryPhoto = photos.find((p) => p.isPrimary);
    const hasAnalysis = photos.some((p) => p.photoAnalysis);
    const faceStatus =
      photos.length === 0
        ? "missing"
        : photos.length >= 1 && primaryPhoto
        ? "complete"
        : "needs_improvement";

    // ── Compute voice status ──
    const hasClone = voiceSamples.some((v) => v.providerVoiceId);
    const voiceStatus =
      voiceSamples.length === 0
        ? "missing"
        : hasClone
        ? "complete"
        : "needs_improvement";

    // ── Compute business status ──
    const hasIndustry = !!user.industry && user.industry !== "other";
    const hasBrandProfile = !!brandProfile?.brandName;
    const businessStatus =
      hasIndustry && hasBrandProfile
        ? "complete"
        : hasIndustry || hasBrandProfile
        ? "needs_improvement"
        : "missing";

    const allGreen =
      faceStatus === "complete" &&
      voiceStatus === "complete" &&
      businessStatus === "complete";

    // ── Video stats ──
    const totalVideos = videoStats.reduce((sum, g) => sum + g._count, 0);
    const publishedVideos =
      videoStats.find((g) => g.status === "published")?._count || 0;

    return NextResponse.json({
      setup: {
        face: {
          status: faceStatus,
          photoCount: photos.length,
          hasPrimary: !!primaryPhoto,
          hasAnalysis,
          primaryPhotoUrl: primaryPhoto?.url || null,
        },
        voice: {
          status: voiceStatus,
          sampleCount: voiceSamples.length,
          hasClone,
        },
        business: {
          status: businessStatus,
          hasIndustry,
          hasBrandProfile,
        },
      },
      allGreen,
      pendingApprovals: pendingVideos,
      stats: {
        totalVideos,
        publishedVideos,
        totalViews: analyticsAgg._sum.count || 0,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        connectedPlatforms: socialAccounts.length,
      },
    });
  } catch (err) {
    console.error("[GET /api/dashboard/summary]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── Inline streak calculation (mirrors /api/streak logic) ──

async function getStreak(userId: string) {
  const [schedules, publishedVideos] = await Promise.all([
    prisma.schedule.findMany({
      where: { userId, publishedAt: { not: null } },
      select: { publishedAt: true },
    }),
    prisma.video.findMany({
      where: { userId, status: "published" },
      select: { createdAt: true },
    }),
  ]);

  const daySet = new Set<string>();
  for (const s of schedules) {
    if (s.publishedAt) daySet.add(s.publishedAt.toISOString().split("T")[0]);
  }
  for (const v of publishedVideos) {
    daySet.add(v.createdAt.toISOString().split("T")[0]);
  }

  const sortedDays = Array.from(daySet).sort().reverse();
  if (sortedDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  let currentStreak = 0;

  if (sortedDays[0] === today || sortedDays[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prev = new Date(sortedDays[i - 1] + "T00:00:00Z");
      const curr = new Date(sortedDays[i] + "T00:00:00Z");
      if ((prev.getTime() - curr.getTime()) / 86400000 === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  const chronological = Array.from(daySet).sort();
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < chronological.length; i++) {
    const prev = new Date(chronological[i - 1] + "T00:00:00Z");
    const curr = new Date(chronological[i] + "T00:00:00Z");
    if ((curr.getTime() - prev.getTime()) / 86400000 === 1) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 1;
    }
  }

  return { currentStreak, longestStreak };
}
