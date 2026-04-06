import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { launchResearch } from "@/lib/research-agents";

/**
 * POST /api/research/launch
 *
 * Fires 4 parallel research agents to build a content strategy.
 * Returns immediately with a sessionId (202 Accepted).
 * Frontend polls GET /api/research/status?id=xxx for progress.
 */
export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const { industry, companyName, websiteUrl } = body;

  if (!industry || !companyName) {
    return NextResponse.json(
      { error: "industry and companyName are required" },
      { status: 400 }
    );
  }

  // Update user's industry + company if changed
  await prisma.user.update({
    where: { id: user.id },
    data: { industry, company: companyName },
  });

  // Create research session
  const session = await prisma.researchSession.create({
    data: {
      userId: user.id,
      industry,
      companyName,
      websiteUrl: websiteUrl || null,
      status: "processing",
    },
  });

  // Fire agents in the background — don't await
  launchResearch(session.id, { industry, companyName, websiteUrl }).catch(async (e) => {
    console.error("[research/launch] Background agents failed:", e);
    try {
      await prisma.researchSession.update({
        where: { id: session.id },
        data: { status: "failed", completedAt: new Date() },
      });
    } catch (dbError) {
      console.error("[research/launch] CRITICAL: Failed to mark session as failed:", dbError);
    }
  });

  return NextResponse.json({ sessionId: session.id }, { status: 202 });
}
