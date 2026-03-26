import { getConfig } from "./system-config";
import prisma from "./prisma";
import { getCharacterDescription } from "./character-profile";

const GOOGLE_AI_STUDIO_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * The prompt engine takes a simple user request and expands it into a
 * production-grade video generation prompt using Gemini.
 *
 * Input: "make a market update video for Seattle"
 * Output: 150-200 word prompt with iPhone camera specs, lived-in
 *         environment, character description, script with texture,
 *         and anti-glitch rules — ready to paste into Kling / Minimax / Wan.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface PromptEngineInput {
  userRequest: string;
  model: string;              // target video model (kling_2.6, seedance_2.0, sora_2)
  userId: string;
  industry?: string;
  duration?: number;           // seconds
  format?: "9:16" | "16:9" | "1:1";
  /** Item 41: If true, injects the user's first name into the prompt for personalized onboarding */
  isOnboarding?: boolean;
}

export interface PromptEngineOutput {
  expandedPrompt: string;      // the full production prompt
  script: string;              // extracted dialogue/script portion
  title: string;               // generated video title
  estimatedDuration: number;   // seconds
}

// ─── System Prompt ──────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an elite AI UGC video prompt engineer. Your prompts make AI video models produce content indistinguishable from real iPhone UGC.

CRITICAL RULE: Your expandedPrompt output MUST be 150-200 words. Video models get confused and produce worse output with long prompts. Be SHORT and SPECIFIC. Every word must earn its place.

═══ PROMPT STRUCTURE (follow this exact order) ═══

1. FORMAT + CAMERA (1 line): "9:16 vertical. iPhone 15 Pro Max back camera, 24mm lens, f/1.78 aperture, natural lighting."
2. SCENE (1-2 lines): Specific lived-in environment. "Kitchen counter with yesterday's mail and half-empty coffee mug" not "modern kitchen."
3. CHARACTER (2-3 lines): Physical appearance from the provided description. What they're wearing (real clothes, not "business casual"). Their ENERGY — "talks like she's FaceTiming her sister" not "maintains eye contact."
4. ACTION + SCRIPT (3-5 lines): What happens beat by beat. Dialogue with texture — "um"s, half-laughs, self-corrections. Hook in first 3 seconds.
5. ANTI-GLITCH (1-2 lines): "No morphing, no extra fingers, no face warping, consistent lighting, natural lip sync, real skin texture."

═══ BANNED WORDS — NEVER USE ═══
"professional" / "modern office" / "well-lit" / "crisp" / "polished" / "corporate" / "engaging" / "approachable" / "LED panel" / "business casual" / "button-down" / "blazer" / "maintaining eye contact" / "conveys sincerity" / "studio" / "high-quality" / "cinematic" — anything that sounds like a LinkedIn bio or stock photo description

═══ NON-NEGOTIABLE RULES ═══
- Camera: iPhone front-facing or propped on a surface. NEVER "professional setup."
- Audio: Raw iPhone mic — room noise, slight echo. NEVER studio quality.
- Environment: SPECIFIC and IMPERFECT — "car parked at Trader Joe's", "back patio, kids audible in background", "messy desk with two monitors and old coffee."
- Clothing: REAL — "that one Patagonia pullover everyone owns", "oversized hoodie, messy bun."
- Light: From WINDOWS and LAMPS. Natural. Never supplemented.
- Characters: Described like real humans with QUIRKS — "the kind of guy who always has a podcast recommendation."
- Hook: Conversational — "Okay so this is wild" / "Alright real quick" / "I wasn't gonna post this but"
- Dialogue: Has TEXTURE — pauses, half-laughs, self-corrections. People don't speak in complete sentences.
- The more polished you try to be, the less believable you become.

═══ REFERENCE PROMPTS (this is the quality bar and LENGTH target) ═══

