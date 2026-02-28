import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const accounts = await prisma.socialAccount.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        platform: true,
        handle: true,
        connected: true,
        accountId: true,
        scope: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
        // Explicitly exclude tokens from API response
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(accounts);
  } catch (err: any) {
    console.error("Failed to fetch social accounts:", err);
    return NextResponse.json(
      { error: "Failed to fetch connected accounts" },
      { status: 500 }
    );
  }
}
