# Official AI — 20-Feature PRD

**Version:** 1.0
**Date:** March 31, 2026
**Authors:** Kayan Mishra, Claude Code
**Strategic Frame:** Professional Authority Infrastructure (Blue Ocean)

---

## Strategic Context

Official AI is not an AI video tool. It is professional authority infrastructure for high-stakes individual practitioners — trial lawyers, financial advisors, real estate agents, surgeons, expert witnesses — who need a consistent, credible digital presence that earns trust over time.

The competitive set is not HeyGen or Synthesia. It is video production agencies, personal brand consultants, and media coaching firms. The value curve eliminates template dependency, deprioritizes render speed, and stakes out four axes competitors score near zero on:

1. **Professional identity depth** — output trained on how the professional actually thinks and communicates
2. **Credibility of output in high-stakes contexts** — video that belongs on a law firm website, not a SaaS demo
3. **Persona consistency across time** — a coherent on-screen presence over months, not one-off clips
4. **Outcome-linked positioning** — priced and measured on client intake conversion, not video count

Every feature below serves one or more of these axes. Features are ordered by implementation priority within each phase.

---

## Phase 1: Authority Foundation (Weeks 1–4)

### Feature 1: Professional Identity Intake

**What:** A structured diagnostic flow (post-paywall, post-onboarding) that extracts the professional's actual expertise, communication style, case philosophy, and client positioning. Not a form. A guided conversation — 8–12 questions that adapt based on industry.

**Why:** This is the moat. Every competitor starts with "pick a template." We start with "tell us who you are and how you win." The intake output becomes the persistent context layer that shapes every piece of content the system generates. Without this, we're just another avatar tool.

**Inputs:** Industry, specialty/niche, years of practice, ideal client profile, 3 key differentiators, communication tone (formal/conversational/authoritative), sample talking points they use in real life, competitive positioning ("what do you do that others in your market don't").

**Output:** A `ProfessionalIdentity` record stored in the database. Used as system context for all downstream generation — scripts, hooks, captions, posting strategy.

**Technical:**
- New Prisma model `ProfessionalIdentity` with fields for each intake dimension
- New route `/dashboard/identity` with a multi-step conversational form
- LLM-powered adaptive follow-up questions (Gemini Flash)
- API: `POST /api/identity`, `GET /api/identity`, `PATCH /api/identity`
- Identity record referenced by script generation, hook generation, caption generation, and calendar suggestion APIs

**Success metric:** 80%+ completion rate among paying users. Intake data referenced in 100% of generated content.

---

### Feature 2: Authority Script Engine

**What:** Replace the generic script expansion step in the video pipeline with an identity-aware script engine. Every script is generated from the professional's identity profile — their philosophy, their language patterns, their client concerns — not from a template library.

**Why:** The current `expand.ts` pipeline step generates scripts from a topic string. That produces content-marketer output. An attorney's video should sound like that attorney's actual counsel. A financial advisor's video should reference the concerns their specific client base has. This is the difference between "AI video" and "my digital presence."

**Technical:**
- Refactor `src/lib/pipeline/expand.ts` to accept `professionalIdentityId` and inject identity context into the system prompt
- New prompt architecture: identity brief → topic → script with voice/tone matching
- Store generated scripts with identity lineage for consistency tracking
- A/B prompt variants tracked in `SystemConfig` for quality iteration

**Success metric:** Blind test — can a colleague of the professional identify that the script sounds like them? Target 70%+ attribution accuracy.

---

### Feature 3: Persona Consistency Engine

**What:** A system that ensures visual and verbal coherence across all generated content for a given professional. Same wardrobe palette, same framing, same vocal cadence, same on-screen mannerisms — across weeks and months of output.

**Why:** Authority is built through familiarity. A trial lawyer who appears in 30 videos over 3 months needs to look and sound like the same person making the same caliber of argument every time. One-off video quality is table stakes. Consistency over time is the moat.

