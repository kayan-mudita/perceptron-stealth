/**
 * HeyGen Integration — Parallel Video Generation Track
 *
 * HeyGen Avatar V / Avatar IV provides the highest-fidelity avatar
 * videos — better face similarity (0.840), lip sync (LSE-C 8.97),
 * and 175+ language support than any FAL model.
 *
 * This runs as a SEPARATE TRACK from the FAL pipeline:
 * - FAL pipeline: cheap, flexible, many models, good for b-roll/mixed content
 * - HeyGen track: premium, highest quality, best for talking heads
 *
 * The pipeline orchestrator chooses which track to use based on:
 * - Content type (talking_head → HeyGen, b-roll → FAL)
 * - User preference (model selection in generate UI)
 * - Cost budget (HeyGen is ~$0.50-1.00/min vs FAL $0.22/sec)
 *
 * API Reference: https://docs.heygen.com/reference/create-avatar-iv-video
 */

// ─── Types ────────────────────────────────────────────────────────

export interface HeyGenConfig {
  apiKey: string;
  baseUrl: string;
}

export interface HeyGenVideoRequest {
  /** The user's avatar/photo key (uploaded to HeyGen) */
  avatarId?: string;
  /** Photo URL for photo-avatar mode (no pre-registration needed) */
  photoUrl?: string;
  /** The script text for the avatar to speak */
  script: string;
  /** HeyGen voice ID (from their voice library or cloned voice) */
  voiceId?: string;
  /** Audio URL to use instead of TTS (lip-sync to existing audio) */
  audioUrl?: string;
  /** Video title for tracking */
  title?: string;
  /** Custom motion prompt for gesture control */
  motionPrompt?: string;
  /** Output dimensions */
  width?: number;
  height?: number;
  /** Whether to generate captions */
  captions?: boolean;
}

export interface HeyGenVideoResult {
  videoId: string;
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}

export interface HeyGenAvatarResult {
  avatarId: string;
  status: "processing" | "completed" | "failed";
  error?: string;
}

export interface HeyGenVoiceResult {
  voiceId: string;
  error?: string;
}

// ─── Client ───────────────────────────────────────────────────────

function getConfig(): HeyGenConfig | null {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: "https://api.heygen.com",
  };
}

export function isHeyGenConfigured(): boolean {
  return !!process.env.HEYGEN_API_KEY;
}

async function heygenFetch(
  endpoint: string,
  body: Record<string, unknown>,
  method = "POST"
): Promise<any> {
  const config = getConfig();
  if (!config) throw new Error("HEYGEN_API_KEY not configured");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${config.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": config.apiKey,
      },
      signal: controller.signal,
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HeyGen ${res.status}: ${err.substring(0, 300)}`);
    }

    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function heygenGet(endpoint: string): Promise<any> {
  const config = getConfig();
  if (!config) throw new Error("HEYGEN_API_KEY not configured");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(`${config.baseUrl}${endpoint}`, {
      method: "GET",
      headers: { "X-Api-Key": config.apiKey },
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HeyGen ${res.status}: ${err.substring(0, 300)}`);
    }

    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Digital Twin Creation ────────────────────────────────────────

/**
 * Create a digital twin (video avatar) from a reference video.
 * Avatar V uses a 15s webcam recording for highest fidelity.
 * Avatar IV can work from a single photo.
 *
 * This is a one-time setup step during onboarding.
 */
export async function createDigitalTwin(
  videoUrl: string,
  name: string
): Promise<HeyGenAvatarResult> {
  try {
    const data = await heygenFetch("/v2/video_avatar", {
      video_url: videoUrl,
      avatar_name: name,
    });

    return {
      avatarId: data.data?.video_avatar_id || data.data?.avatar_id || "",
      status: "processing",
    };
  } catch (e: any) {
    return { avatarId: "", status: "failed", error: e.message };
  }
}

/**
 * Check digital twin creation status.
 */
export async function getDigitalTwinStatus(avatarId: string): Promise<HeyGenAvatarResult> {
  try {
    const data = await heygenGet(`/v2/video_avatar/${avatarId}`);
    const status = data.data?.status;

    return {
      avatarId,
      status: status === "completed" ? "completed" : status === "failed" ? "failed" : "processing",
    };
  } catch (e: any) {
    return { avatarId, status: "failed", error: e.message };
  }
}

// ─── Voice Setup ──────────────────────────────────────────────────

/**
 * Clone a voice in HeyGen from an audio sample.
 */
export async function cloneVoiceHeyGen(
  audioUrl: string,
  name: string
): Promise<HeyGenVoiceResult> {
  try {
    const data = await heygenFetch("/v1/voice.clone", {
      audio_url: audioUrl,
      voice_name: name,
    });

    return { voiceId: data.data?.voice_id || "" };
  } catch (e: any) {
    return { voiceId: "", error: e.message };
  }
}

