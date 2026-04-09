/**
 * Pipeline Step: TTS_AND_ANCHOR (Parallel)
 *
 * Improvement #6: Fire TTS and Anchor resolution simultaneously
 * instead of sequentially. They don't depend on each other.
 *
 * TTS: generates per-cut audio from script (3-5s)
 * Anchor: resolves starting frame from character sheets (2-10s)
 *
 * Running in parallel saves 3-10 seconds per video.
 *
 * After both complete, proceeds to submit_all_cuts.
 */

import { handleTTS } from "./tts";
import { handleAnchor } from "./anchor";
import type { StepResult } from "./types";

export async function handleTTSAndAnchor(
  videoId: string,
  userId: string
): Promise<StepResult> {
  console.log("[pipeline/tts-and-anchor] Running TTS + Anchor in parallel");

  const startTime = Date.now();

  // Fire both in parallel — they don't depend on each other
  const [ttsResult, anchorResult] = await Promise.all([
    handleTTS(videoId, userId).catch((e) => {
      console.error("[pipeline/tts-and-anchor] TTS failed (non-fatal):", e);
      return { status: "tts_done", nextStep: "anchor" } as StepResult;
    }),
    handleAnchor(videoId, userId).catch((e) => {
      console.error("[pipeline/tts-and-anchor] Anchor failed:", e);
      return { status: "error", error: e.message } as StepResult;
    }),
  ]);

  const elapsed = Date.now() - startTime;
  console.log(
    `[pipeline/tts-and-anchor] Both completed in ${elapsed}ms ` +
    `(TTS: ${ttsResult.status}, Anchor: ${anchorResult.status})`
  );

  // If anchor failed, that's a real problem
  if (anchorResult.status === "error") {
    return anchorResult;
  }

  // Both done — proceed to submit cuts
  return {
    status: "tts_and_anchor_done",
    nextStep: "submit_all_cuts",
    data: {
      ttsStatus: ttsResult.status,
      anchorStatus: anchorResult.status,
      parallelTimeMs: elapsed,
    },
  };
}
