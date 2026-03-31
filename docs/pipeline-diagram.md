# Official AI — Pipeline Architecture

_Last updated: March 2026_

---

## Onboarding Flow (V2)

```mermaid
flowchart TD
    A([User visits /auth/onboarding]) --> B[Step 1: Photo Capture]
    B --> B1{Camera or Upload?}
    B1 -- Camera --> B2[MediaDevices.getUserMedia\nWebcam stream + canvas snap]
    B1 -- Upload --> B3[File input\nimage/*, max 10MB]
    B2 --> BQ[analyzePhotoQuality\nmin 300×300px, min 50KB]
    B3 --> BQ
    BQ -- Fail --> B4[Show quality warning\nretake / try again]
    B4 --> B1
    BQ -- Pass --> BP[POST /api/upload\nPOST /api/photos]
    BP --> BE[Track: onboarding_photo_captured]
    BE --> C[Step 2: Character Sheet Reveal]

    C --> C1[POST /api/character-sheet\npayload: photoUrls + industry]
    C1 --> C2[Gemini Flash\nGenerates 3×3 pose grid\n+ 2×3 360° sheet in parallel]
    C2 -- ~4-10s --> C3[Cinematic reveal\nConfetti burst + spring animation]
    C3 --> C4[User selects a pose]
    C4 --> CE[Track: onboarding_character_selected]
    CE --> D[Step 3: Paywall]

    D --> DE[Track: onboarding_paywall_viewed]
    D --> D1{User action}
    D1 -- Start free trial --> DT[Track: onboarding_trial_started\nPOST /api/stripe/checkout]
    DT --> DS[Stripe Checkout]
    DS -- Success --> DF[POST /api/onboarding/complete\n→ /dashboard]
    D1 -- Skip --> DSK[Track: onboarding_skipped\nPOST /api/onboarding/complete\n→ /dashboard]
```

---

## Video Generation Pipeline

The pipeline is split into two HTTP calls to work around serverless timeouts:
- **POST /api/generate** — Fast (< 500ms): creates DB record, returns video ID
- **POST /api/generate/process** — Called repeatedly by the frontend, one step at a time

```mermaid
flowchart TD
    START([POST /api/generate]) --> GEN1[Validate auth + plan limits\nRate limit: 10 req/user]
    GEN1 --> GEN2[planComposition\nFormat lookup → cut list]
    GEN2 --> GEN3[prisma.video.create\nstatus: generating]
    GEN3 --> GEN4([Return: videoId + composition plan])

    GEN4 --> FE[Frontend calls\nPOST /api/generate/process\nstep by step]

    FE --> S1

    subgraph PIPELINE [Pipeline Steps — POST /api/generate/process]
        S1["step: expand\nGemini Flash\nScript → scene-by-scene breakdown\n+ hook variation + b-roll notes"]
        S1 --> S2["step: tts\nElevenLabs / FAL TTS\nAudio per cut → uploaded to storage\nReturns: audioDuration[]"]
        S2 --> S3["step: anchor\nBuild shot context per cut\nPhoto analysis + voice context\n+ scene bible + shot variety"]
        S3 --> S4["step: submit_all_cuts\nFAL API (Kling 2.6)\nSubmit all cuts in parallel\nReturns: FAL request IDs"]
        S4 --> S5["step: poll_all_cuts\nPoll FAL for each cut\nContinues until all cuts done\nor max 20 retries per cut"]
        S5 -- Still pending --> S5
        S5 -- All done --> S6["step: stitch\nShotstack\nSubmit: cuts + audio + timing\nReturns: Shotstack render ID"]
        S6 --> S7["step: poll_stitch\nPoll Shotstack\nContinues until render complete"]
        S7 -- Still pending --> S7
        S7 -- Done --> DONE
    end

    DONE[prisma.video.update\nstatus: complete\nthumbnailUrl + videoUrl saved]
    DONE --> END([Video available in Content Library])

    subgraph ERRORS [Error Handling]
        direction LR
        E1[Any step throws\n→ video.status = failed\nerror saved to sourceReview JSON]
        E2[POST /api/generate/retry\nResumes from last successful step]
        E3[POST /api/admin/reset-stuck\nResets videos stuck > 15 min\nback to failed for retry]
    end
```

---

## Character Sheet Generation

```mermaid
flowchart TD
    CS([POST /api/character-sheet]) --> CS1[Validate auth\nGet user photo URLs]
    CS1 --> CS2[Gemini Flash\n2 parallel generations]

    subgraph PARALLEL [Parallel Gemini calls]
        P1["Pose sheet\n3×3 grid\n9 professional poses\nincl. industry-specific looks"]
        P2["360° sheet\n2×3 grid\n6 rotation angles\nfor AI video anchor shots"]
    end

    CS2 --> PARALLEL
    PARALLEL --> CS3[Upload composite images\nto Supabase storage]
    CS3 --> CS4[prisma.characterSheet.create\ntype: poses + type: 3d_360]
    CS4 --> CS5([Return: compositeUrl + sheetId])
```

---

## API Surface Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/generate` | POST | Create video record + composition plan |
| `/api/generate/process` | POST | Run one pipeline step |
| `/api/generate/status` | GET | Current video status + step |
| `/api/generate/retry` | POST | Retry from last failed step |
| `/api/generate/advance` | POST | Force-advance to next step (admin) |
| `/api/generate/batch` | POST | Queue multiple videos |
| `/api/character-sheet` | POST | Generate character sheet |
| `/api/character-sheet` | GET | Get all character sheets for user |
| `/api/photos` | GET/POST | List / upload photos |
| `/api/photos/[id]` | DELETE | Delete a photo |
| `/api/voices` | GET/POST | List / upload voice samples |
| `/api/admin/reset-stuck` | GET/POST | Count / reset stuck generating videos |
| `/api/admin/pipeline-log` | GET | Pipeline event timeline for a video |
| `/api/events` | POST | Track lifecycle + onboarding funnel events |

---

## Onboarding Funnel Events

Tracked via `POST /api/events` → stored in `LifecycleEvent` table:

| Event | Fires When | Unique? |
|-------|-----------|---------|
| `onboarding_photo_captured` | Photo passes quality check + uploads | Yes (once) |
| `onboarding_character_selected` | User taps a pose | Yes (once) |
| `onboarding_paywall_viewed` | Paywall step mounts | Yes (once) |
| `onboarding_trial_started` | User clicks "Start free trial" | Yes (once) |
| `onboarding_skipped` | User clicks "Skip for now" | Yes (once) |

Drop-off rate = users who reach each event / users who started onboarding.
