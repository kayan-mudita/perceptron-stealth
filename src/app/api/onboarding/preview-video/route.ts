import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { planComposition } from "@/lib/video-compositor";
import { runStep } from "@/lib/pipeline/orchestrator";
import { generateVoiceover } from "@/lib/voice-engine";

const PREVIEW_SCRIPT =
  "Ready to take your business to the next level? With AI-powered content creation, you can engage your audience with professional videos, all customized to your brand. Let's get started.";

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json().catch(() => ({}));
    const { characterSheetUrl, photoUrl } = body as {
      characterSheetUrl?: string;
      photoUrl?: string;
    };

    // 1. Resolve user's primary photo
    const photo = await prisma.photo.findFirst({
      where: { userId: user.id, isPrimary: true },
    });

    if (!photo && !photoUrl) {
      return NextResponse.json({
        success: true,
        videoUrl: null,
        message: "No photo available for preview video",
      });
    }

    // 2. Resolve user's default voice (cloned or stock)
    const voice = await prisma.voiceSample.findFirst({
      where: { userId: user.id, isDefault: true },
    });

    // 3. Plan a short talking_head format (single cut = fastest)
    const plan = planComposition("quick_tip_8", PREVIEW_SCRIPT);

    // 4. Create a preview video record
    const video = await prisma.video.create({
      data: {
        userId: user.id,
        title: "Onboarding Preview",
        description: "Auto-generated preview for onboarding paywall",
        script: PREVIEW_SCRIPT,
        model: "kling_2.6",
        contentType: "quick_tip_8",
        photoId: photo?.id,
        voiceId: voice?.id,
        status: "generating",
        duration: plan.format.totalDuration,
      },
    });

    // 5. Run the pipeline: expand → tts → cut → poll → stitch
    //    This is async and may take 60-90s. We run it sequentially
    //    and return the final URL. The frontend shows a spinner.
    try {
      // Step 1: Expand script into production prompts
      const expandResult = await runStep(video.id, "expand", undefined, user.id);
      if (expandResult.status === "error") throw new Error(expandResult.error);

      // Step 2: Generate TTS audio
      const ttsResult = await runStep(video.id, "tts", undefined, user.id);

      // Step 3: Generate the first video cut
      const cutResult = await runStep(video.id, "cut", 0, user.id);
      if (cutResult.status === "error") throw new Error(cutResult.error);

      // Step 4: Poll until cut is ready
      let pollResult = await runStep(video.id, "poll", 0, user.id);
      let attempts = 0;
      while (pollResult.nextStep === "poll" && attempts < 30) {
        await new Promise((r) => setTimeout(r, 3000));
        pollResult = await runStep(video.id, "poll", 0, user.id);
        attempts++;
      }

      // Step 5: Stitch (even a single cut needs stitch for final mp4)
      const stitchResult = await runStep(video.id, "stitch", undefined, user.id);
      if (stitchResult.status === "error") throw new Error(stitchResult.error);

      // Step 6: Poll stitch
      let stitchPoll = await runStep(video.id, "poll_stitch", undefined, user.id);
      let stitchAttempts = 0;
      while (stitchPoll.nextStep === "poll_stitch" && stitchAttempts < 60) {
        await new Promise((r) => setTimeout(r, 3000));
        stitchPoll = await runStep(video.id, "poll_stitch", undefined, user.id);
        stitchAttempts++;
      }

      // Fetch the completed video URL
      const completed = await prisma.video.findUnique({
        where: { id: video.id },
        select: { videoUrl: true, status: true },
      });

      return NextResponse.json({
        success: true,
        videoId: video.id,
        videoUrl: completed?.videoUrl || null,
        message: completed?.videoUrl
          ? "Preview video generated"
          : "Video generation completed but no URL returned",
      });
    } catch (pipelineErr: any) {
      console.error("[onboarding/preview-video] Pipeline error (non-fatal):", pipelineErr.message);
      // Mark video as failed but don't fail the endpoint
      await prisma.video.update({
        where: { id: video.id },
        data: { status: "failed" },
      });
      return NextResponse.json({
        success: true,
        videoId: video.id,
        videoUrl: null,
        message: "Preview video generation failed — paywall will show without video",
      });
    }
  } catch (err: any) {
    console.error("Preview video generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate preview video" },
      { status: 500 }
    );
  }
}