/**
 * List available voices (stock + cloned).
 */
export async function listVoices(): Promise<{ voiceId: string; name: string; language: string }[]> {
  try {
    const data = await heygenGet("/v2/voices");
    return (data.data?.voices || []).map((v: any) => ({
      voiceId: v.voice_id,
      name: v.name || v.display_name,
      language: v.language || "en",
    }));
  } catch {
    return [];
  }
}

// ─── Video Generation (Avatar IV / V) ────────────────────────────

/**
 * Generate a video using HeyGen Avatar IV/V.
 *
 * Two modes:
 * 1. Avatar mode: Uses a pre-created digital twin (avatarId)
 * 2. Photo mode: Uses a photo URL directly (no pre-registration)
 *
 * Returns a videoId for polling.
 */
export async function generateVideo(req: HeyGenVideoRequest): Promise<HeyGenVideoResult> {
  try {
    // Build the character config
    const character: Record<string, unknown> = req.avatarId
      ? { type: "avatar", avatar_id: req.avatarId, scale: 1.0 }
      : { type: "talking_photo", photo_url: req.photoUrl };

    // Build the voice config
    const voice: Record<string, unknown> = req.audioUrl
      ? { type: "audio", audio_url: req.audioUrl }
      : {
          type: "text",
          input_text: req.script,
          voice_id: req.voiceId || "2d5b0e6cf36f460aa7fc47e3eee4ba54", // Default: professional male
        };

    const body: Record<string, unknown> = {
      video_inputs: [{ character, voice }],
      dimension: {
        width: req.width || 1080,
        height: req.height || 1920,
      },
      caption: req.captions ?? false,
    };

    // Try Avatar IV endpoint first (supports photo avatars)
    let data: any;
    try {
      data = await heygenFetch("/v2/video/av4/generate", {
        ...body,
        video_title: req.title || "Official AI Video",
        ...(req.motionPrompt ? { custom_motion_prompt: req.motionPrompt } : {}),
      });
    } catch {
      // Fallback to standard v2 endpoint
      data = await heygenFetch("/v2/video/generate", body);
    }

    const videoId = data.data?.video_id;
    if (!videoId) {
      return { videoId: "", status: "failed", error: "No video_id in response" };
    }

    return { videoId, status: "processing" };
  } catch (e: any) {
    return { videoId: "", status: "failed", error: e.message };
  }
}

// ─── Status Polling ───────────────────────────────────────────────

/**
 * Poll HeyGen video generation status.
 */
export async function getVideoStatus(videoId: string): Promise<HeyGenVideoResult> {
  try {
    const data = await heygenGet(`/v1/video_status.get?video_id=${videoId}`);
    const status = data.data?.status;

    if (status === "completed") {
      return {
        videoId,
        status: "completed",
        videoUrl: data.data?.video_url,
      };
    }

    if (status === "failed") {
      return {
        videoId,
        status: "failed",
        error: data.data?.error || "Generation failed",
      };
    }

    return { videoId, status: "processing" };
  } catch (e: any) {
    return { videoId, status: "failed", error: e.message };
  }
}

// ─── Simplified Pipeline Function ─────────────────────────────────

/**
 * End-to-end HeyGen video generation.
 * Takes script + photo/avatar → returns video URL.
 *
 * This is the "parallel track" equivalent of the FAL pipeline.
 * Called by the orchestrator when model is "heygen_avatar_v" or "heygen_avatar_iv".
 */
export async function generateHeyGenVideo(params: {
  script: string;
  photoUrl: string;
  avatarId?: string;
  voiceId?: string;
  audioUrl?: string;
  title?: string;
  motionPrompt?: string;
}): Promise<{ videoUrl: string | null; videoId: string; error?: string }> {
  // Step 1: Submit generation
  const result = await generateVideo({
    script: params.script,
    photoUrl: params.photoUrl,
    avatarId: params.avatarId,
    voiceId: params.voiceId,
    audioUrl: params.audioUrl,
    title: params.title,
    motionPrompt: params.motionPrompt,
    width: 1080,
    height: 1920,
  });

  if (result.status === "failed") {
    return { videoUrl: null, videoId: result.videoId, error: result.error };
  }

  // Step 2: Poll until complete (max 5 min)
  const maxAttempts = 60;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 5000)); // 5s intervals

    const status = await getVideoStatus(result.videoId);

    if (status.status === "completed" && status.videoUrl) {
      return { videoUrl: status.videoUrl, videoId: result.videoId };
    }

    if (status.status === "failed") {
      return { videoUrl: null, videoId: result.videoId, error: status.error };
    }
  }

  return { videoUrl: null, videoId: result.videoId, error: "Timed out after 5 minutes" };
}
