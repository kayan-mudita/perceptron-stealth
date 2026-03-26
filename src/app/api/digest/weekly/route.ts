import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

/**
 * GET /api/digest/weekly
 *
 * Compiles a weekly digest of activity for the authenticated user:
 * - Videos created this week
 * - Total views/engagement (placeholder data for now)
 * - Videos pending approval
 * - Suggested content for next week
 *
 * Returns JSON. Email sending can be integrated later.
 */
export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    // Calculate week boundaries (Monday to Sunday)
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(now.getDate() - mondayOffset);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // 1. Videos created this week
    const videosThisWeek = await prisma.video.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: startOfWeek, lt: endOfWeek },
        NOT: { contentType: { startsWith: "cut_" } },
      },
      select: {
        id: true,
        title: true,
        status: true,
        model: true,
        contentType: true,
        duration: true,
        createdAt: true,
        videoUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Videos pending approval
    const pendingApproval = await prisma.video.findMany({
      where: {
        userId: user.id,
        status: "review",
        NOT: { contentType: { startsWith: "cut_" } },
      },
      select: {
        id: true,
        title: true,
        model: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 3. Engagement stats (placeholder data for now)
    // In production, these would come from analytics events or platform APIs
    const publishedThisWeek = videosThisWeek.filter((v) => v.status === "published");
    const engagement = {
      totalViews: publishedThisWeek.length * Math.floor(Math.random() * 500 + 200),
      totalLikes: publishedThisWeek.length * Math.floor(Math.random() * 50 + 10),
      totalComments: publishedThisWeek.length * Math.floor(Math.random() * 15 + 3),
      totalShares: publishedThisWeek.length * Math.floor(Math.random() * 8 + 1),
      topPerformingVideo: publishedThisWeek.length > 0 ? {
        id: publishedThisWeek[0].id,
        title: publishedThisWeek[0].title,
        views: Math.floor(Math.random() * 1000 + 500),
      } : null,
      note: "Engagement data is placeholder. Integrate platform analytics for real metrics.",
    };

    // 4. Suggested content for next week
    const nextWeekSuggestions = [
      { day: "Monday", topic: "Industry Update", format: "talking_head_15" },
      { day: "Tuesday", topic: "Educational Deep Dive", format: "educational_30" },
      { day: "Wednesday", topic: "Quick Tip", format: "quick_tip_8" },
      { day: "Thursday", topic: "Client Story", format: "testimonial_15" },
      { day: "Friday", topic: "Behind the Scenes", format: "talking_head_15" },
    ];

    // 5. Summary stats
    const summary = {
      videosCreated: videosThisWeek.length,
      videosPublished: publishedThisWeek.length,
      videosPendingApproval: pendingApproval.length,
      videosFailed: videosThisWeek.filter((v) => v.status === "failed").length,
      totalDurationSeconds: videosThisWeek.reduce((sum, v) => sum + v.duration, 0),
    };

    return NextResponse.json({
      weekOf: startOfWeek.toISOString().split("T")[0],
      weekEnd: endOfWeek.toISOString().split("T")[0],
      generatedAt: now.toISOString(),
      user: {
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
      summary,
      videosThisWeek,
      pendingApproval,
      engagement,
      nextWeekSuggestions,
    });
  } catch (error) {
    console.error("[GET /api/digest/weekly] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
