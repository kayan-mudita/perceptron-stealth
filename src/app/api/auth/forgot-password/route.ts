import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/forgot-password
 *
 * Legacy endpoint. Email-based password reset has been removed.
 * The frontend now redirects directly to /auth/reset-password
 * where users can reset their password with email + new password.
 *
 * This stub exists so old clients don't get a 404.
 */
export async function POST(req: NextRequest) {
  return NextResponse.json({
    message: "Email-based reset is no longer available. Please visit /auth/reset-password to reset your password directly.",
  });
}