REFERENCE A (text-to-video, ~150 words):
A young American woman with light brown hair in a white tank top drops The Ordinary Hyaluronic Acid serum onto her fingertips. She looks at camera and says "Okay girls, this seven dollar serum literally saved my skin. I used to wake up with the driest flakiest cheeks and nothing worked." She pats it onto her cheeks, skin instantly looks dewy and glowy. She says "Then I tried this Hyaluronic Acid from The Ordinary and after two weeks my skin has never been this hydrated." She holds the bottle up to camera and says "If you have dry skin you need this immediately." She tilts her face showing radiant skin with a satisfied smile. Bright bathroom, warm natural light, iPhone front-facing camera, handheld wobble, UGC aesthetic. 15 seconds. Avoid warped hands, duplicate faces, flickering.

REFERENCE B (with starting frame, ~200 words):
9:16 vertical. iPhone 15 Pro front camera. Inside a parked Ford F-150, suburban parking lot. Late afternoon golden hour through windows. Phone propped on dashboard — stable, zero handheld shake. Guy, 35-42, average build, short brown hair, light stubble, plain gray t-shirt, baseball cap, wedding ring. Tired but genuine eyes. Calm energy, zero hype — talks like he's FaceTiming his brother. Left hand rests on steering wheel, relaxed grip, all 5 fingers visible. Right hand holds product at chest level, steady. He exhales like he just remembered to record this. "Alright so… I'm not gonna sit here and hype you up on something that doesn't work." Glances at product, back to camera. "But this? I've been using it for like six weeks now." Small shrug. "More energy. Sleeping better. Just… feel like myself again." Half-laugh, shakes head. "Try it out. Seriously. What's the worst that happens?" Small nod, reaches to stop recording. Raw iPhone audio, soft cabin ambience, AC fan hum, zero music. No hand distortion, no face warping, no eye drift, natural lip sync, real skin texture.

YOUR OUTPUT must match that LENGTH and SPECIFICITY. Do NOT write 500-word essays. Concise, dense, every word visual.

OUTPUT FORMAT — Return valid JSON:
- "title": short punchy title (max 80 chars) — TikTok caption energy, not corporate memo
- "expandedPrompt": the production prompt (150-200 words MAX — this is critical)
- "script": just the dialogue with stage directions in parentheses
- "estimatedDuration": video length in seconds`;

// ─── Character Context Builder ──────────────────────────────────

async function getCharacterContext(userId: string): Promise<string> {
  // Get user's character sheet details
  const sheets = await prisma.characterSheet.findMany({
    where: { userId, status: "complete" },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  // Get user's brand profile
  const brand = await prisma.brandProfile.findFirst({
    where: { userId },
  });

  // Get user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, industry: true },
  });

  let context = "";

  // Get the detailed character description (extracted from photos)
  const characterDesc = await getCharacterDescription(userId);
  if (characterDesc) {
    context += `\n\nDETAILED CHARACTER DESCRIPTION (use this EXACTLY — every detail matters for consistency):\n${characterDesc}`;
  }

  if (user) {
    context += `\nCHARACTER NAME: ${user.firstName} ${user.lastName}`;
    context += `\nINDUSTRY: ${user.industry}`;
  }

  if (brand) {
    if (brand.brandName) context += `\nBRAND: ${brand.brandName}`;
    if (brand.tagline) context += `\nTAGLINE: ${brand.tagline}`;
    if (brand.toneOfVoice) context += `\nTONE: ${brand.toneOfVoice}`;
    if (brand.targetAudience) context += `\nTARGET AUDIENCE: ${brand.targetAudience}`;
  }

  if (sheets.length > 0) {
    context += `\nCHARACTER SHEET: Available (${sheets[0].type} — ${sheets[0].images.length} reference images)`;
  }

  return context;
}

// ─── Model-Specific Instructions ────────────────────────────────

function getModelInstructions(model: string): string {
  switch (model) {
    case "minimax_video":
    case "minimax_hailuo":
    case "sora_2":
      return `TARGET MODEL: Minimax Video (Hailuo)
Best at: natural motion, lip sync, talking head UGC, smooth camera.
Keep prompts to ONE action per clip (max 6 seconds per generation).
Describe the scene simply — Minimax follows short, direct instructions best.`;

    case "wan_2.1":
      return `TARGET MODEL: Wan 2.1
