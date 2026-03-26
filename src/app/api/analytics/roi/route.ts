import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, errorResponse } from "@/lib/api-helpers";

/**
 * Hourly rate by industry used to calculate the dollar value of time saved.
 * Each video is estimated to replace 45 minutes of traditional creation.
 */
const HOURLY_RATES: Record<string, number> = {
  real_estate: 75,
  legal: 250,
  medical: 200,
  financial: 150,
  creator: 100,
  business: 125,
  technology: 150,
  other: 100,
};

const MINUTES_SAVED_PER_VIDEO = 45;
const SUBSCRIPTION_COST = 79;

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    // Get user industry
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { industry: true, plan: true },
    });

    if (!dbUser) {
      return errorResponse("User not found", 404);
    }

    // Count videos created this month
    const videosThisMonth = await prisma.video.count({
      where: {
        userId: user.id,
        createdAt: { gte: startOfMonth },
        NOT: { contentType: { startsWith: "cut_" } },
      },
    });

    // Count all-time videos
    const totalVideos = await prisma.video.count({
      where: {
        userId: user.id,
        NOT: { contentType: { startsWith: "cut_" } },
      },
    });

    const hourlyRate = HOURLY_RATES[dbUser.industry] || HOURLY_RATES.other;
    const minutesSaved = videosThisMonth * MINUTES_SAVED_PER_VIDEO;
    const hoursSaved = minutesSaved / 60;
    const dollarValueSaved = hoursSaved * hourlyRate;
    const roiMultiplier = SUBSCRIPTION_COST > 0 ? Math.round(dollarValueSaved / SUBSCRIPTION_COST) : 0;

    return NextResponse.json({
      videosThisMonth,
      totalVideos,
      hoursSaved: Math.round(hoursSaved * 10) / 10,
      minutesSaved,
      dollarValueSaved: Math.round(dollarValueSaved),
      hourlyRate,
      roiMultiplier,
      subscriptionCost: SUBSCRIPTION_COST,
      industry: dbUser.industry,
      plan: dbUser.plan,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to calculate ROI";
    console.error("ROI calculation error:", err);
    return errorResponse(message, 500);
  }
}
