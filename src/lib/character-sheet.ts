import prisma from "./prisma";
import { getConfig } from "./system-config";
import { uploadFile, isStorageConfigured } from "./storage";

const GOOGLE_AI_STUDIO_URL = "https://generativelanguage.googleapis.com/v1beta/models";

function getApiKey(): string {
  const key = process.env.GOOGLE_AI_STUDIO_KEY;
  if (!key) throw new Error("GOOGLE_AI_STUDIO_KEY is not set");
  return key;
}

// ─── Types ──────────────────────────────────────────────────────

export interface CharacterSheetResult {
  characterSheetId: string;
  compositeUrl: string | null;
  images: { url: string; position: number; angle: string | null }[];
  status: string;
}

interface GeminiImageResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { mimeType: string; data: string };
        text?: string;
      }>;
    };
  }>;
}

// ─── Industry Background Presets ────────────────────────────────
//
// 6 preset backgrounds per industry, used in character sheet generation.
// "We'll have a preset six backgrounds for each industry."

export const INDUSTRY_BACKGROUNDS: Record<string, string[]> = {
  real_estate: [
    "modern home with open floor plan and large windows",
    "open house setting with staged living room",
    "suburban neighborhood with tree-lined street",
    "professional office desk with laptop and listing documents",
    "sitting in a clean car, driver's seat, natural light through windows",
    "beautifully staged home interior with neutral tones",
  ],
  legal: [
    "courthouse steps with columns and warm afternoon light",
    "law office with dark wood desk and legal books",
    "legal library with floor-to-ceiling bookshelves",
    "glass-walled conference room in a modern law firm",
    "professional desk with legal documents and pen",
    "city skyline from a high-rise office window",
  ],
  finance: [
    "trading floor environment with multiple screens",
    "modern finance office with clean desk and monitor",
    "coffee shop with laptop open, casual working",
    "city street in financial district, walking",
    "home office with dual monitors and clean setup",
    "conference call setup with ring light and webcam angle",
  ],
  medical: [
    "clean clinical office with soft lighting",
    "doctor's office with medical diplomas on wall",
    "hospital corridor with natural light",
    "consultation room with warm neutral tones",
    "medical practice lobby, professional setting",
    "outdoor courtyard of a medical campus",
  ],
  creator: [
    "aesthetic home studio with ring light",
    "trendy coffee shop with exposed brick",
    "outdoor urban setting with golden hour light",
    "minimalist desk setup with camera and microphone",
    "cozy living room with curated decor",
    "rooftop or balcony with city view",
  ],
  business: [
    "modern coworking space with glass partitions",
    "coffee shop meeting, laptop open",
    "outdoor cafe with city backdrop",
    "professional office with clean desk",
    "home office with bookshelf background",
    "conference room with whiteboard",
  ],
  other: [
    "clean studio with neutral backdrop",
    "coffee shop with warm ambient lighting",
    "outdoor setting with soft natural light",
    "modern office with minimal decor",
    "home environment with comfortable setting",
    "gym or active lifestyle setting",
  ],
};

/**
 * Get the 6 background descriptions for a given industry.
 */
export function getBackgroundsForIndustry(industry: string): string[] {
  return INDUSTRY_BACKGROUNDS[industry] || INDUSTRY_BACKGROUNDS.other;
}

// ─── Core Generation ────────────────────────────────────────────

/**
 * Generate a character sheet by calling Google AI Studio (Gemini/Nano Banana).
 * Takes user photo URLs as reference and generates a 3x3 grid of the person in different poses.
 *
 * If Supabase Storage is configured, the generated image is uploaded there
 * and the returned URL is a permanent Supabase public URL (not a data URI).
 */