**Technical:**
- New `PersonaProfile` model linking to `CharacterSheet`, `VoiceSample`, and `ProfessionalIdentity`
- `scene-bible.ts` and `anchor.ts` extended to pull persona constraints (wardrobe, framing, tone) from the profile
- Visual consistency scoring: compare each new video frame against the reference character sheet embeddings
- Voice consistency: track pitch, pace, and tone metrics across generated audio clips
- Dashboard indicator showing "persona consistency score" over time

**Success metric:** Visual consistency score >0.85 across 10+ videos for a single professional.

---

### Feature 4: Credibility Gate

**What:** A quality checkpoint before any video is published that evaluates whether the output meets professional broadcast standards. Not just "does this look real" — "would a partner at a law firm put this on their website?"

**Why:** The #1 reason second-tier non-customers rejected the avatar category is reputational risk. They tried it, the output felt synthetic or cheap, and they were embarrassed. The Credibility Gate is the trust mechanism that makes professionals willing to automate.

**Technical:**
- New pipeline step after `stitch` and before publish: `credibility-gate.ts`
- Multi-factor scoring: lip sync quality (>0.8), background professionalism, text overlay readability, audio clarity, brand alignment with identity profile
- Videos that fail the gate are flagged for re-generation with adjusted parameters, not published
- User-facing UI in the approvals queue showing the credibility score and specific flags
- API: `POST /api/videos/[id]/credibility-check`

**Success metric:** Zero videos published with credibility score below threshold. User override requires explicit acknowledgment.

---

### Feature 5: V2 Onboarding (Shipped — Refinements)

**What:** The 4-step onboarding flow already built: Photo Capture → Character Sheet Reveal → Voice Clone → Paywall with video preview. Phase 1 refinements: wire voice cloning to ElevenLabs, connect preview video generation, add live photo capture prompt ("take a photo right now" as default).

**Why:** The onboarding is the first wow moment. Character sheet reveal + voice clone in under 60 seconds is the hook that converts trial-to-paid. The video preview on the paywall is the proof that this output is worth paying for.

**Technical (remaining work):**
- Wire `/api/onboarding/voice` to ElevenLabs clone API (5-second minimum sample)
- Wire `/api/onboarding/preview-video` to the video pipeline (single cut, 8-second talking head)
- Add webcam-first prompt with countdown timer (reduce friction vs file picker)
- Track completion time per step for funnel optimization
- A/B test: character sheet reveal with vs without confetti

**Success metric:** Photo-to-paywall conversion >25%. Median completion time <90 seconds.

---

### Feature 6: Outcome Dashboard

**What:** Replace the current analytics page (which tracks video views and follower growth) with an outcome-linked dashboard that connects video output to business results. For attorneys: client intake calls, consultation bookings. For real estate: listing inquiry clicks, open house RSVPs.

**Why:** Every competitor sells "videos created" and "views." Nobody sells "clients won." The outcome dashboard is the positioning proof — it makes the ROI conversation concrete and gives us pricing power.

**Technical:**
- New `/dashboard/outcomes` page
- Integration points: Calendly/Cal.com webhook for booking attribution, UTM tracking on video share links, click-through tracking on CTAs embedded in video captions
- API: `POST /api/outcomes/track`, `GET /api/outcomes/summary`
- New Prisma model `OutcomeEvent` (type, source_video_id, value, timestamp)
- Attribution logic: if a prospect clicks a video share link and books within 7 days, attribute to that video
- Industry-specific outcome labels (configurable per `ProfessionalIdentity`)

**Success metric:** 40%+ of paying users connect at least one outcome tracking source within first 30 days.

---

## Phase 2: Authority Scaling (Weeks 5–8)

### Feature 7: Flagship Video Production

**What:** A white-glove video production flow for the initial "flagship" piece — the single best video that represents the professional. Not auto-generated. Human-reviewed prompt engineering, multiple takes, professional-grade output. Delivered within 48 hours of identity intake completion.

