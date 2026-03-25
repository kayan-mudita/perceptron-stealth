import prisma from "./prisma";
import { getConfig } from "./system-config";
import { uploadFile, isStorageConfigured } from "./storage";
import { getBackgroundsForIndustry } from "./character-sheet";

const GOOGLE_AI_STUDIO_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Starting Frame Generator
 *
 * The starting frame is the anchor image used for EVERY video generation.
 * It ensures character consistency across all clips. From the course:
 * "You'll use this same starting frame for every segment."
 *
 * This generates a high-quality starting frame using Nano Banana Pro,
 * with the character in their specific pose/setting/lighting ready
 * for video generation.
 *
 * IDENTIFICATION: Starting frame photos are stored in the Photo table with
 * a filename prefix of "sf--". This prefix is used by getStartingFrameUrl()
 * to retrieve them. The prefix is intentionally distinct from any user-
 * uploaded filename to avoid false matches.
 */

/** Filename prefix used to tag Photo records that are starting frames. */
const SF_FILENAME_PREFIX = "sf--";

export interface StartingFrameResult {
  imageUrl: string | null;
  photoId: string | null;
  status: "complete" | "failed" | "demo";
}

// ---------------------------------------------------------------------------
// Retrieval — used by the video generation pipeline
// ---------------------------------------------------------------------------

/**
 * Get the most recent starting frame URL for a user.
 *
 * This is the function that the video generation pipeline should call
 * before every cut to get the anchor image for character consistency.
 *
 * Returns the Supabase Storage URL (permanent) if available, or null
 * if no starting frame has been generated yet.
 */
export async function getStartingFrameUrl(userId: string): Promise<string | null> {
  const sfPhoto = await prisma.photo.findFirst({
    where: {
      userId,
      filename: { startsWith: SF_FILENAME_PREFIX },
    },
    orderBy: { createdAt: "desc" },
    select: { url: true },
  });

  if (!sfPhoto?.url) return null;

  // Reject data: URIs — they are ephemeral and cannot be passed to FAL
  if (sfPhoto.url.startsWith("data:")) {
    console.warn("[starting-frame] Found starting frame but it is a data URI (not permanent). Returning null.");
    return null;
  }

  return sfPhoto.url;
}

/**
 * Get or generate a starting frame for a user.
 *
 * Checks for an existing starting frame first. If none exists (or the
 * existing one is a data URI), generates a new one.
 *
 * This is the safe entry point for the video generation pipeline --
 * it will never throw. On failure it returns null so the caller can
 * fall back to the user's primary photo.
 */
