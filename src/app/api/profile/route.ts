import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON in request body", 400);
    }

    const { firstName, lastName, company, industry } = body as {
      firstName?: unknown;
      lastName?: unknown;
      company?: unknown;
      industry?: unknown;
    };

    // Validate inputs
    const updateData: Record<string, string> = {};

    if (firstName !== undefined) {
      if (typeof firstName !== "string" || firstName.trim().length === 0) {
        return errorResponse("firstName must be a non-empty string", 400);
      }
      updateData.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      if (typeof lastName !== "string" || lastName.trim().length === 0) {
        return errorResponse("lastName must be a non-empty string", 400);
      }
      updateData.lastName = lastName.trim();
    }

    if (company !== undefined) {
      if (typeof company !== "string") {
        return errorResponse("company must be a string", 400);
      }
      updateData.company = company.trim();
    }

    if (industry !== undefined) {
      if (typeof industry !== "string") {
        return errorResponse("industry must be a string", 400);
      }
      updateData.industry = industry.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return errorResponse("No valid fields to update", 400);
    }

    const updatedUser = await prisma.user.update({
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
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    console.error("Profile update error:", err);
    return errorResponse(message, 500);
  }
}
