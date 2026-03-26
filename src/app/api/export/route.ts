import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

export async function GET() {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    // Fetch all user data for GDPR-compliant export
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        photos: {
          select: {
            id: true,
            filename: true,
            url: true,
            isPrimary: true,
            createdAt: true,
          },
        },
        voiceSamples: {
          select: {
            id: true,
            filename: true,
            url: true,
            duration: true,
            isDefault: true,
            createdAt: true,
          },
        },
        videos: {
          select: {
            id: true,
            title: true,
            description: true,
            script: true,
            status: true,
            model: true,
            videoUrl: true,
            thumbnailUrl: true,
            duration: true,
            contentType: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        schedules: {
          select: {
            id: true,
            platform: true,
            scheduledAt: true,
            publishedAt: true,
            status: true,
            createdAt: true,
          },
        },
        characterSheets: {
          select: {
            id: true,
            type: true,
            compositeUrl: true,
            status: true,
            createdAt: true,
            images: {
              select: {
                id: true,
                url: true,
                position: true,
                angle: true,
              },
            },
          },
        },
        brandProfile: {
          select: {
            brandName: true,
            tagline: true,
            toneOfVoice: true,
            targetAudience: true,
            competitors: true,
            brandColors: true,
            guidelines: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        brandKit: {
          select: {
            logoUrl: true,
            primaryColor: true,
            secondaryColor: true,
            introStyle: true,
            outroTemplate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        socialAccounts: {
          select: {
            id: true,
            platform: true,
            handle: true,
            connected: true,
            createdAt: true,
          },
        },
        analytics: {
          select: {
            id: true,
            eventType: true,
            platform: true,
            count: true,
            date: true,
          },
        },
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build the export object (exclude sensitive fields)
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: fullUser.id,
        email: fullUser.email,
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        industry: fullUser.industry,
        company: fullUser.company,
        plan: fullUser.plan,
        onboarded: fullUser.onboarded,
        createdAt: fullUser.createdAt,
      },
      photos: fullUser.photos,
      voiceSamples: fullUser.voiceSamples,
      videos: fullUser.videos,
      schedules: fullUser.schedules,
      characterSheets: fullUser.characterSheets,
      brandProfile: fullUser.brandProfile,
      brandKit: fullUser.brandKit,
      socialAccounts: fullUser.socialAccounts,
      analytics: fullUser.analytics,
      summary: {
        totalPhotos: fullUser.photos.length,
        totalVoiceSamples: fullUser.voiceSamples.length,
        totalVideos: fullUser.videos.length,
        totalSchedules: fullUser.schedules.length,
        totalCharacterSheets: fullUser.characterSheets.length,
        totalAnalyticsEvents: fullUser.analytics.length,
      },
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="official-ai-export-${
          fullUser.id
        }-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (err) {
    console.error("[GET /api/export]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