**Why:** This is the closed pilot deliverable from the Blue Ocean strategy. The flagship video is the proof that this isn't a toy. It's the video the professional puts on their homepage, their LinkedIn banner, their email signature. It converts the professional from "trying AI video" to "this is my digital presence."

**Technical:**
- New generation mode: `flagship` — uses maximum quality settings, multiple model passes, manual review queue
- Admin pipeline view for Mudita team to review/adjust before delivery
- `/api/generate` extended with `mode: "flagship"` parameter
- 3 rounds: initial generation → team review → refinement → professional approval
- Stored as primary video in the professional's vault with "flagship" badge

**Success metric:** 90%+ approval rate on first delivery. Professional uses it publicly within 7 days.

---

### Feature 8: Content Calendar with Identity Context

**What:** Refactor the existing calendar suggestion engine to generate content plans based on the professional's identity profile, not generic industry templates. Calendar suggestions should reference the professional's actual practice areas, current market conditions in their geography, and their stated client concerns.

**Why:** The current calendar API returns hardcoded templates per industry. That's a template library — the exact thing we're eliminating. Identity-driven calendar suggestions demonstrate that the system *knows* the professional.

**Technical:**
- Refactor `/api/calendar/suggestions` to pull `ProfessionalIdentity` and use it as LLM context
- Suggestions include: topic, hook angle, target audience segment, expected outcome, and tie-back to the professional's positioning
- 30-day rolling calendar with seasonal/market awareness (e.g., "tax season approaching" for financial advisors, "spring listing season" for real estate)
- User can approve/edit/reject each suggestion before it enters the generation queue

**Success metric:** 60%+ of calendar suggestions approved without edit.

---

### Feature 9: Authority Publishing (Platform-Specific Output)

**What:** Each video generates not just the video file, but platform-specific packages: LinkedIn (horizontal, professional caption, no hashtags), Instagram Reels (vertical, hook-first, 3-5 hashtags), TikTok (vertical, trending audio overlay option), YouTube Shorts (vertical, SEO-optimized description), and firm website (horizontal, embedded player with schema markup).

**Why:** Professionals don't post to "social media." They have specific channels where their authority matters. LinkedIn for B2B referrals, their website for direct client intake, Instagram for brand warmth. Each platform has different credibility signals. One-size output is a consumer feature.

**Technical:**
- Extend the `stitch` pipeline step to produce multiple aspect ratios per video
- New `PostingPackage` model with platform-specific fields (caption, hashtags, description, CTA, thumbnail)
- Refactor `/api/posting-package` to generate identity-aware captions per platform
- PostBridge integration extended to submit platform-specific media + copy
- Dashboard shows platform-specific previews before publish

**Success metric:** 3+ platforms connected per professional. Cross-platform posting in single action.

---

### Feature 10: Voice Training Studio

**What:** Extend the current voice vault from a single sample upload to a training studio. The professional records 3–5 scripted passages (2 minutes total), the system analyzes their vocal characteristics (pace, tone, emphasis patterns), and the voice clone improves over time as more content is generated and approved.

**Why:** Voice is identity. A 5-second clone gets you 70% there. A trained voice model that learns the professional's emphasis patterns — how they pause before a key point, how they lower their pitch for authority — gets you to 95%. That's the difference between "AI voice" and "my voice."

**Technical:**
- New `/dashboard/vault/voice-training` UI with guided recording sessions
- Multiple script options per industry (legal argument style, client reassurance style, educational style)
- Backend: aggregate approved voice samples into a progressively refined voice model
- ElevenLabs Professional Voice Clone API (or equivalent) with multi-sample training
- Voice consistency metrics displayed in the vault

**Success metric:** Voice recognition accuracy >85% by third recording session.

---

### Feature 11: Referral Attribution System

**What:** Replace the placeholder referral system with outcome-linked referral tracking. When a professional shares their AI-generated video and someone watches it, then later becomes a client, track that chain. When a professional refers another professional to Official AI, track the downstream revenue.

