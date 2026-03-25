import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { generateStartingFrame, getStartingFrameUrl } from "@/lib/starting-frame";

/**
 * POST /api/starting-frame
 *
 * Generates the starting frame (anchor image) used for every video cut.
 * This ensures character consistency across all generated video segments.
 *
 * The starting frame combines the user's photos + character sheet reference
 * to create a high-quality portrait in their industry-appropriate setting.
 *
 * Called during onboarding (after character sheet generation) and can
 * also be called manually to regenerate with a different scene.
 */
export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    let body: { sceneDescription?: string; industry?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional — defaults will be used
    }

    const result = await generateStartingFrame(
      user.id,
      body.sceneDescription
    );

    return NextResponse.json({
      imageUrl: result.imageUrl,
      photoId: result.photoId,
      status: result.status,
      isPermanent: result.imageUrl ? !result.imageUrl.startsWith("data:") : false,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate starting frame";
    console.error("[POST /api/starting-frame]", err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/starting-frame
 *
 * Returns the current starting frame URL for the authenticated user,
 * without generating a new one. Useful for checking status.
 */
export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    const url = await getStartingFrameUrl(user.id);

    return NextResponse.json({
      imageUrl: url,
      exists: !!url,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to check starting frame";
    console.error("[GET /api/starting-frame]", err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
