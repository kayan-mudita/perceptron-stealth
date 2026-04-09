/**
 * Voice Engine — Multi-provider TTS pipeline
 *
 * Priority: Fish Audio → FAL MiniMax → standalone MiniMax → ElevenLabs → Pocket TTS → skip
 *
 * Fish Audio: Cheapest ($15/M bytes), 15s voice clone, 30+ languages
 * FAL MiniMax: Best quality per course recommendation
 * MiniMax standalone: Fallback if FAL unavailable
 * ElevenLabs: Most mature, best quality, most expensive
 * Pocket TTS: Free self-hosted CPU-only fallback (English only, 100M params)
 *
 * Retry policy: Each provider gets 2 retries with exponential backoff before
 * falling through to the next provider. TTS failure is always non-fatal --
 * the pipeline continues without audio rather than failing the entire video.
 */

import { withRetry } from "@/lib/pipeline/retry";

// ─── Types ──────────────────────────────────────────────────────

export interface TTSResult {
  audioUrl: string | null;
  duration: number;
  provider: string;
  error?: string;
}

export interface VoiceCloneResult {
  voiceId: string;
  provider: string;
  error?: string;
}

// ─── FAL MiniMax TTS ────────────────────────────────────────────

async function falMiniMaxTTS(text: string): Promise<TTSResult> {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) return { audioUrl: null, duration: 0, provider: "fal-minimax", error: "FAL_API_KEY not set" };

  try {
    // Wrap in retry: 2 retries with 1s exponential backoff
    const { result: data } = await withRetry(async () => {
      const response = await fetch("https://fal.run/fal-ai/minimax/speech-02-hd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`FAL MiniMax Speech ${response.status}: ${err.substring(0, 200)}`);
      }

      return response.json();
    }, { maxRetries: 2, baseDelay: 1000, name: "tts:fal-minimax" });

    const audioUrl = data.audio?.url;
    const durationMs = data.duration_ms || 0;

    if (audioUrl) {
      return { audioUrl, duration: Math.ceil(durationMs / 1000), provider: "fal-minimax" };
    }

    return { audioUrl: null, duration: 0, provider: "fal-minimax", error: "No audio URL in response" };
  } catch (err: any) {
    return { audioUrl: null, duration: 0, provider: "fal-minimax", error: err.message };
  }
}

// ─── Standalone MiniMax TTS ─────────────────────────────────────

