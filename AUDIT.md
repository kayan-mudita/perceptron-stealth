# Perceptron Stealth ("Official AI") — Codebase Audit
**Date:** March 30, 2026
**Stack:** Next.js, TypeScript, Tailwind, Prisma, Stripe, Kling 2.6/Seedance 2.0 APIs

## What It Is
AI-powered video generation platform for businesses. Users describe what they want, upload photos/voice samples, and the AI creates marketing videos. Industries: Real Estate, Legal, Medical, Creator.

## Core User Journey
1. Sign Up/Login → 2. Onboarding (industry, brand, voice, photos) → 3. AI Video Creation → 4. Review & Approve → 5. Schedule & Publish

## Feature Status Map

### ✅ Backend Wired (API + DB)
- **Auth**: Email/password, email verification, password reset, JWT sessions
- **Onboarding**: Industry selection, brand setup, voice & photo upload
- **Schedule CRUD**: Full API for content scheduling
- **Stripe Payments**: Checkout, webhook, subscription management
- **User Profile**: Brand kit, character sheet, photos

### 🟡 UI Complete, Mock Data (NOT WIRED)
- **AI Video Generation**: Core product — UI exists with chat interface, industry templates, Google Review import. BUT: uses `setTimeout` simulations, not real API calls to Kling/Seedance
- **Content Library**: Grid/list view with filters — renders 8 hardcoded demo videos instead of fetching from API
- **Approval Workflow**: Carousel review with approve/reject/changes — buttons have no API calls
- **Smart Calendar**: Month view with AI suggestions — uses hardcoded data, not real schedules
- **Analytics Dashboard**: Views, engagement, ROI — all mock data, no real tracking
- **Social Publishing**: Connect accounts, publish — UI only, no platform APIs

### 🔴 Stub / Not Built
- **AI Suggestion Engine**: No LLM integration for content suggestions
- **Social Platform Connectors**: No real Instagram/TikTok/LinkedIn/YouTube APIs
- **Real-time Video Processing**: Pipeline exists but not connected to Kling/Seedance
- **Usage Tracking**: Limits defined but not enforced
- **Referral System**: Route exists, logic is stub
- **Weekly Digest Email**: Route exists, no implementation

## Priority Fixes (This Week)

### P0 — Wire the Core Product
1. **Connect video generation to real AI APIs** — replace setTimeout with Kling 2.6/Seedance calls
2. **Wire Content Library to API** — replace demoVideos[] with fetch('/api/videos')
3. **Wire Approval actions to API** — PATCH video status on approve/reject
4. **Wire Calendar to real schedules** — fetch from Schedule API instead of hardcoded data

### P1 — Complete the Loop
5. **Connect analytics to real data** — track views, engagement from social platforms
6. **Implement social publishing** — at minimum Instagram + TikTok APIs
7. **Wire AI suggestions** — LLM-powered content calendar recommendations
8. **Enforce usage limits** — check tier limits before generation

### P2 — Polish
9. **Referral system** — complete the implementation
10. **Weekly digest emails** — implement with Resend
11. **Export functionality** — download videos, analytics reports
12. **Mobile responsive audit** — ensure all pages work on mobile

## Technical Architecture
- 3 layers: Pages (UI) → API Routes (orchestration) → Prisma (data)
- 7 data workflows identified, all partially connected
- The biggest gap: the entire product loop (generate → review → publish) runs on mock data
- Backend APIs are mostly built — the work is wiring frontend to backend
