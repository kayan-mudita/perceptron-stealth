import { NextResponse } from "next/server";
import { requireAuth, errorResponse } from "@/lib/api-helpers";
import { getUsage } from "@/lib/usage";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const usage = await getUsage(user.id);

    return NextResponse.json({
      plan: usage.plan.plan,
      planLabel: usage.plan.label,
      videosUsed: usage.videosUsed,
      videosLimit: usage.videosLimit === Infinity ? null : usage.videosLimit,
      videosRemaining: usage.videosRemaining === Infinity ? null : usage.videosRemaining,
      canGenerate: usage.canGenerate,
      currentPeriodEnd: usage.plan.currentPeriodEnd?.toISOString() ?? null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch usage";
    console.error("Usage fetch error:", err);
    return errorResponse(message, 500);
  }
}