**Why:** Two purposes. First, it proves ROI: "this video you posted generated 3 consultation requests." Second, it creates a word-of-mouth engine in professional networks — the highest-trust acquisition channel for this buyer segment.

**Technical:**
- New Prisma model `Referral` (referrer_id, referred_id, status, source, converted_at, revenue_attributed)
- Referral links with UTM tracking embedded in shared video pages (`/v/[id]?ref=...`)
- Webhook integration for tracking downstream conversions
- Referral dashboard showing: professionals referred, their activation status, and attributed revenue
- Reward structure: credit toward subscription, not discounts (maintains pricing power)

**Success metric:** 20%+ of professionals refer at least one colleague within 90 days.

---

### Feature 12: Professional Context Feed

**What:** A curated feed of industry-relevant content opportunities — trending legal topics, market shifts, regulatory changes, seasonal events — that the professional can one-tap into a video generation queue. Not a template. A context-aware prompt that combines the trending topic with the professional's identity and positioning.

**Why:** The hardest part of content creation isn't making the video — it's knowing what to say. Professionals don't want to brainstorm topics. They want someone to say "here's what your clients are worried about this week, and here's the angle that positions you as the authority on it."

**Technical:**
- New `/dashboard/feed` page
- Backend: industry-specific content signal aggregation (RSS, Google Trends API, legal news feeds, MLS data feeds)
- Each feed item includes: topic, why it matters for the professional's audience, suggested angle based on their identity profile, one-tap "generate video" action
- Feed items personalized per `ProfessionalIdentity` — a personal injury lawyer sees different items than an estate planning attorney
- API: `GET /api/feed` with industry/identity filtering

**Success metric:** 2+ videos per month generated from feed suggestions.

---

## Phase 3: Authority Moat (Weeks 9–12)

### Feature 13: Client Intake Integration

**What:** Direct integration with the platforms professionals use to receive client inquiries: Clio (legal), kvCORE/Follow Up Boss (real estate), Wealthbox (financial advisory), and generic Calendly/Cal.com. When a video drives an intake action, it's tracked automatically.

**Why:** This closes the outcome loop. Without it, "did this video work?" is a guess. With it, it's a number. And that number is the sales pitch for every renewal conversation and every referral: "Official AI generated 14 consultation requests for you last quarter."

**Technical:**
- New integration framework: `src/lib/integrations/` with adapters per platform
- OAuth flows for Clio, kvCORE, Follow Up Boss, Wealthbox
- Webhook receivers for intake events
- Attribution matching: video share link → intake event within attribution window
- Display in Outcome Dashboard with drill-down per video

**Success metric:** 30%+ of professionals connect at least one intake platform.

---

### Feature 14: Authority Score

**What:** A composite metric visible on the dashboard that quantifies the professional's digital authority trajectory. Combines: posting consistency, content diversity, audience growth rate, engagement quality (comments from potential clients vs. peers), and outcome conversion rate.

**Why:** Gamification that serves the professional. The Authority Score gives them a single number to track and improve. It also creates a natural upsell path: "your Authority Score is 62. Professionals who reach 80+ see 3x more client inquiries. Here's what to focus on."

**Technical:**
- New API: `GET /api/authority-score`
- Weighted composite: consistency (25%), content quality via credibility gate scores (25%), engagement signals (25%), outcome conversion (25%)
- Historical tracking with trend line
- Milestone notifications: "You've reached Authority Level 3 — your posting consistency is in the top 15% of attorneys on the platform"
- Displayed prominently on the dashboard overview

**Success metric:** 70%+ of professionals check their Authority Score weekly.

---

### Feature 15: Multi-Format Content Atomization

**What:** Each flagship or standard video automatically generates derivative assets: a 60-second cut, a 15-second hook clip, a static quote card image, a blog post draft, and a LinkedIn text post — all identity-consistent.

**Why:** Professionals don't want to create 30 pieces of content. They want to show up consistently across channels with minimal effort. One video should produce a week's worth of content across platforms. This is the "zero effort" promise made real.

