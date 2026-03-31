# PRD: Onboarding V2 — Photo → Character Sheet → Paywall

**Status:** Shipped
**Date:** March 2026
**Origin:** Dave Siegfried / John Pletka product check-in, March 26 2026

---

## Problem

The V1 onboarding had 4 steps ending in a 60–90 second video render. That wait killed conversion — users dropped off before ever seeing the paywall. The "wow moment" (character sheet reveal) was buried under too much friction.

Key feedback from the call:
- "The 60-90 second video wait is the ADHD drop-off killer"
- "Check you out, you look pretty good" — the character sheet reveal IS the product
- Camera should be the primary photo option (not upload)
- Paywall needs to hit faster

---

## Solution

New 3-step flow that hits the paywall in under 15 seconds of user action:

```
Photo (camera-first) → Character Sheet Reveal → Paywall
```

Video generation removed from onboarding entirely — happens post-purchase.

---

## Step 1: Photo Capture

**Primary CTA:** "Take a photo now" — webcam via `MediaDevices.getUserMedia`
**Secondary CTA:** "Upload a photo" — file picker, image/*, max 10MB
**Quality gate:** min 300×300px, min 50KB — shows warning overlay, blocks confirm if fail

**Inline industry selection** (no longer a blocking step):
- 6 options: ⚖️ Legal, 🏠 Real Estate, 🩺 Medical, 📈 Finance, 🎬 Creator, 💼 Business
- Defaults to "business"
- Stored in `Photo.photoAnalysis` and passed to character sheet generation

**On confirm:**
1. Upload to Supabase storage via `POST /api/upload`
2. Save to DB via `POST /api/photos` (isPrimary: true)
3. Immediately advance to step 2 — character sheet API fires in parallel

---

## Step 2: Character Sheet Reveal

**Loading state (~4–10 seconds):**
5-stage cycling copy with personality:
1. "Scanning your face... 👁️" / "Mapping 68 facial landmarks"
2. "Generating your twin... 🧬" / "Building from the ground up"
3. "Styling your looks... ✨" / "9 professional poses incoming"
4. "Adding the magic... 🔮" / "This one always gets people"
5. "Almost there... 🎯" / "Worth the wait, we promise"

Progress bar + animated dots. User's photo ghosted inside loading orb.

**Reveal state:**
- Headline: "Wait... is that you?? 🤯"
- 60-particle confetti burst on image load
- Spring-bounce reveal (`stiffness: 120, damping: 16`)
- 3×3 pose grid — user taps one pose to select (ring highlight + checkmark)
- "Looks good →" CTA activates on selection
- "Not feeling it? Regenerate" escape hatch

**API:** `POST /api/character-sheet` with `{ photoUrls, industry }` → Gemini Flash generates 2 sheets in parallel (3×3 poses + 2×3 360°). ~4–10s.

---

## Step 3: Paywall

**Character sheet peek:** User's selected pose shown as hero, blurred with green "Your AI twin is ready" indicator.

**Offer:** $79/month after 7-day free trial

**Features listed:**
- 🎭 AI digital twin from 1 photo
- 🎙️ Voice cloned in 5 seconds
- 📱 Auto-posts to every platform
- 📅 Content calendar fills itself
- 📊 Analytics that tell you what works
- ♾️ 30 videos/month, every month

**Social proof:** 2-up testimonials (Sarah K. — 12k views; Marcus T. — attorney)

**CTAs:**
- Primary: "Start free trial" → `POST /api/stripe/checkout { plan: "starter" }`
- Escape: "Skip for now →" → `POST /api/onboarding/complete` → `/dashboard`

---

## Funnel Analytics

Tracked via `POST /api/events` → `LifecycleEvent` table. All events are unique-per-user.

| Event | Fires When |
|-------|-----------|
| `onboarding_photo_captured` | Photo passes quality + uploads (includes industry) |
| `onboarding_character_selected` | User taps a pose |
| `onboarding_paywall_viewed` | Paywall step mounts |
| `onboarding_trial_started` | "Start free trial" clicked |
| `onboarding_skipped` | "Skip for now" clicked |

Query drop-off: `GET /api/events` returns all lifecycle events per user. Aggregate across users via direct DB query on `LifecycleEvent`.

---

## Out of Scope (Phase 2)

**Voice clone step** — Originally planned as Step 3, inserted before paywall. Deferred: voice model not finalized. When ready, insert between character sheet and paywall:
- "Read this sentence aloud" (10-word pre-written sentence)
- 5-second MediaRecorder capture, auto-stop
- `POST /api/voices` — existing endpoint
- Playback of cloned voice on sample phrase
- Skip option

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/auth/onboarding/page.tsx` | Full rewrite — 3-step flow, inline industry, funnel tracking |
| `src/components/onboarding/CameraCapture.tsx` | New — webcam + upload, quality gate |
| `src/components/onboarding/CharacterSheetReveal.tsx` | New — 5-stage loading, confetti, spring reveal |
| `src/components/onboarding/PaywallStep.tsx` | New — pricing card, social proof, Stripe integration |
| `src/app/api/events/route.ts` | Extended with 5 onboarding funnel events |
| `docs/pipeline-diagram.md` | Mermaid diagrams for full system |
