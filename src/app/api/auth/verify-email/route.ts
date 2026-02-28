import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login?error=missing-token", req.url)
      );
    }

    const verificationToken =
      await prisma.emailVerificationToken.findUnique({
        where: { token },
      });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid-token", req.url)
      );
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      return NextResponse.redirect(
        new URL("/auth/login?error=expired-token", req.url)
      );
    }

    // Mark user as verified and delete the token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
      }),
      prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ]);

    return NextResponse.redirect(
      new URL("/auth/login?verified=true", req.url)
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=verification-failed", req.url)
    );
  }
}