export async function getOrGenerateStartingFrame(userId: string): Promise<string | null> {
  try {
    // Check for existing starting frame
    const existing = await getStartingFrameUrl(userId);
    if (existing) return existing;

    // None found — generate one
    const result = await generateStartingFrame(userId);
    if (result.status === "complete" && result.imageUrl && !result.imageUrl.startsWith("data:")) {
      return result.imageUrl;
    }

    return null;
  } catch (err) {
    console.error("[starting-frame] getOrGenerateStartingFrame failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

/**
 * Generate a starting frame for video generation.
 * Takes the user's character sheet + a scene description and creates
 * an anchor image that will be attached to every video generation call.
 */
export async function generateStartingFrame(
  userId: string,
  sceneDescription?: string
): Promise<StartingFrameResult> {
  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
  if (!apiKey) {
    console.warn("[starting-frame] GOOGLE_AI_STUDIO_KEY not set, returning demo status");
    return { imageUrl: null, photoId: null, status: "demo" };
  }

  // Get user's uploaded photos for reference (exclude previous starting frames)
  const photos = await prisma.photo.findMany({
    where: {
      userId,
      NOT: { filename: { startsWith: SF_FILENAME_PREFIX } },
    },
    orderBy: { isPrimary: "desc" },
    take: 3,
  });

  if (photos.length === 0) {
    console.error("[starting-frame] No user photos found for userId:", userId);
    return { imageUrl: null, photoId: null, status: "failed" };
  }

  // Get character sheet for additional reference
  const characterSheet = await prisma.characterSheet.findFirst({
    where: { userId, status: "complete" },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  // Get brand context for appropriate setting
  const brand = await prisma.brandProfile.findFirst({ where: { userId } });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { industry: true, firstName: true },
  });

  // Use industry-specific backgrounds (same presets as character sheet)
  const industry = user?.industry || "other";
  const backgrounds = getBackgroundsForIndustry(industry);
  // Pick the first background as default for the starting frame
  const defaultBackground = backgrounds[0];
  const scene = sceneDescription || defaultBackground;

  const prompt = `Generate a single photograph of this EXACT person as a video starting frame. Match every detail from the reference photos — face, skin, hair, build, all distinguishing features.

Shot on iPhone 15 Pro Max, 24mm lens, f/1.78 aperture. Medium close-up from chest up. Natural light from a window, no flash, no studio lighting.

SCENE: ${scene}
The environment should feel lived-in and real — not staged or sterile.

PERSON: Facing camera, natural confident expression, slight smile, direct eye contact. Casual relaxed pose, hands visible and relaxed. Subtle breathing posture — not stiff, not posed.${brand?.toneOfVoice ? ` Energy: ${brand.toneOfVoice}.` : ""}

Clothing: casual and real — whatever fits the setting, not business formal.
Skin: real texture, visible pores, natural imperfections. No airbrushing, no glossy AI sheen.
Background: slight depth of field blur, but the setting is clearly recognizable.

No morphing, no extra fingers, no uncanny valley. This must look like a real iPhone photo taken by a real person in a real place. This frame anchors character consistency across all video generations.`;

  // Build parts with reference images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = [{ text: prompt }];

  // Track how many reference images we actually attached
  let refImageCount = 0;

  // Add user photos as inline base64 reference
  for (const photo of photos) {
    if (!photo.url || photo.url.startsWith("/uploads/")) continue;
    try {
      const res = await fetch(photo.url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        parts.push({
          inlineData: {
            mimeType: res.headers.get("content-type") || "image/jpeg",
            data: Buffer.from(buffer).toString("base64"),
          },
        });
        refImageCount++;
      } else {
        console.warn(`[starting-frame] Failed to fetch photo ${photo.id}: ${res.status}`);
      }
    } catch (err) {
      console.warn(`[starting-frame] Error fetching photo ${photo.id}:`, err);
    }
  }

  // Add character sheet composite as additional reference
  if (characterSheet?.compositeUrl) {
    const csUrl = characterSheet.compositeUrl;
    if (csUrl.startsWith("data:")) {
      // Data URL — extract inline
      const match = csUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
        refImageCount++;
      }
    } else if (csUrl.startsWith("http")) {
      // Supabase URL — download and inline
      try {
        const res = await fetch(csUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          parts.push({
            inlineData: {
              mimeType: res.headers.get("content-type") || "image/png",
              data: Buffer.from(buffer).toString("base64"),
            },
          });
          refImageCount++;
        } else {
          console.warn(`[starting-frame] Failed to fetch character sheet: ${res.status}`);
        }
      } catch (err) {
        console.warn("[starting-frame] Error fetching character sheet:", err);
      }
    }
  }

  if (refImageCount === 0) {
    console.error("[starting-frame] No reference images could be fetched. Cannot generate.");
    return { imageUrl: null, photoId: null, status: "failed" };
  }

  console.log(`[starting-frame] Generating with ${refImageCount} reference image(s) for user ${userId}`);

  try {
    // Use the same model config as character-sheet.ts
    const model = await getConfig("character_sheet_model", "nano_banana");
    const MODEL_MAP: Record<string, string> = {
      nano_banana: "nano-banana-pro-preview",
      gemini_image: "gemini-2.5-flash-image",
      gemini_3_image: "gemini-3-pro-image-preview",
      gemini_3_1_image: "gemini-3.1-flash-image-preview",
    };
    const modelName = MODEL_MAP[model] || "nano-banana-pro-preview";

    const response = await fetch(
      `${GOOGLE_AI_STUDIO_URL}/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseModalities: ["image", "text"],
            temperature: 0.6,
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[starting-frame] ${modelName} API error (${response.status}):`, errBody);
      return { imageUrl: null, photoId: null, status: "failed" };
    }

    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagePart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

    if (!imagePart?.inlineData) {
      console.error("[starting-frame] Gemini response contained no image data");
      return { imageUrl: null, photoId: null, status: "failed" };
    }

    const { mimeType, data: base64Data } = imagePart.inlineData;
    let imageUrl: string;

    // Upload to Supabase Storage (permanent URL required for FAL)
    if (isStorageConfigured()) {
      const buffer = Buffer.from(base64Data, "base64");
      const ext = mimeType.includes("png") ? "png" : "jpg";
      const storageKey = `starting-frames/${userId}/sf-${Date.now()}.${ext}`;
      try {
        imageUrl = await uploadFile(buffer, storageKey, mimeType);
      } catch (err) {
        console.error("[starting-frame] Supabase upload failed:", err);
        // Data URI fallback — will work for display but NOT for FAL image-to-video
        imageUrl = `data:${mimeType};base64,${base64Data}`;
      }
    } else {
      console.warn("[starting-frame] Storage not configured. Falling back to data URI (will not work with FAL).");
      imageUrl = `data:${mimeType};base64,${base64Data}`;
    }

    // Save as a photo record with the SF prefix so getStartingFrameUrl can find it
    const savedPhoto = await prisma.photo.create({
      data: {
        userId,
        filename: `${SF_FILENAME_PREFIX}${Date.now()}.${mimeType.includes("png") ? "png" : "jpg"}`,
        url: imageUrl,
        isPrimary: false,
      },
    });

    console.log(`[starting-frame] Generated successfully. Photo ID: ${savedPhoto.id}, URL is ${imageUrl.startsWith("data:") ? "data URI" : "Supabase URL"}`);

    return {
      imageUrl,
      photoId: savedPhoto.id,
      status: "complete",
    };
  } catch (err) {
    console.error("[starting-frame] Unexpected error during generation:", err);
    return { imageUrl: null, photoId: null, status: "failed" };
  }
}
