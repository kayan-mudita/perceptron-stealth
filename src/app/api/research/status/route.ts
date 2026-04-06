import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

/**
 * GET /api/research/status?id=xxx
 *
 * Returns the current state of all 4 research agents.
 * Frontend polls this every 2s to progressively render results.
 */
export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const sessionId = req.nextUrl.searchParams.get("id");
  if (!sessionId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const session = await prisma.researchSession.findFirst({
    where: { id: sessionId, userId: user.id },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: session.id,
    status: session.status,
    business: {
      status: session.businessStatus,
      result: session.businessResult ? JSON.parse(session.businessResult) : null,
    },
    trends: {
      status: session.trendsStatus,
      result: session.trendsResult ? JSON.parse(session.trendsResult) : null,
    },
    competitors: {
      status: session.competitorStatus,
      result: session.competitorResult ? JSON.parse(session.competitorResult) : null,
    },
    calendar: {
      status: session.calendarStatus,
      result: session.calendarResult ? JSON.parse(session.calendarResult) : null,
    },
  });
}
