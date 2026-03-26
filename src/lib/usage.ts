import prisma from "./prisma";
import { getPlan, PlanInfo, isStripeConfigured, FREE_VIDEO_LIMIT } from "./stripe";

export interface UsageInfo {
  plan: PlanInfo;
  videosUsed: number;
  videosLimit: number;
  canGenerate: boolean;
  /** Number of videos remaining before hitting the limit */
  videosRemaining: number;
}

/**
 * Count videos created by a user in the current billing month.
 * We count from the 1st of the current month in UTC.
 */
async function countVideosThisMonth(userId: string): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  return prisma.video.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });
}

/**
 * Get usage information for a user. Used for both display and enforcement.
 *
 * If Stripe is not configured, enforcement is skipped and all users
 * are treated as having unlimited access (development mode).
 */
export async function getUsage(userId: string): Promise<UsageInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If Stripe is not configured, enforce the free tier limit (1 video)
  // so the UI correctly shows "0 of 1" instead of "0 (unlimited)".
  if (!isStripeConfigured()) {
    const videosUsed = await countVideosThisMonth(userId);
    const videosLimit = FREE_VIDEO_LIMIT;
    const videosRemaining = Math.max(0, videosLimit - videosUsed);
    return {
      plan: {
        plan: (user.plan as any) || "free",
        label: "Free",
        videoLimit: videosLimit,
        isActive: true,
        currentPeriodEnd: null,
      },
      videosUsed,
      videosLimit,
      canGenerate: videosRemaining > 0,
      videosRemaining,
    };
  }

  const planInfo = getPlan(user);
  const videosUsed = await countVideosThisMonth(userId);
  const videosLimit = planInfo.videoLimit;
  const videosRemaining = Math.max(0, videosLimit - videosUsed);
  const canGenerate = videosRemaining > 0;

  return {
    plan: planInfo,
    videosUsed,
    videosLimit,
    canGenerate,
    videosRemaining,
  };
}

/**
 * Quick check that throws if the user has exceeded their plan limit.
 * Call this before generating a video.
 */
export async function enforceUsageLimit(userId: string): Promise<UsageInfo> {
  const usage = await getUsage(userId);
  if (!usage.canGenerate) {
    const err = new UsageLimitError(
      `You have used all ${usage.videosLimit} videos for this month. Upgrade your plan for more.`,
      usage
    );
    throw err;
  }
  return usage;
}

export class UsageLimitError extends Error {
  public usage: UsageInfo;
  constructor(message: string, usage: UsageInfo) {
    super(message);
    this.name = "UsageLimitError";
    this.usage = usage;
  }
}
