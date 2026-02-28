import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";
import { validateBody } from "@/lib/validate";
import { authLimiter, RateLimitError } from "@/lib/rate-limit";
import { sendWelcomeEmail, sendEmailVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 requests per minute per IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    try {
      await authLimiter.check(5, ip);
    } catch (err) {
      if (err instanceof RateLimitError) {
        return NextResponse.json(
          { error: "Too many signup attempts. Please try again later." },
          { status: 429, headers: { "Retry-After": String(err.retryAfter) } }
        );
      }
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validation = validateBody(signupSchema, body);
    if (validation.error) {
      return NextResponse.json(
        { error: validation.error, fieldErrors: validation.fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, industry, company } = validation.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        industry: industry || "other",
        company,
      },
    });

    // Generate email verification token (24 hour expiry)
    const verificationToken = randomBytes(32).toString("hex");
    await prisma.emailVerificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Send emails (fire-and-forget so signup is not blocked by email delivery)
    const userInfo = { email: user.email, firstName: user.firstName };
    sendEmailVerificationEmail(userInfo, verificationToken).catch((err) =>
      console.error("Failed to send verification email:", err)
    );
    sendWelcomeEmail(userInfo).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error("[POST /api/auth/signup] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
