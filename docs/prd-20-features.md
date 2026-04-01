# Official AI — 20 Features Technical Spec

**Date:** March 31, 2026
**Repo:** perceptron-stealth (Next.js 14 / Prisma / Supabase / FAL / Shotstack)

Each feature has: what to build, the files to create/modify, schema changes, API routes, and components. Ordered by implementation sequence — later features depend on earlier ones.

---

## Feature 1: Professional Identity Intake

Structured intake that captures how the professional thinks, communicates, and positions themselves. This data feeds every downstream generation.

**Schema (prisma/schema.prisma):**
```prisma
model ProfessionalIdentity {
  id                 String   @id @default(uuid())
  userId             String   @unique
  user               User     @relation(fields: [userId], references: [id])
  industry           String   // legal, real_estate, finance, medical
  specialty          String?  // "personal injury", "estate planning", "luxury residential"
  yearsExperience    Int?
  idealClient        String?  // free text: who they serve
  differentiators    String?  // JSON array of 3 key differentiators
  communicationTone  String   @default("professional") // professional | conversational | authoritative
  talkingPoints      String?  // JSON array of topics they speak about
  competitiveEdge    String?  // what they do that others don't
  geography          String?  // market/city they serve
  casePhilosophy     String?  // for attorneys: approach to cases
  clientConcerns     String?  // JSON array: what their clients worry about
  completedAt        DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```
Add `professionalIdentity ProfessionalIdentity?` to the `User` model.

**API routes:**
- `src/app/api/identity/route.ts` — GET (fetch current), POST (create), PATCH (update)

**Components:**
- `src/app/dashboard/identity/page.tsx` — multi-step form, 4 screens: Basics → Positioning → Communication → Review
- Each screen auto-saves on blur so progress isn't lost

**Wiring:**
- After onboarding paywall completes, redirect to `/dashboard/identity` if `professionalIdentity` is null
- Add identity completion check to `src/app/dashboard/layout.tsx` — show banner "Complete your profile to unlock personalized content" if incomplete

---

## Feature 2: Identity-Aware Script Engine

Refactor `expand.ts` to inject professional identity into script generation.

**Files to modify:**
- `src/lib/pipeline/expand.ts` — add `ProfessionalIdentity` lookup at the top of `handleExpand()`. Fetch identity via `prisma.professionalIdentity.findUnique({ where: { userId } })`. Inject into the Gemini system prompt as structured context block.

**New system prompt structure:**
```
You are writing a video script for {firstName} {lastName}, a {specialty} {industry} professional in {geography}.

Their positioning: {competitiveEdge}
Their communication style: {communicationTone}
Their key talking points: {talkingPoints}
Their ideal client concerns: {clientConcerns}

Write the script in their voice. Do not use generic marketing language.
```

- `src/lib/hook-generator.ts` — same treatment. Hooks should reference the professional's actual practice, not generic industry hooks.
- `src/lib/pipeline/types.ts` — add `identityContext?: string` to `PipelineMeta` so downstream steps can access the identity brief without re-fetching.

**No new routes needed.** This modifies existing pipeline behavior.

---

## Feature 3: Credibility Gate

Quality checkpoint after video stitching, before publish. Blocks low-quality output.

**Schema:**
```prisma
model CredibilityCheck {
  id             String   @id @default(uuid())
  videoId        String
  video          Video    @relation(fields: [videoId], references: [id])
  overallScore   Float    // 0.0 - 1.0
  lipSyncScore   Float?
  audioClarity   Float?
  visualQuality  Float?
  brandAlignment Float?
  passed         Boolean
  flags          String?  // JSON array of specific issues
  checkedAt      DateTime @default(now())
}
```
Add `credibilityChecks CredibilityCheck[]` to `Video` model.

**Files to create:**
- `src/lib/pipeline/credibility-gate.ts` — scoring function that evaluates the final video. Initial implementation: check video duration matches expected, verify video URL is accessible, verify thumbnail exists. Later: integrate with a vision model for lip sync scoring.

