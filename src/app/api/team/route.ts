import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, errorResponse } from "@/lib/api-helpers";

/**
 * GET /api/team
 *
 * Returns the team members for the current user's account.
 * For now, this returns the current user as the only "owner" member.
 * Full multi-user management will be added in a later phase.
 */
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
        avatarUrl: true,
        plan: true,
        _count: {
          select: {
            videos: {
              where: { NOT: { contentType: { startsWith: "cut_" } } },
            },
          },
        },
      },
    });

    if (!dbUser) {
      return errorResponse("User not found", 404);
    }

    const members = [
      {
        id: dbUser.id,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        email: dbUser.email,
        avatarUrl: dbUser.avatarUrl,
        role: "owner" as const,
        videosCreated: dbUser._count.videos,
        status: "active" as const,
        joinedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      members,
      seats: {
        used: 1,
        limit: 1,
        pricePerSeat: 79,
      },
      pendingInvites: [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch team";
    console.error("Team fetch error:", err);
    return errorResponse(message, 500);
  }
}
