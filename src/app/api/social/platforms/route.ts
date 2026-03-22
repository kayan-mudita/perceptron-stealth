import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { isPlatformConfigured } from "@/lib/social-oauth";

/**
 * GET /api/social/platforms
 *
 * Returns the configuration status for each social platform.
 * The client uses this to show disabled states and helpful tooltips
 * when OAuth credentials are not yet configured.
 */

const ALL_PLATFORMS = ["instagram", "youtube", "tiktok", "linkedin", "facebook"] as const;

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;

  const platforms = ALL_PLATFORMS.map((platform) => {
    const { configured, missingVars } = isPlatformConfigured(platform);
    return { platform, configured, missingVars };
  });

  return NextResponse.json(platforms);
}
