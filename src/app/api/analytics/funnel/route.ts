import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

/**
 * GET /api/analytics/funnel
 *
 * Returns onboarding funnel drop-off data.
 * Counts unique users who reached each step.
 * Admin-only in production; for now, requires auth.
 */

const FUNNEL_STEPS = [
  { event: "onboarding_step_photo", label: "Photo", step: 1 },
  { event: "onboarding_photo_captured", label: "Photo Captured", step: 1.5 },
  { event: "onboarding_step_character", label: "Character Sheet", step: 2 },
  { event: "onboarding_character_selected", label: "Sheet Selected", step: 2.5 },
  { event: "onboarding_step_voice", label: "Voice Clone", step: 3 },
  { event: "onboarding_voice_cloned", label: "Voice Cloned", step: 3.5 },
  { event: "onboarding_voice_skipped", label: "Voice Skipped", step: 3.6 },
  { event: "onboarding_step_paywall", label: "Paywall", step: 4 },
  { event: "onboarding_paywall_viewed", label: "Paywall Viewed", step: 4.5 },
  { event: "onboarding_trial_started", label: "Trial Started", step: 5 },
  { event: "onboarding_skipped", label: "Skipped Paywall", step: 5.1 },
  { event: "onboarding_industry_selected", label: "Industry Selected", step: 6 },
] as const;

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    // Count unique users per funnel step
    const counts = await Promise.all(
      FUNNEL_STEPS.map(async ({ event, label, step }) => {
        const count = await prisma.lifecycleEvent.groupBy({
          by: ["userId"],
          where: { event },
        });
        return { event, label, step, uniqueUsers: count.length };
      })
    );

    // Total signups for the denominator
    const totalSignups = await prisma.user.count();

    // Calculate conversion rates
    const funnel = counts.map((c) => ({
      ...c,
      conversionFromSignup:
        totalSignups > 0 ? Math.round((c.uniqueUsers / totalSignups) * 100) : 0,
    }));

    // Time-series: signups per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEvents = await prisma.lifecycleEvent.findMany({
      where: {
        event: { in: FUNNEL_STEPS.map((s) => s.event) },
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { event: true, createdAt: true, userId: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      totalSignups,
      funnel,
      recentEvents: recentEvents.length,
    });
  } catch (err: any) {
    console.error("[GET /api/analytics/funnel]", err);
    return NextResponse.json(
      { error: "Failed to fetch funnel data" },
      { status: 500 }
    );
  }
}
