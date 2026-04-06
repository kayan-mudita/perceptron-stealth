import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";
import { generateCharacterSheets } from "@/lib/character-sheet";

export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    let body: { photoUrls?: string[]; industry?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // If no photo URLs provided, look up the user's uploaded photos from Supabase
    let photoUrls = body.photoUrls || [];

    if (!photoUrls.length) {
      const photos = await prisma.photo.findMany({
        where: { userId: user.id },
        orderBy: { isPrimary: "desc" },
      });
      photoUrls = photos.map((p) => p.url).filter((url) => url && !url.startsWith("/uploads/"));
    }

    if (!photoUrls.length) {
      return NextResponse.json(
        { error: "No photos found. Upload at least one photo first." },
        { status: 400 }
      );
    }

    // Resolve industry — prefer body param, fall back to user's stored industry
    const industry = body.industry || user.industry || "other";

    const result = await generateCharacterSheets(user.id, photoUrls, industry);

    return NextResponse.json({
      poses: {
        id: result.poses.characterSheetId,
        compositeUrl: result.poses.compositeUrl,
        status: result.poses.status,
        imageCount: result.poses.images.length,
      },
      // 3D sheet is backend-only — only return id and status, never the image URL
      threeD: {
        id: result.threeD.characterSheetId,
        status: result.threeD.status,
      },
    });
  } catch (err: any) {
    console.error("[POST /api/character-sheet]", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate character sheet" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    const body = await req.json().catch(() => ({}));
    const { sheetId, selectedPose } = body as { sheetId?: string; selectedPose?: number };

    if (!sheetId || selectedPose === undefined || selectedPose < 0 || selectedPose > 8) {
      return NextResponse.json(
        { error: "sheetId and selectedPose (0-8) are required" },
        { status: 400 }
      );
    }

    const sheet = await prisma.characterSheet.findFirst({
      where: { id: sheetId, userId: user.id, type: "poses" },
    });

    if (!sheet) {
      return NextResponse.json({ error: "Character sheet not found" }, { status: 404 });
    }

    const updated = await prisma.characterSheet.update({
      where: { id: sheetId },
      data: { selectedPose },
    });

    return NextResponse.json({ id: updated.id, selectedPose: updated.selectedPose });
  } catch (err: any) {
    console.error("[PATCH /api/character-sheet]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    const sheets = await prisma.characterSheet.findMany({
      where: { userId: user.id },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sheets);
  } catch (err) {
    console.error("[GET /api/character-sheet]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