async function miniMaxTTS(text: string, voiceId?: string): Promise<TTSResult> {
  const apiKey = process.env.MINIMAX_API_KEY;
  const groupId = process.env.MINIMAX_GROUP_ID;
  if (!apiKey || !groupId) return { audioUrl: null, duration: 0, provider: "minimax", error: "Not configured" };

  try {
    // Wrap in retry: 2 retries with 1s exponential backoff
    const { result: data } = await withRetry(async () => {
      const response = await fetch(`https://api.minimax.chat/v1/t2a_v2?GroupId=${groupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "speech-02-hd",
          text,
          voice_setting: { voice_id: voiceId || "male-qn-qingse", speed: 1.0, vol: 1.0, pitch: 0 },
          audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3" },
        }),
      });

      if (!response.ok) {
        throw new Error(`MiniMax ${response.status}`);
      }

      const json = await response.json();
      if (json.base_resp?.status_code !== 0) {
        throw new Error(json.base_resp?.status_msg || "MiniMax API error");
      }

      return json;
    }, { maxRetries: 2, baseDelay: 1000, name: "tts:minimax-standalone" });

    const audioData = data.data?.audio;
    if (audioData) {
      const buffer = Buffer.from(audioData, "hex");
      const audioUrl = `data:audio/mp3;base64,${buffer.toString("base64")}`;
      return { audioUrl, duration: Math.ceil(text.split(/\s+/).length / 2.5), provider: "minimax" };
    }

    return { audioUrl: null, duration: 0, provider: "minimax", error: "No audio data" };
  } catch (err: any) {
    return { audioUrl: null, duration: 0, provider: "minimax", error: err.message };
  }
}

// ─── ElevenLabs TTS ─────────────────────────────────────────────

async function elevenLabsTTS(text: string, voiceId?: string): Promise<TTSResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return { audioUrl: null, duration: 0, provider: "elevenlabs", error: "Not configured" };

  const vid = voiceId || "21m00Tcm4TlvDq8ikWAM";

  try {
    // Wrap in retry: 2 retries with 1s exponential backoff
    const { result: buffer } = await withRetry(async () => {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs ${response.status}`);
      }

      return response.arrayBuffer();
    }, { maxRetries: 2, baseDelay: 1000, name: "tts:elevenlabs" });

    const audioUrl = `data:audio/mpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    return { audioUrl, duration: Math.ceil(text.split(/\s+/).length / 2.5), provider: "elevenlabs" };
  } catch (err: any) {
    return { audioUrl: null, duration: 0, provider: "elevenlabs", error: err.message };
  }
}

// ─── Fish Audio TTS ────────────────────────────────────────────

async function fishAudioTTS(text: string, voiceId?: string): Promise<TTSResult> {
  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) return { audioUrl: null, duration: 0, provider: "fish-audio", error: "FISH_AUDIO_API_KEY not set" };

  try {
    const { result: data } = await withRetry(async () => {
      const response = await fetch("https://api.fish.audio/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text,
          reference_id: voiceId || undefined,
          format: "mp3",
          mp3_bitrate: 128,
          normalize: true,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Fish Audio ${response.status}: ${err.substring(0, 200)}`);
      }

      return response.arrayBuffer();
    }, { maxRetries: 2, baseDelay: 1000, name: "tts:fish-audio" });

    const audioUrl = `data:audio/mpeg;base64,${Buffer.from(data).toString("base64")}`;
    return { audioUrl, duration: Math.ceil(text.split(/\s+/).length / 2.5), provider: "fish-audio" };
  } catch (err: any) {
    return { audioUrl: null, duration: 0, provider: "fish-audio", error: err.message };
  }
}

// ─── Pocket TTS (self-hosted, CPU-only, zero cost) ─────────────