**Technical:**
- Post-generation pipeline: `atomize.ts` step that takes a completed video and produces derivative formats
- Image generation: extract key frames, overlay quote text, generate branded cards via Gemini
- Text generation: video script → LinkedIn post, blog draft, email snippet (identity-aware)
- All derivatives stored under the parent video in the content library
- Calendar auto-populates with derivative content across the week

**Success metric:** 5+ derivative assets generated per video. 3+ published per week per professional.

---

### Feature 16: Competitive Positioning Monitor

**What:** Track how the professional's digital presence compares to competitors in their market. How often are competing attorneys/agents/advisors posting video? What topics are they covering? Where are the gaps?

**Why:** Professionals are competitive. Showing them that their competitor down the street is posting 3x more video — and here's the gap in topics they haven't covered — is the strongest retention mechanism possible. It transforms the platform from a tool into a strategic advantage.

**Technical:**
- New `/dashboard/intelligence` refactor (replace hardcoded data)
- Input: professional provides 3–5 competitor names/firms
- Backend: social media scraping for public posting frequency and topic analysis
- Display: side-by-side comparison of posting frequency, topic coverage, estimated engagement
- Gap analysis: "Your competitors are covering [topic]. You haven't addressed this yet. Generate a video?"

**Success metric:** 60%+ of professionals add at least one competitor to track.

---

### Feature 17: Notification & Nudge System

**What:** Intelligent notifications that drive consistent publishing without being annoying. Not "you haven't posted in 3 days." Instead: "Your Authority Score dropped 4 points this week. One video on [suggested topic] would recover it." Or: "A competitor just posted about [topic]. Here's your angle."

**Why:** The professionals who churn are the ones who stop publishing. They stop because they forget, or they don't know what to say next, or the novelty wore off. The nudge system keeps them engaged by connecting publishing to outcomes they care about.

**Technical:**
- New Prisma model `Notification` (type, user_id, title, body, action_url, read, created_at)
- Notification triggers: Authority Score decline, competitor activity, calendar gap, outcome milestone, streak maintenance
- Delivery channels: in-app (bell icon), email digest (weekly), push (future)
- API: `GET /api/notifications`, `PATCH /api/notifications/[id]/read`
- Frequency cap: max 3 notifications per day, max 1 email per week

**Success metric:** Notification-driven video generation accounts for 20%+ of total output.

---

### Feature 18: White-Label Video Pages

**What:** Each professional gets a branded video portfolio page at a custom URL (e.g., `official.ai/v/sarah-chen-law` or their own domain via CNAME). The page showcases their best videos, their professional bio (pulled from identity profile), and a CTA that links to their intake system.

**Why:** This is the "website replacement" play. Many solo practitioners have mediocre websites. A polished, video-first landing page that converts visitors into clients is more valuable than another Squarespace site. It also creates a public artifact that drives SEO and referral traffic back to the professional.

**Technical:**
- New dynamic route `/p/[slug]` — public, no auth required
- Page pulls from: `ProfessionalIdentity`, featured videos, `BrandKit` (colors, logo)
- Customizable sections: hero video, video grid, about section, testimonials, CTA
- Optional CNAME support for custom domains
- Schema markup for professional services (LocalBusiness, Attorney, RealEstateAgent)
- Analytics: page views, video plays, CTA clicks — all feeding into Outcome Dashboard

**Success metric:** 50%+ of professionals activate their portfolio page. 10%+ of client intake originates from the page.

---

### Feature 19: Diagnostic Engagement Flow (Pilot)

**What:** The $500–$1,500 paid diagnostic offering described in the Blue Ocean strategy. Not a SaaS trial. A done-for-you professional identity audit: how they currently show up on video, what their clients need to see, and a flagship video delivered to broadcast standard.

**Why:** This is the market test. Before scaling PLG, we need proof that professionals will pay a premium for authority infrastructure. The diagnostic engagement is the vehicle. It also generates case studies and testimonials for scaling.

