import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const profile = await prisma.brandProfile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json(profile || null);
  } catch (err: any) {
    console.error("Failed to fetch brand profile:", err);
    return NextResponse.json(
      { error: "Failed to fetch brand profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const { brandName, tagline, toneOfVoice, targetAudience, competitors, brandColors, guidelines } = body;

    const profile = await prisma.brandProfile.upsert({
      where: { userId: user.id },
      update: {
        brandName: brandName ?? undefined,
        tagline: tagline ?? undefined,
        toneOfVoice: toneOfVoice ?? undefined,
        targetAudience: targetAudience ?? undefined,
        competitors: competitors ?? undefined,
        brandColors: brandColors ?? undefined,
        guidelines: guidelines ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        brandName: brandName || null,
        tagline: tagline || null,
        toneOfVoice: toneOfVoice || null,
        targetAudience: targetAudience || null,
        competitors: competitors || null,
        brandColors: brandColors || null,
        guidelines: guidelines || null,
      },
    });

    return NextResponse.json(profile);
  } catch (err: any) {
    console.error("Failed to save brand profile:", err);
    return NextResponse.json(
      { error: "Failed to save brand profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  // PUT delegates to POST (upsert behavior)
  return POST(req);
}