async function pocketTTS(text: string): Promise<TTSResult> {
  const pocketUrl = process.env.POCKET_TTS_URL;
  if (!pocketUrl) return { audioUrl: null, duration: 0, provider: "pocket-tts", error: "POCKET_TTS_URL not set" };

  try {
    const { result: data } = await withRetry(async () => {
      const response = await fetch(`${pocketUrl}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "alba" }),
      });

      if (!response.ok) {
        throw new Error(`Pocket TTS ${response.status}`);
      }

      return response.arrayBuffer();
    }, { maxRetries: 2, baseDelay: 500, name: "tts:pocket-tts" });

    const audioUrl = `data:audio/wav;base64,${Buffer.from(data).toString("base64")}`;
    return { audioUrl, duration: Math.ceil(text.split(/\s+/).length / 2.5), provider: "pocket-tts" };
  } catch (err: any) {
    return { audioUrl: null, duration: 0, provider: "pocket-tts", error: err.message };
  }
}

// ─── Voice Clone ────────────────────────────────────────────────

/**
 * Clone a voice from an audio sample.
 * Priority: Fish Audio (15s sample, cheapest) → ElevenLabs (30s+ sample, best quality)
 */
export async function cloneVoice(audioUrl: string, name: string): Promise<VoiceCloneResult> {
  // Try Fish Audio first (15s sample, cheaper)
  const fishResult = await cloneVoiceFishAudio(audioUrl, name);
  if (fishResult.voiceId) return fishResult;

  // Fall back to ElevenLabs
  return cloneVoiceElevenLabs(audioUrl, name);
}

async function cloneVoiceFishAudio(audioUrl: string, name: string): Promise<VoiceCloneResult> {
  const apiKey = process.env.FISH_AUDIO_API_KEY;
  if (!apiKey) return { voiceId: "", provider: "fish-audio", error: "Not configured" };

  try {
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) return { voiceId: "", provider: "fish-audio", error: "Failed to download sample" };
    const audioBuffer = await audioRes.arrayBuffer();

    const formData = new FormData();
    formData.append("title", name);
    formData.append("visibility", "private");
    const contentType = audioRes.headers.get("content-type") || "audio/mpeg";
    const ext = contentType.includes("webm") ? "webm" : contentType.includes("wav") ? "wav" : "mp3";
    formData.append("voices", new Blob([audioBuffer], { type: contentType }), `sample.${ext}`);

    const response = await fetch("https://api.fish.audio/model", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (!response.ok) return { voiceId: "", provider: "fish-audio", error: `Clone failed ${response.status}` };

    const data = await response.json();
    return { voiceId: data._id || data.id, provider: "fish-audio" };
  } catch (err: any) {
    return { voiceId: "", provider: "fish-audio", error: err.message };
  }
}

async function cloneVoiceElevenLabs(audioUrl: string, name: string): Promise<VoiceCloneResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return { voiceId: "", provider: "elevenlabs", error: "Not configured" };

  try {
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) return { voiceId: "", provider: "elevenlabs", error: "Failed to download sample" };
    const audioBuffer = await audioRes.arrayBuffer();

    const formData = new FormData();
    formData.append("name", name);
    const contentType = audioRes.headers.get("content-type") || "audio/mpeg";
    const ext = contentType.includes("webm") ? "webm" : contentType.includes("wav") ? "wav" : "mp3";
    formData.append("files", new Blob([audioBuffer], { type: contentType }), `voice_sample.${ext}`);

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: formData,
    });

    if (!response.ok) {
      return { voiceId: "", provider: "elevenlabs", error: `Clone failed ${response.status}` };
    }

    const data = await response.json();
    return { voiceId: data.voice_id, provider: "elevenlabs" };
  } catch (err: any) {
    return { voiceId: "", provider: "elevenlabs", error: err.message };
  }
}

// ─── Smart TTS Router ───────────────────────────────────────────

/**
 * Generate TTS using the best available provider.
 *
 * Priority chain:
 * 1. Fish Audio (cheapest, 15s clone, 30+ languages)
 * 2. FAL MiniMax speech-02-hd (best quality)
 * 3. Standalone MiniMax (fallback if FAL unavailable)
 * 4. ElevenLabs (most mature, most expensive)
 * 5. Pocket TTS (self-hosted, zero cost, CPU-only, English only)
 * 6. Skip (pipeline continues without audio)
 */
export async function generateVoiceover(text: string, voiceId?: string): Promise<TTSResult> {
  // 1. Fish Audio (cheapest per byte, fast, 30+ languages)
  if (process.env.FISH_AUDIO_API_KEY) {
    const result = await fishAudioTTS(text, voiceId);
    if (result.audioUrl) return result;
    console.log(`[voice] Fish Audio failed: ${result.error}, trying fallbacks...`);
  }

  // 2. FAL MiniMax (best quality, uses same FAL key as video)
  if (process.env.FAL_API_KEY) {
    const result = await falMiniMaxTTS(text);
    if (result.audioUrl) return result;
    console.log(`[voice] FAL MiniMax failed: ${result.error}, trying fallbacks...`);
  }

  // 3. Standalone MiniMax
  if (process.env.MINIMAX_API_KEY) {
    const result = await miniMaxTTS(text, voiceId);
    if (result.audioUrl) return result;
  }

  // 4. ElevenLabs
  if (process.env.ELEVENLABS_API_KEY) {
    const result = await elevenLabsTTS(text, voiceId);
    if (result.audioUrl) return result;
  }

  // 5. Pocket TTS (self-hosted, zero API cost)
  if (process.env.POCKET_TTS_URL) {
    const result = await pocketTTS(text);
    if (result.audioUrl) return result;
  }

  return {
    audioUrl: null,
    duration: 0,
    provider: "none",
    error: "No TTS provider available. Set FISH_AUDIO_API_KEY, FAL_API_KEY, ELEVENLABS_API_KEY, or POCKET_TTS_URL.",
  };
}
