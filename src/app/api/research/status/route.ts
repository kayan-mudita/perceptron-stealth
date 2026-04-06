import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

/**
 * GET /api/research/status?id=xxx
 *
 * Returns the current state of all 4 research agents.
 * Frontend polls this every 2s to progressively render results.
 */

function safeParse(json: string | null): unknown {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

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
      result: safeParse(session.businessResult),
    },
    trends: {
      status: session.trendsStatus,
      result: safeParse(session.trendsResult),
    },
    competitors: {
      status: session.competitorStatus,
      result: safeParse(session.competitorResult),
    },
    calendar: {
      status: session.calendarStatus,
      result: safeParse(session.calendarResult),
    },
  });
}
