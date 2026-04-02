import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { uploadFile, isStorageConfigured, voiceKey } from "@/lib/storage";
import { cloneVoice } from "@/lib/voice-engine";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio file too large (max 10MB)" }, { status: 400 });
    }

    // 1. Upload audio to Supabase Storage
    let audioUrl: string | null = null;
    if (isStorageConfigured()) {
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileId = uuidv4();
      const ext = audioFile.type.includes("webm") ? "webm" : "mp3";
      const key = voiceKey(user.id, fileId, ext);
      audioUrl = await uploadFile(buffer, key, audioFile.type || "audio/webm");
    }

    // 2. Create VoiceSample record in DB
    const existingVoices = await prisma.voiceSample.count({ where: { userId: user.id } });
    const voiceSample = await prisma.voiceSample.create({
      data: {
        userId: user.id,
        filename: audioFile.name || `voice-${Date.now()}.webm`,
        url: audioUrl || "",
        isDefault: existingVoices === 0,
      },
    });

    // 3. Clone voice via ElevenLabs (non-blocking — don't fail onboarding if this errors)
    let providerVoiceId: string | null = null;
    if (audioUrl && process.env.ELEVENLABS_API_KEY) {
      const userName = await prisma.user.findUnique({
        where: { id: user.id },
        select: { firstName: true },
      });
      const cloneResult = await cloneVoice(audioUrl, `${userName?.firstName || "User"}'s voice`);
      if (cloneResult.voiceId) {
        providerVoiceId = cloneResult.voiceId;
        // Update the voice sample with the provider voice ID
        await prisma.voiceSample.update({
          where: { id: voiceSample.id },
          data: {
            provider: cloneResult.provider,
            providerVoiceId: cloneResult.voiceId,
          },
        });
      } else {
        console.warn("[onboarding/voice] Clone failed (non-fatal):", cloneResult.error);
      }
    }

    return NextResponse.json({
      success: true,
      voiceId: voiceSample.id,
      providerVoiceId,
      message: providerVoiceId
        ? "Voice cloned successfully."
        : "Voice sample saved. Clone will process shortly.",
    });
  } catch (err: any) {
    console.error("Voice upload failed:", err);
    return NextResponse.json(
      { error: "Failed to process voice sample" },
      { status: 500 }
    );
  }
}