**Files to modify:**
- `src/lib/pipeline/orchestrator.ts` — add `credibility_gate` step after `poll_stitch`, before marking video as `complete`
- `src/lib/pipeline/types.ts` — add `credibilityScore?: number` and `credibilityPassed?: boolean` to `PipelineMeta`

**API:**
- `src/app/api/videos/[id]/credibility/route.ts` — GET returns check results, POST triggers re-check

**UI:**
- Add credibility score badge to `src/app/dashboard/content/page.tsx` video cards
- Add score breakdown to `src/app/dashboard/approvals/page.tsx` review cards

---

## Feature 4: Wire Onboarding Voice + Preview Video

Connect the stubbed endpoints to real services.

**Files to modify:**
- `src/app/api/onboarding/voice/route.ts` — replace stub with:
  1. Upload audio blob to Supabase Storage (`voice-samples/{userId}/{timestamp}.webm`)
  2. Create `VoiceSample` record in DB
  3. Call ElevenLabs Add Voice API with the audio file
  4. Store returned `voiceId` on the `VoiceSample` record

- `src/app/api/onboarding/preview-video/route.ts` — replace stub with:
  1. Generate an 8-second script via Gemini Flash (use identity if available, else generic)
  2. Generate TTS audio using the cloned voice (or stock voice if skipped)
  3. Submit single cut to FAL (Kling 2.6) using character sheet as reference
  4. Poll for completion
  5. Return `videoUrl`

**New lib file:**
- `src/lib/elevenlabs.ts` — ElevenLabs API client: `addVoice(audioBuffer, name)`, `generateSpeech(voiceId, text)`, `deleteVoice(voiceId)`

**Env var needed:** `ELEVENLABS_API_KEY`

---

## Feature 5: Persona Consistency Engine

Ensure visual and verbal coherence across all videos for a user.