**Technical:**
- New route `/diagnostic` — landing page with intake form
- Stripe one-time payment ($500/$1,000/$1,500 tiers)
- Admin queue for diagnostic engagements
- Deliverables: identity audit document (PDF), flagship video, 30-day content plan, Authority Score baseline
- API: `POST /api/diagnostic/intake`, `GET /api/diagnostic/[id]/status`
- Internal tooling: admin view to manage diagnostic pipeline

**Success metric:** 8–12 paid diagnostics in first 30 days. 80%+ convert to monthly subscription.

---

### Feature 20: Professional Network Effects

**What:** A private directory of professionals using Official AI, visible only to other users. Not a social network. A credibility signal: "247 attorneys use Official AI for their digital presence." With opt-in case studies showing real outcome data.

**Why:** Professional buyer segments make decisions based on peer validation. "My colleague uses it and got results" is worth more than any marketing page. The directory creates a network effect: each new professional makes the platform more credible for the next one.

**Technical:**
- New `/directory` page — public listing of opt-in professionals
- Profile cards: name, title, industry, city, Authority Score badge, featured video thumbnail
- Filtering by industry, geography, specialty
- Opt-in toggle in Settings (default: off, prompted after Authority Score reaches threshold)
- Case study template: professional provides permission, system auto-generates a results summary from their outcome data
- API: `GET /api/directory`, `PATCH /api/profile/directory-listing`

**Success metric:** 30%+ opt-in rate among professionals with Authority Score >70. Directory referenced in 50%+ of sales conversations.

---

## Implementation Priority Matrix

| # | Feature | Phase | Effort | Impact | Dependencies |
|---|---------|-------|--------|--------|-------------|
| 1 | Professional Identity Intake | 1 | L | Critical | None |
| 2 | Authority Script Engine | 1 | M | Critical | Feature 1 |
| 3 | Persona Consistency Engine | 1 | L | High | Feature 1 |
| 4 | Credibility Gate | 1 | M | Critical | None |
| 5 | V2 Onboarding Refinements | 1 | S | High | ElevenLabs key |
| 6 | Outcome Dashboard | 1 | M | Critical | None |
| 7 | Flagship Video Production | 2 | M | Critical | Feature 1, 2 |
| 8 | Identity-Driven Calendar | 2 | S | High | Feature 1 |
| 9 | Authority Publishing | 2 | M | High | PostBridge key |
| 10 | Voice Training Studio | 2 | M | Medium | ElevenLabs key |
| 11 | Referral Attribution | 2 | M | High | Feature 6 |
| 12 | Professional Context Feed | 2 | L | High | Feature 1 |
| 13 | Client Intake Integration | 3 | L | Critical | Feature 6 |
| 14 | Authority Score | 3 | M | High | Features 3, 4, 6 |
| 15 | Content Atomization | 3 | M | High | Feature 2 |
| 16 | Competitive Positioning Monitor | 3 | L | Medium | Feature 1 |
| 17 | Notification & Nudge System | 3 | M | High | Feature 14 |
| 18 | White-Label Video Pages | 3 | M | High | Feature 1 |
| 19 | Diagnostic Engagement (Pilot) | 3 | M | Critical | Features 1, 7 |
| 20 | Professional Network Effects | 3 | S | Medium | Feature 14 |

**Effort:** S = <1 week, M = 1–2 weeks, L = 2–4 weeks

---

## What This PRD Does NOT Include

- **Template libraries.** Eliminated. Every competitor leads with templates. We lead with identity.
- **Render speed as a feature.** Deprioritized. Professionals building authority are not in a hurry.
- **Language/accent packs.** Red ocean feature. Not in scope.
- **Free tier / PLG motion.** Not until the diagnostic pilot validates the authority positioning.
- **Avatar realism marketing.** Realism is table stakes. We don't market it. We market outcomes.

---

## The Test

If a trial lawyer looks at Official AI and thinks "this is HeyGen for lawyers," we have failed. If they think "this is the team that builds my digital presence and tracks whether it's working," we have found the ocean.
