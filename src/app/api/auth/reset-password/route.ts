import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authLimiter, RateLimitError } from "@/lib/rate-limit";

/**
 * POST /api/auth/reset-password
 *
 * Direct password reset without email verification.
 * Accepts { email, password } and updates the user's password.
 *
 * This is a simplified flow for beta/internal use since email
 * functionality has been removed from the platform.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP to prevent brute-force password changes
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    try {
      await authLimiter.check(5, ip);
    } catch (err) {
      if (err instanceof RateLimitError) {
        return NextResponse.json(
          { error: "Too many attempts. Please try again later." },
          { status: 429, headers: { "Retry-After": String(err.retryAfter) } }
        );
      }
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Look up the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Return a generic message to avoid leaking whether the email exists
      return NextResponse.json(
        { error: "If an account exists for that email, the password has been reset." },
        // Still return 200 to not reveal account existence
        { status: 200 }
      );
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("[POST /api/auth/reset-password] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
