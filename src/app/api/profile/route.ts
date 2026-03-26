import { NextResponse } from "next/server";
import { requireAuth, errorResponse } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: true,
        avatarUrl: true,
        industry: true,
      },
    });

    if (!dbUser) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(dbUser);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch profile";
    console.error("Profile fetch error:", err);
    return errorResponse(message, 500);
  }
}