async function callGeminiImageGen(
  prompt: string,
  referenceImageUrls: string[],
  storageKey?: string,
  options?: { maxRetries?: number; label?: string }
): Promise<string | null> {
  const apiKey = getApiKey();
  const model = await getConfig("character_sheet_model", "nano_banana");
  const maxRetries = options?.maxRetries ?? 1;
  const label = options?.label ?? "unknown";

  // Map model config to actual Gemini model name
  const MODEL_MAP: Record<string, string> = {
    nano_banana: "nano-banana-pro-preview",
    gemini_image: "gemini-2.5-flash-image",
    gemini_3_image: "gemini-3-pro-image-preview",
    gemini_3_1_image: "gemini-3.1-flash-image-preview",
  };
  const modelName = MODEL_MAP[model] || "nano-banana-pro-preview";

  // Build parts: text prompt + reference images
  const parts: any[] = [{ text: prompt }];

  for (const url of referenceImageUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = res.headers.get("content-type") || "image/jpeg";
        parts.push({
          inlineData: { mimeType, data: base64 },
        });
      }
    } catch {
      // Skip images that fail to download
    }
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      console.log(`[character-sheet] Retry ${attempt}/${maxRetries} for ${label}`);
    }

    try {
      const response = await fetch(
        `${GOOGLE_AI_STUDIO_URL}/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseModalities: ["image", "text"],
              temperature: 0.8,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        lastError = new Error(`Gemini API error (${response.status}): ${err}`);
        console.error(`[character-sheet] ${label} attempt ${attempt} API error:`, lastError.message);
        continue;
      }

      const data: GeminiImageResponse = await response.json();

      // Extract generated image from response
      const candidate = data.candidates?.[0];
      const imagePart = candidate?.content?.parts?.find((p) => p.inlineData);

      if (imagePart?.inlineData) {
        const { mimeType, data: base64Data } = imagePart.inlineData;

        // Upload to Supabase Storage if configured (permanent URL)
        if (isStorageConfigured() && storageKey) {
          try {
            const buffer = Buffer.from(base64Data, "base64");
            const publicUrl = await uploadFile(buffer, storageKey, mimeType);
            return publicUrl;
          } catch (err) {
            console.error("[character-sheet] Storage upload failed, falling back to data URL:", err);
          }
        }

        // Fallback: return as data URL
        return `data:${mimeType};base64,${base64Data}`;
      }

      // No image returned — log what the model DID return for debugging
      const textPart = candidate?.content?.parts?.find((p) => p.text);
      const refusalText = textPart?.text || "(no text in response)";
      console.error(
        `[character-sheet] ${label} attempt ${attempt}: No image generated. ` +
        `Model response text: ${refusalText.substring(0, 500)}`
      );
      console.error(
        `[character-sheet] ${label} attempt ${attempt}: Full response structure: ` +
        `candidates=${data.candidates?.length ?? 0}, ` +
        `parts=${candidate?.content?.parts?.length ?? 0}`
      );
      lastError = new Error(`No image in response: ${refusalText.substring(0, 200)}`);
    } catch (err: any) {
      lastError = err;
      console.error(`[character-sheet] ${label} attempt ${attempt} threw:`, err.message);
    }
  }

  // All attempts exhausted
  console.error(`[character-sheet] ${label}: All ${maxRetries + 1} attempts failed. Last error:`, lastError?.message);
  return null;
}

// ─── Poses Character Sheet ──────────────────────────────────────

/**
 * Generate a 3x3 character sheet with the person in 9 different poses.
 * This is shown to the user during onboarding.
 *
 * The prompt includes industry-specific backgrounds so the generated
 * poses show the person in contextually relevant settings.
 */
export async function generatePosesSheet(
  userId: string,
  photoUrls: string[],
  industry?: string
): Promise<CharacterSheetResult> {
  // Resolve industry for background selection
  const resolvedIndustry = industry || (await prisma.user.findUnique({
    where: { id: userId },
    select: { industry: true },
  }))?.industry || "other";

  const backgrounds = getBackgroundsForIndustry(resolvedIndustry);
  const backgroundList = backgrounds.map((bg, i) => `  ${i + 1}. ${bg}`).join("\n");

  const defaultPrompt = `Generate a 3x3 character sheet of this person in 9 different professional poses.

Use the reference photos to match their EXACT appearance — skin tone, hair, facial features, body type, and any distinguishing features.

POSES (one per grid cell):
1. Confident standing, arms relaxed — Background: ${backgrounds[0]}
2. Sitting professionally — Background: ${backgrounds[1]}
3. Gesturing while speaking to camera — Background: ${backgrounds[2]}
4. Arms crossed, warm smile — Background: ${backgrounds[3]}
5. Looking to the side, natural candid moment — Background: ${backgrounds[4]}
6. Walking confidently — Background: ${backgrounds[5]}
7. Leaning casually against a surface — Background: ${backgrounds[0]}
8. Pointing forward, engaging the viewer — Background: ${backgrounds[1]}
9. Close-up headshot, direct eye contact — Background: ${backgrounds[2]}

INDUSTRY BACKGROUND OPTIONS (use these settings):
${backgroundList}

Professional lighting appropriate for each setting. Clean composition. Character consistency is CRITICAL across all 9 poses — the person must look identical in every cell.`;

  const prompt = await getConfig("prompt_character_sheet_poses", defaultPrompt);

  // Create DB record
  const sheet = await prisma.characterSheet.create({
    data: {
      userId,
      type: "poses",
      status: "generating",
    },
  });

  const storageKey = `character-sheets/${userId}/${sheet.id}-poses.png`;

  try {
    const imageUrl = await callGeminiImageGen(prompt, photoUrls, storageKey, {
      maxRetries: 1,
      label: "poses",
    });

    if (!imageUrl) {
      console.error(`[character-sheet] poses for user ${userId}: All attempts returned no image`);
      await prisma.characterSheet.update({
        where: { id: sheet.id },
        data: { status: "failed" },
      });
      return { characterSheetId: sheet.id, compositeUrl: null, images: [], status: "failed" };
    }

    // Save composite
    await prisma.characterSheet.update({
      where: { id: sheet.id },
      data: { compositeUrl: imageUrl, status: "complete" },
    });

    // Save individual image reference (the composite for now)
    await prisma.characterSheetImage.create({
      data: {
        characterSheetId: sheet.id,
        url: imageUrl,
        position: 0,
        angle: "composite",
      },
    });

    return {
      characterSheetId: sheet.id,
      compositeUrl: imageUrl,
      images: [{ url: imageUrl, position: 0, angle: "composite" }],
      status: "complete",
    };
  } catch (err: any) {
    await prisma.characterSheet.update({
      where: { id: sheet.id },
      data: { status: "failed" },
    });
    throw err;
  }
}

// ─── 360° Character Sheet ───────────────────────────────────────

/**
 * Generate a 360-degree character sheet showing the person from every angle.
 * This is NOT shown to the user — stored in Supabase Storage as a backend
 * reference for the video generation model to maintain character consistency
 * from any viewing angle.
 *
 * From the transcript: "I need a character sheet of this same person but
 * 360 degrees — front, 45 degrees right, back of head, back right,
 * back left, top of head, feet."
 */
export async function generate3DSheet(
  userId: string,
  photoUrls: string[]
): Promise<CharacterSheetResult> {
  // Simplified to 6 angles in a 2x3 grid — the original 9-angle 3x3 grid
  // (including top-of-head bird's-eye and near-duplicate back-left/back-right)
  // was too complex for a single image generation call and consistently failed.
  const defaultPrompt = `Generate a character reference sheet showing this person from 6 different angles, arranged in a 2-row by 3-column grid.

Use the reference photos to match their EXACT appearance — skin tone, hair, facial features, body type, and any distinguishing features.

GRID LAYOUT (2 rows, 3 columns):
Row 1: FRONT view, 3/4 RIGHT view, RIGHT PROFILE (side view)
Row 2: BACK view (rear of head and body), 3/4 LEFT view, LEFT PROFILE (side view)

Keep the person's pose neutral and standing in every cell. Same clothing, same appearance across all 6 views. Plain light gray background, clean studio lighting. This is a reference sheet for AI video generation — consistency and accuracy matter most.`;

  const prompt = await getConfig("prompt_character_sheet_3d", defaultPrompt);

  const sheet = await prisma.characterSheet.create({
    data: {
      userId,
      type: "3d_360",
      status: "generating",
    },
  });

  // Store in Supabase — this is backend-only, never shown to user
  const storageKey = `character-sheets/${userId}/${sheet.id}-360.png`;

  try {
    const imageUrl = await callGeminiImageGen(prompt, photoUrls, storageKey, {
      maxRetries: 2,
      label: "3d_360",
    });

    if (!imageUrl) {
      console.error(`[character-sheet] 3d_360 for user ${userId}: All attempts returned no image`);
      await prisma.characterSheet.update({
        where: { id: sheet.id },
        data: { status: "failed" },
      });
      return { characterSheetId: sheet.id, compositeUrl: null, images: [], status: "failed" };
    }

    await prisma.characterSheet.update({
      where: { id: sheet.id },
      data: { compositeUrl: imageUrl, status: "complete" },
    });

    // Store with angle metadata for reference
    await prisma.characterSheetImage.create({
      data: {
        characterSheetId: sheet.id,
        url: imageUrl,
        position: 0,
        angle: "composite_360",
      },
    });

    return {
      characterSheetId: sheet.id,
      compositeUrl: imageUrl,
      images: [{ url: imageUrl, position: 0, angle: "composite_360" }],
      status: "complete",
    };
  } catch (err: any) {
    console.error(`[character-sheet] 3d_360 for user ${userId} threw:`, err.message);
    await prisma.characterSheet.update({
      where: { id: sheet.id },
      data: { status: "failed" },
    });
    throw err;
  }
}

// ─── Demo Mode ──────────────────────────────────────────────────

/**
 * Generate a demo character sheet when no API key is configured.
 * Returns placeholder data so the UI flow still works in development.
 */
export async function generateDemoSheet(
  userId: string,
  type: "poses" | "3d_360"
): Promise<CharacterSheetResult> {
  const sheet = await prisma.characterSheet.create({
    data: {
      userId,
      type,
      status: "complete",
      compositeUrl: null,
    },
  });

  return {
    characterSheetId: sheet.id,
    compositeUrl: null,
    images: [],
    status: "demo",
  };
}

// ─── Public API ─────────────────────────────────────────────────

/**
 * Main entry point: generates both the poses sheet (user-facing)
 * and the 3D sheet (backend-only) in parallel.
 * Falls back to demo mode if no API key is set.
 *
 * @param userId   - The user's ID
 * @param photoUrls - Supabase URLs of the user's uploaded photos
 * @param industry - Optional industry for background presets (resolved from DB if not passed)
 */
export async function generateCharacterSheets(
  userId: string,
  photoUrls: string[],
  industry?: string
): Promise<{ poses: CharacterSheetResult; threeD: CharacterSheetResult }> {
  const hasApiKey = !!process.env.GOOGLE_AI_STUDIO_KEY;

  if (!hasApiKey) {
    const [poses, threeD] = await Promise.all([
      generateDemoSheet(userId, "poses"),
      generateDemoSheet(userId, "3d_360"),
    ]);
    return { poses, threeD };
  }

  // Generate both in parallel — poses sheet gets industry backgrounds,
  // 360 sheet is industry-agnostic (neutral studio background)
  const [poses, threeD] = await Promise.all([
    generatePosesSheet(userId, photoUrls, industry),
    generate3DSheet(userId, photoUrls),
  ]);

  return { poses, threeD };
}
