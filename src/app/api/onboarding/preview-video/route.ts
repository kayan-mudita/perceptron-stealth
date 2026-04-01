import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const { characterSheetUrl, photoUrl } = await req.json();

    // TODO: Trigger video generation pipeline
    // 1. Generate script via LLM (Haiku) based on user industry
    // 2. Generate voice audio from cloned voice (or stock voice if skipped)
    // 3. Generate talking-head video via Sora 2 / Kling using character sheet
    // 4. Return the rendered video URL

    // Stub: return null videoUrl for now — the paywall handles this gracefully
    return NextResponse.json({
      success: true,
      videoUrl: null,
      message: "Video generation pipeline not yet connected",
    });
  } catch (err: any) {
    console.error("Preview video generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate preview video" },
      { status: 500 }
    );
  }
}
