import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

/**
 * GET /api/streak
 *
 * Calculates the user's current posting streak (consecutive days with
 * at least one published video) and their longest streak ever.
 *
 * A "published" day is determined by:
 *   1. Schedule.publishedAt (if the video was published via scheduling)
 *   2. Video.createdAt for videos with status "published"
 */
export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    // Fetch all published dates: scheduled publishes + directly published videos
    const [schedules, publishedVideos] = await Promise.all([
      prisma.schedule.findMany({
        where: { userId: user.id, publishedAt: { not: null } },
        select: { publishedAt: true },
      }),
      prisma.video.findMany({
        where: { userId: user.id, status: "published" },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Collect unique days (YYYY-MM-DD in UTC)
    const daySet = new Set<string>();

    for (const s of schedules) {
      if (s.publishedAt) {
        daySet.add(toDateKey(s.publishedAt));
      }
    }
    for (const v of publishedVideos) {
      daySet.add(toDateKey(v.createdAt));
    }

    const sortedDays = Array.from(daySet).sort().reverse(); // newest first

    if (sortedDays.length === 0) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        lastPublishedAt: null,
      });
    }

    // Calculate current streak (must include today or yesterday)
    const today = toDateKey(new Date());
    const yesterday = toDateKey(new Date(Date.now() - 86400000));
    let currentStreak = 0;

    if (sortedDays[0] === today || sortedDays[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < sortedDays.length; i++) {
        const prev = new Date(sortedDays[i - 1] + "T00:00:00Z");
        const curr = new Date(sortedDays[i] + "T00:00:00Z");
        const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak ever
    const chronological = Array.from(daySet).sort(); // oldest first
    let longestStreak = 1;
    let runLength = 1;

    for (let i = 1; i < chronological.length; i++) {
      const prev = new Date(chronological[i - 1] + "T00:00:00Z");
      const curr = new Date(chronological[i] + "T00:00:00Z");
      const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
      if (diffDays === 1) {
        runLength++;
        longestStreak = Math.max(longestStreak, runLength);
      } else {
        runLength = 1;
      }
    }

    return NextResponse.json({
      currentStreak,
      longestStreak,
      lastPublishedAt: sortedDays[0],
    });
  } catch (err) {
    console.error("[GET /api/streak]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}
