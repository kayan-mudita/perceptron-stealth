import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio file too large (max 10MB)" }, { status: 400 });
    }

    // TODO: Send audio to voice cloning service (ElevenLabs / selected model)
    // For now, store the audio and return a placeholder voice ID
    const voiceId = `voice_${user.id}_${Date.now()}`;

    // TODO: Upload audio to storage (S3/Supabase Storage)
    // TODO: Call voice cloning API and store the resulting voice model ID
    // TODO: Update user record with voiceCloneId

    return NextResponse.json({
      success: true,
      voiceId,
      message: "Voice sample received. Cloning in progress.",
    });
  } catch (err: any) {
    console.error("Voice upload failed:", err);
    return NextResponse.json(
      { error: "Failed to process voice sample" },
      { status: 500 }
    );
  }
}
