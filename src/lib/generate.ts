// AI Video Generation Integration Layer
// Supports Kling 2.6 and Seedance 2.0

import prisma from "@/lib/prisma";
import {
  isStorageConfigured,
  downloadAndStore,
  videoKey,
} from "@/lib/storage";

export type AIModel = "kling_2.6" | "seedance_2.0";

export interface GenerateVideoParams {
  model: AIModel;
  photoUrl: string;
  voiceUrl: string;
  script: string;
  style?: string;
  duration?: number; // seconds (8 = 1 clip)
}

export interface GenerateResult {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  estimatedTime?: number; // seconds
  error?: string;
}

// ---------------------------------------------------------------------------
// Retry helper with exponential backoff
// ---------------------------------------------------------------------------

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
  }: { maxRetries?: number; initialDelayMs?: number; maxDelayMs?: number } = {}
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Retry on 429 (rate limit) or 5xx server errors
      if (response.status === 429 || response.status >= 500) {
        if (attempt < maxRetries) {
          const delay = Math.min(initialDelayMs * Math.pow(2, attempt), maxDelayMs);
          await sleep(delay);
          continue;
        }
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        const delay = Math.min(initialDelayMs * Math.pow(2, attempt), maxDelayMs);
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error("fetchWithRetry: all attempts failed");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Kling 2.6 -- Hyper-realistic video generation
// ---------------------------------------------------------------------------

export async function generateWithKling(
  params: GenerateVideoParams
): Promise<GenerateResult> {
  const apiKey = process.env.KLING_API_KEY;

  if (!apiKey) {
    // Demo mode: simulate generation
    return simulateGeneration("kling_2.6");
  }

  try {
    const response = await fetchWithRetry(
      "https://api.klingai.com/v1/videos/image2video",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model_name: "kling-v2.6",
          image: params.photoUrl,
          prompt: params.script,
          duration: params.duration || 8,
          mode: "professional",
          audio_url: params.voiceUrl,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Kling] API error ${response.status}: ${errorBody}`);
      return {
        jobId: `kling-err-${Date.now()}`,
        status: "failed",
        error: `Kling API returned ${response.status}: ${errorBody}`,
      };
    }

    const data = await response.json();
    const taskId = data.data?.task_id;

    if (!taskId) {
      console.error("[Kling] No task_id in response:", data);
      return {
        jobId: `kling-err-${Date.now()}`,
        status: "failed",
        error: "Kling API did not return a task ID",
      };
    }

    return {
      jobId: taskId,
      status: "processing",
      estimatedTime: 120,
    };
  } catch (err) {
    console.error("[Kling] Request failed:", err);
    return {
      jobId: `kling-err-${Date.now()}`,
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ---------------------------------------------------------------------------
// Seedance 2.0 -- Creative & dynamic content
// ---------------------------------------------------------------------------

export async function generateWithSeedance(
  params: GenerateVideoParams
): Promise<GenerateResult> {
  const apiKey = process.env.SEEDANCE_API_KEY;

  if (!apiKey) {
    return simulateGeneration("seedance_2.0");
  }

  try {
    const response = await fetchWithRetry(
      "https://api.seedance.ai/v2/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "seedance-2.0",
          source_image: params.photoUrl,
          voice_audio: params.voiceUrl,
          script: params.script,
          style: params.style || "professional",
          duration: params.duration || 8,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Seedance] API error ${response.status}: ${errorBody}`);
      return {
        jobId: `seedance-err-${Date.now()}`,
        status: "failed",
        error: `Seedance API returned ${response.status}: ${errorBody}`,
      };
    }

    const data = await response.json();
    const jobId = data.job_id;

    if (!jobId) {
      console.error("[Seedance] No job_id in response:", data);
      return {
        jobId: `seedance-err-${Date.now()}`,
        status: "failed",
        error: "Seedance API did not return a job ID",
      };
    }

    return {
      jobId,
      status: "processing",
      estimatedTime: 90,
    };
  } catch (err) {
    console.error("[Seedance] Request failed:", err);
    return {
      jobId: `seedance-err-${Date.now()}`,
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ---------------------------------------------------------------------------
// Unified entry point
// ---------------------------------------------------------------------------

export async function generateVideo(
  params: GenerateVideoParams
): Promise<GenerateResult> {
  if (params.model === "kling_2.6") {
    return generateWithKling(params);
  }
  return generateWithSeedance(params);
}

// ---------------------------------------------------------------------------
// Status polling -- check job status from the provider API
// ---------------------------------------------------------------------------

export interface PollResult {
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export async function pollKlingStatus(jobId: string): Promise<PollResult> {
  const apiKey = process.env.KLING_API_KEY;
  if (!apiKey) {
    return { status: "completed", videoUrl: `/api/demo-video?model=kling_2.6` };
  }

  const response = await fetchWithRetry(
    `https://api.klingai.com/v1/videos/image2video/${jobId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Kling] Poll error ${response.status}: ${errorBody}`);
    return { status: "failed", error: `Poll failed: ${response.status}` };
  }

  const data = await response.json();
  const taskStatus = data.data?.task_status;

  if (taskStatus === "succeed" || taskStatus === "completed") {
    const videoInfo = data.data?.task_result?.videos?.[0];
    return {
      status: "completed",
      videoUrl: videoInfo?.url || data.data?.task_result?.video_url,
      thumbnailUrl: videoInfo?.cover_url || data.data?.task_result?.thumbnail_url,
    };
  }

  if (taskStatus === "failed") {
    return {
      status: "failed",
      error: data.data?.task_status_msg || "Generation failed",
    };
  }

  // Still processing
  return { status: "processing" };
}

export async function pollSeedanceStatus(jobId: string): Promise<PollResult> {
  const apiKey = process.env.SEEDANCE_API_KEY;
  if (!apiKey) {
    return { status: "completed", videoUrl: `/api/demo-video?model=seedance_2.0` };
  }

  const response = await fetchWithRetry(
    `https://api.seedance.ai/v2/jobs/${jobId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Seedance] Poll error ${response.status}: ${errorBody}`);
    return { status: "failed", error: `Poll failed: ${response.status}` };
  }

  const data = await response.json();

  if (data.status === "completed" || data.status === "succeed") {
    return {
      status: "completed",
      videoUrl: data.result?.video_url || data.video_url,
      thumbnailUrl: data.result?.thumbnail_url || data.thumbnail_url,
    };
  }

  if (data.status === "failed" || data.status === "error") {
    return {
      status: "failed",
      error: data.error || data.message || "Generation failed",
    };
  }

  return { status: "processing" };
}

/**
 * Poll a video generation job for completion, updating the Video record in the DB.
 *
 * Polls with exponential backoff:
 *   - First 2 min: every 10 s
 *   - 2-5 min: every 20 s
 *   - 5-10 min: every 30 s
 *   - Timeout after 10 min
 *
 * This function is meant to be called in a fire-and-forget fashion after the
 * initial generation request returns a jobId.
 */
export async function pollJobUntilDone(
  videoId: string,
  jobId: string,
  model: AIModel
): Promise<void> {
  const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
  const startTime = Date.now();

  // Skip polling for demo/error jobs
  if (jobId.startsWith("demo-") || jobId.startsWith("kling-err-") || jobId.startsWith("seedance-err-")) {
    return;
  }

  let pollCount = 0;

  while (Date.now() - startTime < TIMEOUT_MS) {
    // Exponential-ish backoff for poll interval
    let intervalMs: number;
    const elapsed = Date.now() - startTime;
    if (elapsed < 2 * 60 * 1000) {
      intervalMs = 10_000; // 10s
    } else if (elapsed < 5 * 60 * 1000) {
      intervalMs = 20_000; // 20s
    } else {
      intervalMs = 30_000; // 30s
    }

    await sleep(intervalMs);
    pollCount++;

    try {
      const result =
        model === "kling_2.6"
          ? await pollKlingStatus(jobId)
          : await pollSeedanceStatus(jobId);

      if (result.status === "completed") {
        let finalVideoUrl = result.videoUrl || null;
        let finalThumbnailUrl = result.thumbnailUrl || null;

        // Download the generated video to our own S3 storage so we are not
        // dependent on ephemeral provider URLs.
        if (isStorageConfigured()) {
          try {
            const video = await prisma.video.findUnique({
              where: { id: videoId },
              select: { userId: true },
            });
            const userId = video?.userId || "unknown";

            if (result.videoUrl) {
              finalVideoUrl = await downloadAndStore(
                result.videoUrl,
                videoKey(userId, videoId, "mp4"),
                "video/mp4"
              );
            }
            if (result.thumbnailUrl) {
              finalThumbnailUrl = await downloadAndStore(
                result.thumbnailUrl,
                videoKey(userId, `${videoId}-thumb`, "jpg"),
                "image/jpeg"
              );
            }
          } catch (s3Err) {
            // Log but don't fail — keep the provider URL as fallback
            console.error(`[Poll] S3 upload failed for video ${videoId}:`, s3Err);
          }
        }

        await prisma.video.update({
          where: { id: videoId },
          data: {
            status: "review",
            videoUrl: finalVideoUrl,
            thumbnailUrl: finalThumbnailUrl,
          },
        });
        console.log(`[Poll] Video ${videoId} completed after ${pollCount} polls`);
        return;
      }

      if (result.status === "failed") {
        await prisma.video.update({
          where: { id: videoId },
          data: { status: "failed" },
        });
        console.error(`[Poll] Video ${videoId} failed: ${result.error}`);
        return;
      }

      // Still processing, continue loop
      console.log(`[Poll] Video ${videoId} still processing (poll #${pollCount})`);
    } catch (err) {
      console.error(`[Poll] Error polling video ${videoId}:`, err);
      // Don't break on transient errors -- keep polling
    }
  }

  // Timed out
  console.error(`[Poll] Video ${videoId} timed out after ${TIMEOUT_MS / 1000}s`);
  await prisma.video.update({
    where: { id: videoId },
    data: { status: "failed" },
  });
}

// ---------------------------------------------------------------------------
// Demo mode simulation
// ---------------------------------------------------------------------------

function simulateGeneration(model: string): GenerateResult {
  return {
    jobId: `demo-${model}-${Date.now()}`,
    status: "completed",
    videoUrl: `/api/demo-video?model=${model}`,
    thumbnailUrl: `/api/demo-thumbnail?model=${model}`,
    estimatedTime: 0,
  };
}

// ---------------------------------------------------------------------------
// Model info (unchanged)
// ---------------------------------------------------------------------------

export function getModelInfo(model: AIModel) {
  if (model === "kling_2.6") {
    return {
      name: "Kling 2.6",
      description: "Hyper-realistic video generation with photorealistic output",
      features: [
        "4K photorealistic output",
        "Advanced lip-sync technology",
        "Natural human motion",
        "Lifelike facial expressions",
      ],
      bestFor: "Professional videos, testimonials, educational content",
      avgTime: "~2 minutes",
    };
  }
  return {
    name: "Seedance 2.0",
    description: "Creative & dynamic content with stylized effects",
    features: [
      "Multiple visual styles",
      "Dynamic transitions & effects",
      "Creative text overlays",
      "Brand-consistent output",
    ],
    bestFor: "Social media reels, trending content, brand videos",
    avgTime: "~90 seconds",
  };
}
