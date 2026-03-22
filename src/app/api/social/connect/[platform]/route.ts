import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { isValidPlatform, isPlatformConfigured, getAuthorizationUrl } from "@/lib/social-oauth";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { platform } = params;
  const settingsUrl = new URL("/dashboard/settings", req.url);
  settingsUrl.searchParams.set("tab", "social");

  if (!isValidPlatform(platform)) {
    settingsUrl.searchParams.set(
      "error",
      `Invalid platform: ${platform}. Supported: Instagram, YouTube, TikTok, LinkedIn, Facebook.`
    );
    return NextResponse.redirect(settingsUrl);
  }

  // Check if OAuth credentials are configured before attempting redirect
  const { configured, missingVars } = isPlatformConfigured(platform);
  if (!configured) {
    settingsUrl.searchParams.set(
      "error",
      `Cannot connect ${platform} — missing environment variable${missingVars.length > 1 ? "s" : ""}: ${missingVars.join(", ")}. Add them to your .env file to enable this platform.`
    );
    return NextResponse.redirect(settingsUrl);
  }

  try {
    // Generate a random state parameter for CSRF protection
    const state = uuidv4();

    const authUrl = getAuthorizationUrl(platform, state);

    // Store state in a cookie for verification in the callback
    const response = NextResponse.redirect(authUrl);
    response.cookies.set(`oauth_state_${platform}`, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error(`OAuth connect error for ${platform}:`, err);
    settingsUrl.searchParams.set(
      "error",
      err.message || `Failed to initiate ${platform} connection`
    );
    return NextResponse.redirect(settingsUrl);
  }
}