Best at: character consistency from reference images, creative control.
Keep prompts short and specific — Wan works best at 480p with clear single-action descriptions.
Always include the character's exact appearance details.`;

    case "ltx":
    case "ltx_fast":
      return `TARGET MODEL: LTX 2.3
Best at: fast generation, rapid iteration, b-roll and atmospheric shots.
Use simple scene descriptions. Good for testing ideas before switching to Kling/Minimax for finals.`;

    case "seedance_2.0":
    case "kling_2.6":
    default:
      return `TARGET MODEL: Kling 2.6 Pro
Best at: hyper-realistic UGC, talking heads, testimonials, lip sync.
Handles up to 10 seconds well. Use iPhone camera language, natural lighting, lived-in environments.
Keep prompts under 200 words — Kling degrades with longer prompts.`;
  }
}

// ─── Main Engine ────────────────────────────────────────────────

export async function expandPrompt(input: PromptEngineInput): Promise<PromptEngineOutput> {
  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
  if (!apiKey) {
    // Fallback: return a basic expansion without Gemini
    return {
      expandedPrompt: input.userRequest,
      script: input.userRequest,
      title: input.userRequest.length > 80 ? input.userRequest.substring(0, 77) + "..." : input.userRequest,
      estimatedDuration: input.duration || 8,
    };
  }

  const characterContext = await getCharacterContext(input.userId);
  const modelInstructions = getModelInstructions(input.model);
  const format = input.format || "9:16";
  const duration = input.duration || 8;

  // Get custom system prompt from admin config (if edited)
  const customSystemAdditions = await getConfig("prompt_video_default", "");

  // Item 41: For onboarding videos, inject the user's first name so the avatar addresses them personally
  let onboardingPersonalization = "";
  if (input.isOnboarding) {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { firstName: true },
    });
    const firstName = user?.firstName || "there";
    onboardingPersonalization = `\n\nONBOARDING PERSONALIZATION: This is the user's very first video. The script MUST address the user by name. Open with: "Hey ${firstName}, I'm your AI content partner..." Make the tone warm, excited, and personal. This video sells the subscription — make the user feel like the AI knows them.`;
  }

  const userMessage = `${modelInstructions}

CHARACTER CONTEXT:${characterContext || "\nNo character details available — create a realistic, relatable person with specific quirks and real clothing. NO generic descriptions."}

VIDEO REQUEST: "${input.userRequest}"
FORMAT: ${format} vertical
TARGET DURATION: ${duration} seconds
INDUSTRY: ${input.industry || "general"}
${onboardingPersonalization}
${customSystemAdditions ? `ADDITIONAL INSTRUCTIONS FROM ADMIN:\n${customSystemAdditions}` : ""}

Generate the full production prompt now. Return valid JSON only.`;

  try {
    const response = await fetch(
      `${GOOGLE_AI_STUDIO_URL}/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + userMessage }] },
          ],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[prompt-engine] Gemini error:", err);
      // Fallback
      return {
        expandedPrompt: input.userRequest,
        script: input.userRequest,
        title: input.userRequest.substring(0, 80),
        estimatedDuration: duration,
      };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        expandedPrompt: input.userRequest,
        script: input.userRequest,
        title: input.userRequest.substring(0, 80),
        estimatedDuration: duration,
      };
    }

    // Parse the JSON response
    const parsed = JSON.parse(text);
    return {
      expandedPrompt: parsed.expandedPrompt || input.userRequest,
      script: parsed.script || parsed.expandedPrompt || input.userRequest,
      title: parsed.title || input.userRequest.substring(0, 80),
      estimatedDuration: parsed.estimatedDuration || duration,
    };
  } catch (err) {
    console.error("[prompt-engine] Error:", err);
    return {
      expandedPrompt: input.userRequest,
      script: input.userRequest,
      title: input.userRequest.substring(0, 80),
      estimatedDuration: duration,
    };
  }
}
