import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { isValidPlatform, getAuthorizationUrl } from "@/lib/social-oauth";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { error } = await requireAuth();
  if (error) return error;

  const { platform } = params;

  if (!isValidPlatform(platform)) {
    return NextResponse.json(
      { error: `Invalid platform: ${platform}. Valid platforms: instagram, youtube, tiktok, linkedin, facebook` },
      { status: 400 }
    );
  }

  try {
    // Generate a random state parameter for CSRF protection
    const state = uuidv4();

    // Store state in a cookie for verification in the callback
    const authUrl = getAuthorizationUrl(platform, state);

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
    return NextResponse.json(
      { error: err.message || "Failed to generate authorization URL" },
      { status: 500 }
    );
  }
}