**Schema:**
```prisma
model PersonaProfile {
  id                  String   @id @default(uuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id])
  characterSheetId    String?
  primaryVoiceId      String?
  wardrobePalette     String?  // JSON: extracted dominant colors from character sheet
  framingPreference   String   @default("center_bust") // center_bust | left_third | right_third
  backgroundStyle     String   @default("professional_office")
  vocalPaceWpm        Int?     // words per minute baseline
  vocalPitchHz        Float?   // average pitch
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

**Files to modify:**
- `src/lib/pipeline/anchor.ts` — pull `PersonaProfile` constraints into anchor context. Pass wardrobe palette and framing preference into the cut prompt.
- `src/lib/pipeline/scene-bible.ts` — reference persona constraints when building scene descriptions.
- `src/lib/character-sheet.ts` — after generating character sheet, extract dominant colors and store as `wardrobePalette` on `PersonaProfile`.

**API:**
- `src/app/api/persona/route.ts` — GET/PATCH

**Auto-creation:** When a user completes onboarding (character sheet + voice), auto-create their `PersonaProfile` with defaults extracted from their assets.

---

## Feature 6: Outcome Tracking

Track downstream business results tied to videos.

**Schema:**
```prisma
model OutcomeEvent {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  videoId     String?
  video       Video?   @relation(fields: [videoId], references: [id])
  type        String   // "booking", "call", "form_submit", "link_click"
  source      String?  // "calendly", "clio", "direct", "share_link"
  value       Float?   // dollar value if known
  metadata    String?  // JSON
  occurredAt  DateTime @default(now())
}
```
Add `outcomes OutcomeEvent[]` to both `User` and `Video` models.

**API routes:**
- `src/app/api/outcomes/route.ts` — GET (list with filters), POST (record event)
- `src/app/api/outcomes/summary/route.ts` — GET aggregated stats (total outcomes, by video, by type, by time period)
- `src/app/api/outcomes/webhook/route.ts` — POST receiver for Calendly/Cal.com webhooks

**Component:**
- `src/app/dashboard/outcomes/page.tsx` — outcome dashboard with: total conversions, per-video attribution, time series chart, outcome type breakdown

**Wiring:**
- Extend `/v/[id]/page.tsx` (public share page) to track `link_click` events with UTM params
- Add `?ref={videoId}` to all shared video URLs for attribution

---

## Feature 7: Flagship Video Mode

White-glove generation mode with higher quality settings and manual review.

**Files to modify:**
- `src/app/api/generate/route.ts` — accept `mode: "flagship"` in the request body. When flagship:
  - Set `model` to highest quality option
  - Set `status` to `"flagship_review"` instead of auto-advancing
  - Store `mode: "flagship"` in `PipelineMeta`

- `src/lib/pipeline/orchestrator.ts` — after `poll_stitch`, if `mode === "flagship"`, set status to `"flagship_review"` instead of `"complete"`. Wait for admin approval.

**New API:**
- `src/app/api/admin/flagship/route.ts` — GET (list videos awaiting review), POST (approve/reject with notes)
- `src/app/api/admin/flagship/[id]/route.ts` — PATCH (approve, reject, request-regeneration)

**UI:**
- Add flagship queue tab to `src/app/dashboard/admin/page.tsx`
- Add "Generate Flagship" button to `src/app/dashboard/generate/page.tsx` (visible to all users, limited to 1 per account)

---

## Feature 8: Identity-Driven Calendar Suggestions

Replace hardcoded calendar templates with identity-aware LLM generation.

**Files to modify:**
- `src/app/api/calendar/suggestions/route.ts` — replace the hardcoded `SUGGESTIONS` arrays with:
  1. Fetch `ProfessionalIdentity` for the user
  2. Build a Gemini Flash prompt: "Generate 30 days of video content ideas for {identity brief}. Each idea should include: topic, hook angle, target audience segment, and tie-back to the professional's positioning."
  3. Parse structured JSON response
  4. Cache results for 7 days per user (store in `SystemConfig` or a new `CalendarCache` table)

**Fallback:** If no identity exists, use current hardcoded templates (don't break existing flow).

---

## Feature 9: Platform-Specific Publishing

Generate platform-optimized output packages per video.

**Schema:**
```prisma
model PostingPackage {
  id          String   @id @default(uuid())
  videoId     String
  video       Video    @relation(fields: [videoId], references: [id])
  platform    String   // "linkedin", "instagram", "tiktok", "youtube", "website"
  caption     String?
  hashtags    String?  // JSON array
  description String?
  ctaText     String?
  ctaUrl      String?
  aspectRatio String   @default("9:16") // "9:16", "16:9", "1:1"
  videoUrl    String?  // platform-specific render (different aspect ratio)
  createdAt   DateTime @default(now())
}
```

**Files to modify:**
- `src/lib/pipeline/stitch-submit.ts` — after primary stitch, queue additional stitches for other aspect ratios (16:9 for LinkedIn/website, 9:16 for Reels/TikTok/Shorts)
- `src/app/api/posting-package/route.ts` — refactor to generate identity-aware captions per platform. LinkedIn: no hashtags, professional tone. Instagram: 3-5 hashtags, hook-first. TikTok: casual, trending language.

**New API:**
- `src/app/api/videos/[id]/packages/route.ts` — GET all packages for a video

**UI:**
- Add platform preview tabs to the publish confirmation modal in `src/app/dashboard/content/page.tsx`

---

## Feature 10: Voice Training Studio

Multi-sample voice training for higher fidelity clones.

**Files to create:**
- `src/app/dashboard/vault/voice-training/page.tsx` — guided recording UI with 5 script options per industry, progress tracker, quality indicators per sample
- `src/lib/voice-training.ts` — orchestrates multi-sample submission to ElevenLabs Professional Voice Clone API

**Files to modify:**
- `src/app/api/voices/route.ts` — extend POST to accept multiple samples, track training status
- Add `trainingStatus String @default("basic")` to `VoiceSample` model (basic | training | professional)
- Add `elevenLabsVoiceId String?` to `VoiceSample` model

**Flow:**
1. User records 3-5 samples (each 20-40 seconds)
2. All uploaded to Supabase Storage
3. Submitted to ElevenLabs in batch
4. Poll for training completion
5. Update `trainingStatus` to `"professional"`
6. All future TTS uses the professional voice model

---

## Feature 11: Referral System

Replace placeholder referral tracking with real attribution.

**Schema:**
```prisma
model Referral {
  id             String    @id @default(uuid())
  referrerId     String
  referrer       User      @relation("ReferralsMade", fields: [referrerId], references: [id])
  referredEmail  String
  referredUserId String?
  referred       User?     @relation("ReferralsReceived", fields: [referredUserId], references: [id])
  status         String    @default("pending") // pending | signed_up | converted | rewarded
  source         String?   // "share_link" | "direct_invite"
  convertedAt    DateTime?
  rewardApplied  Boolean   @default(false)
  createdAt      DateTime  @default(now())
}
```
Add `referralsMade Referral[] @relation("ReferralsMade")` and `referralsReceived Referral[] @relation("ReferralsReceived")` to `User`.

**Files to modify:**
- `src/app/api/referral/route.ts` — replace hardcoded zeros with real DB queries
- `src/app/api/auth/signup/route.ts` — check for `ref` query param, create `Referral` record linking referrer to new user

**New API:**
- `src/app/api/referral/invite/route.ts` — POST sends invite email with referral link

---

## Feature 12: Professional Context Feed

Industry-relevant content prompts personalized to the professional's identity.

**Files to create:**
- `src/app/dashboard/feed/page.tsx` — scrollable feed of content opportunities, each with "Generate Video" one-tap action
- `src/lib/content-feed.ts` — fetches industry signals (Google Trends API, RSS feeds for legal/real estate/finance news), combines with identity to generate personalized prompts via Gemini Flash
- `src/app/api/feed/route.ts` — GET returns personalized feed items (cached 24 hours)

**Feed item shape:**
```ts
interface FeedItem {
  id: string;
  topic: string;
  whyItMatters: string;
  suggestedAngle: string;
  urgency: "trending" | "seasonal" | "evergreen";
  generatedAt: string;
}
```

---

## Feature 13: Client Intake Integrations

Connect to the platforms professionals use for client management.

**Files to create:**
- `src/lib/integrations/calendly.ts` — webhook receiver, booking event → `OutcomeEvent`
- `src/lib/integrations/clio.ts` — OAuth + webhook for matter creation events
- `src/lib/integrations/follow-up-boss.ts` — webhook for new lead events
- `src/app/api/integrations/[platform]/connect/route.ts` — OAuth initiation
- `src/app/api/integrations/[platform]/callback/route.ts` — OAuth callback
- `src/app/api/integrations/[platform]/webhook/route.ts` — incoming event handler

**Schema:**
```prisma
model Integration {
  id           String    @id @default(uuid())
  userId       String
  user         User      @relation(fields: [userId], references: [id])
  platform     String    // "calendly", "clio", "follow_up_boss", "wealthbox"
  accessToken  String?
  refreshToken String?
  expiresAt    DateTime?
  webhookId    String?
  active       Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([userId, platform])
}
```

**UI:**
- Add integrations section to `src/app/dashboard/settings/page.tsx` — connect/disconnect buttons per platform

---

## Feature 14: Authority Score

Composite metric displayed on dashboard.

**Files to create:**
- `src/lib/authority-score.ts` — calculates score from:
  - Posting consistency: videos published / days active (25%)
  - Content quality: average credibility gate score (25%)
  - Engagement: total views + shares from analytics events (25%)
  - Outcomes: outcome events count (25%)
- `src/app/api/authority-score/route.ts` — GET returns current score + breakdown + trend (last 4 weeks)

**UI:**
- Add score widget to `src/app/dashboard/page.tsx` (main dashboard) — large number + trend arrow + breakdown ring chart
- Add milestone toasts when crossing thresholds (50, 70, 80, 90)

---

## Feature 15: Content Atomization

One video → multiple derivative assets.

**Files to create:**
- `src/lib/pipeline/atomize.ts` — post-generation step that takes a completed video and produces:
  - 15-second hook clip (first cut only, re-stitched)
  - Static quote card (extract key line from script, overlay on character sheet image via Gemini image gen)
  - LinkedIn text post (script → professional post via Gemini)
  - Blog draft (script → 500-word article via Gemini)

**Schema:**
```prisma
model DerivedAsset {
  id        String   @id @default(uuid())
  videoId   String
  video     Video    @relation(fields: [videoId], references: [id])
  type      String   // "hook_clip", "quote_card", "linkedin_post", "blog_draft"
  content   String?  // text content for posts/drafts
  assetUrl  String?  // URL for media assets
  createdAt DateTime @default(now())
}
```

**Files to modify:**
- `src/lib/pipeline/orchestrator.ts` — add `atomize` step after `credibility_gate`
- `src/app/dashboard/content/page.tsx` — show derived assets as expandable children under each video card

---

## Feature 16: Competitive Positioning Monitor

Replace hardcoded intelligence page data with real competitor tracking.

**Schema:**
```prisma
model CompetitorWatch {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  name         String
  platform     String   // "linkedin", "instagram", "tiktok"
  handle       String?
  lastChecked  DateTime?
  postCount30d Int?
  topTopics    String?  // JSON array
  createdAt    DateTime @default(now())
}
```

**Files to create:**
- `src/lib/competitor-tracker.ts` — scrapes public social profiles for posting frequency and topic extraction (LinkedIn public posts, Instagram public feed)
- `src/app/api/competitors/route.ts` — CRUD for watched competitors
- `src/app/api/competitors/analyze/route.ts` — triggers analysis, returns comparison data

**Files to modify:**
- `src/app/dashboard/intelligence/page.tsx` — replace hardcoded data with API calls to `/api/competitors/analyze`

---

## Feature 17: Notification System

**Schema:**
```prisma
model Notification {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  type      String    // "authority_drop", "competitor_activity", "streak_break", "outcome_milestone"
  title     String
  body      String
  actionUrl String?
  read      Boolean   @default(false)
  readAt    DateTime?
  createdAt DateTime  @default(now())
}
```

**Files to create:**
- `src/lib/notifications.ts` — `createNotification(userId, type, title, body, actionUrl?)`, `getUnread(userId)`
- `src/app/api/notifications/route.ts` — GET (list, filter by read/unread), PATCH (mark read)
- `src/components/NotificationBell.tsx` — bell icon with unread count badge, dropdown with recent notifications

**Files to modify:**
- `src/components/Sidebar.tsx` — add `NotificationBell` to sidebar header

**Triggers (add to respective API handlers):**
- Authority Score drops >5 points week-over-week → notification
- 3+ days without publishing → "Your streak is about to break"
- New outcome event → "A video just drove a consultation booking"
- Competitor posts a new video → "Your competitor just posted about [topic]"

---

## Feature 18: White-Label Video Portfolio Pages

Public-facing portfolio page per professional.

**Files to create:**
- `src/app/p/[slug]/page.tsx` — public page (no auth), pulls from `ProfessionalIdentity` + `BrandKit` + featured `Video[]`
- `src/app/api/portfolio/route.ts` — GET/PATCH (configure slug, featured videos, CTA link, bio override)

**Schema:**
```prisma
model Portfolio {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  slug           String   @unique
  headline       String?
  bio            String?
  ctaText        String?  // "Book a Consultation"
  ctaUrl         String?  // link to Calendly, Clio intake, etc.
  featuredVideos String?  // JSON array of video IDs
  published      Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

**Page sections:** Hero video (auto-plays), video grid (3-6 featured), about section (from identity), CTA button.

**SEO:** Add JSON-LD schema markup for `LocalBusiness` / `Attorney` / `RealEstateAgent` based on industry.

---

## Feature 19: Diagnostic Engagement Flow

Paid one-time engagement for white-glove onboarding.

**Files to create:**
- `src/app/diagnostic/page.tsx` — landing page with 3 tiers ($500 / $1,000 / $1,500)
- `src/app/api/diagnostic/checkout/route.ts` — creates Stripe one-time payment session
- `src/app/api/diagnostic/intake/route.ts` — extended intake form (deeper than standard identity)
- `src/app/api/diagnostic/[id]/route.ts` — GET status, PATCH update (admin)

**Schema:**
```prisma
model DiagnosticEngagement {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  tier          String    // "starter" | "professional" | "authority"
  amount        Int       // cents
  status        String    @default("paid") // paid | intake_complete | in_review | delivered | converted
  stripePaymentId String?
  intakeData    String?   // JSON: extended intake responses
  deliverables  String?   // JSON: URLs to audit PDF, flagship video, content plan
  deliveredAt   DateTime?
  convertedAt   DateTime? // when they converted to monthly subscription
  createdAt     DateTime  @default(now())
}
```

**Admin UI:**
- Add diagnostic queue to `src/app/dashboard/admin/page.tsx` — list engagements, update status, attach deliverables

---

## Feature 20: Professional Directory

Opt-in listing of professionals using the platform.

**Files to create:**
- `src/app/directory/page.tsx` — public page, filterable grid of professional cards
- `src/app/api/directory/route.ts` — GET with filters (industry, geography, specialty)

**Schema:**
Add to `User` model:
```prisma
  directoryOptIn    Boolean  @default(false)
  directoryBio      String?
  directorySlug     String?  @unique
```

**Card displays:** Name, title, industry, city, Authority Score badge, featured video thumbnail, link to portfolio page.

**Trigger:** After Authority Score reaches 50 for the first time, prompt user to opt in.

---

## Migration Order

Run these as separate Prisma migrations in sequence:

1. `ProfessionalIdentity` + User relation (Feature 1)
2. `PersonaProfile` + User relation (Feature 5)
3. `CredibilityCheck` + Video relation (Feature 3)
4. `OutcomeEvent` + User/Video relations (Feature 6)
5. `PostingPackage` + Video relation (Feature 9)
6. `Referral` + User relations (Feature 11)
7. `CompetitorWatch` + User relation (Feature 16)
8. `Notification` + User relation (Feature 17)
9. `DerivedAsset` + Video relation (Feature 15)
10. `Integration` + User relation (Feature 13)
11. `Portfolio` + User relation (Feature 18)
12. `DiagnosticEngagement` + User relation (Feature 19)
13. `directoryOptIn`, `directoryBio`, `directorySlug` on User (Feature 20)
14. `elevenLabsVoiceId`, `trainingStatus` on VoiceSample (Feature 10)

---

## Env Vars Needed

```
ELEVENLABS_API_KEY=         # Features 4, 10
STRIPE_SECRET_KEY=          # Features 7, 19 (already in .env, empty)
STRIPE_WEBHOOK_SECRET=      # Features 7, 19
POST_BRIDGE_API_KEY=        # Feature 9 (already in .env, empty)
CALENDLY_WEBHOOK_SECRET=    # Feature 13
CLIO_CLIENT_ID=             # Feature 13
CLIO_CLIENT_SECRET=         # Feature 13
GOOGLE_TRENDS_API_KEY=      # Feature 12 (optional, can scrape)
```
