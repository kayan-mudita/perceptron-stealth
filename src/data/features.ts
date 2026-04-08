import {
  Camera,
  Film,
  ScanFace,
  Mic,
  Wand2,
  PenTool,
  Send,
  CalendarDays,
  BarChart3,
  TrendingUp,
  MonitorPlay,
  Layers,
  Sparkles,
  Globe,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

export type FeatureAccent = "utility" | "special" | "mix";

export interface FeatureCapability {
  icon: LucideIcon;
  label: string;
  text: string;
}

export interface FeatureHowItWorks {
  num: string;
  label: string;
  text: string;
}

export interface Feature {
  slug: string;
  /** Short label used in the navbar + portal cards. */
  shortLabel: string;
  /** Long marketing title for the feature page hero. */
  title: string;
  /** Sub-headline shown on the portal cards + the feature page hero. */
  subtitle: string;
  /** One-paragraph description shown on the portal hero card + feature page intro. */
  description: string;
  /** Icon shown on the portal card + feature page hero. */
  icon: LucideIcon;
  /** Brand accent token. */
  accent: FeatureAccent;
  /** Stat chip shown on the portal card. */
  pillStat: string;
  /** 3 short bullets shown on the portal card. */
  highlights: string[];
  /** Capabilities listed on the feature page. */
  capabilities: FeatureCapability[];
  /** Mini "how it works" steps on the feature page. */
  howItWorks: FeatureHowItWorks[];
  /** Slugs of related features. */
  related: string[];
}

export const features: Feature[] = [
  {
    slug: "ai-video-studio",
    shortLabel: "AI Video Studio",
    title: "AI Video Studio",
    subtitle: "Multi-cut composition with real editing",
    description:
      "Every video is 3-8 separate clips stitched with hooks, transitions, B-roll, and CTAs — directed like a real production, not a one-shot AI prompt. This is the engine that makes the difference.",
    icon: Film,
    accent: "utility",
    pillStat: "3-8 cuts / video",
    highlights: [
      "3-8 cuts per video, professionally stitched",
      "Hook → body → CTA structure baked in",
      "Multiple AI models routed per shot type",
    ],
    capabilities: [
      {
        icon: Layers,
        label: "Multi-model routing",
        text: "Kling 2.6, Seedance 2.0, and Sora 2 — the best model picked automatically for each shot type.",
      },
      {
        icon: MonitorPlay,
        label: "Starting frames",
        text: "Every cut begins from a composed frame — specific angle, expression, and body position. Real directorial intent.",
      },
      {
        icon: Film,
        label: "Real editing pipeline",
        text: "Hook, B-roll, talking head, CTA — structured like a real production with proper pacing and transitions.",
      },
      {
        icon: Sparkles,
        label: "Format-aware composition",
        text: "Market updates pace differently than quick tips. The Studio knows the rules of each format.",
      },
    ],
    howItWorks: [
      { num: "01", label: "Pick a format", text: "Market update, quick tip, story, testimonial, or hook." },
      { num: "02", label: "Studio composes", text: "3-8 cuts planned, modeled, and stitched automatically." },
      { num: "03", label: "Review and approve", text: "Every cut visible before publish — full directorial control." },
    ],
    related: ["ai-twin-voice", "script-engine"],
  },
  {
    slug: "ai-twin-voice",
    shortLabel: "AI Twin & Voice",
    title: "AI Twin & Voice",
    subtitle: "Your face, your voice, every video",
    description:
      "Three photos and a 30-second voice sample is all the AI needs to build a digital twin that maintains your likeness from every angle and speaks with your exact cadence. No uncanny valley. No generic avatars.",
    icon: ScanFace,
    accent: "special",
    pillStat: "3 photos + 30s audio",
    highlights: [
      "360-degree likeness consistency",
      "Voice cloned from a 30-second sample",
      "Natural expression and gesture mapping",
    ],
    capabilities: [
      {
        icon: ScanFace,
        label: "Character sheets",
        text: "Detailed facial geometry, skin tone, hair, and distinguishing features captured from three photos.",
      },
      {
        icon: Camera,
        label: "360° consistency",
        text: "Perfect likeness whether the camera is head-on, in profile, or anywhere in between.",
      },
      {
        icon: Mic,
        label: "Voice cloning",
        text: "30 seconds of audio is enough to clone your tone, cadence, and emphasis. Multi-language supported.",
      },
      {
        icon: Sparkles,
        label: "Expression mapping",
        text: "How you smile, how you talk, how you emphasize a point — captured and reproduced naturally.",
      },
    ],
    howItWorks: [
      { num: "01", label: "Upload 3 photos", text: "Front-facing, slight angle, profile. That is all." },
      { num: "02", label: "Record voice sample", text: "30 seconds of clear speech — phone audio is fine." },
      { num: "03", label: "Twin is ready", text: "Used automatically in every video you generate from now on." },
    ],
    related: ["ai-video-studio", "script-engine"],
  },
  {
    slug: "script-engine",
    shortLabel: "Script Engine",
    title: "Script Engine",
    subtitle: "Proven hooks, formats, and frameworks",
    description:
      "Scripts written by AI using frameworks from top creators — proven hooks, story arcs, and CTAs. Or write your own and the engine handles the formatting, pacing, and structure for the chosen format.",
    icon: PenTool,
    accent: "special",
    pillStat: "5+ formats",
    highlights: [
      "5+ proven content formats built in",
      "100+ hook templates with variations",
      "Format-first — structure drives the script",
    ],
    capabilities: [
      {
        icon: Wand2,
        label: "Format library",
        text: "Market update, quick tip, story-time, testimonial, myth-bust — each with its own pacing and structure.",
      },
      {
        icon: PenTool,
        label: "Hook generator",
        text: "100+ proven first-line patterns. The engine picks the strongest one for the topic and tone.",
      },
      {
        icon: Sparkles,
        label: "Format-first writing",
        text: "Scripts adapt to the format, not the other way around. A market update writes differently than a hook.",
      },
      {
        icon: CheckCircle,
        label: "Bring your own script",
        text: "Already have copy? Drop it in. The engine handles structure, pacing, and shot planning.",
      },
    ],
    howItWorks: [
      { num: "01", label: "Pick a topic", text: "Or pull from your trending intelligence feed." },
      { num: "02", label: "Engine drafts", text: "Hook, body, and CTA — formatted for your chosen content type." },
      { num: "03", label: "Edit and approve", text: "Tweak any line, then send to the Studio for filming." },
    ],
    related: ["ai-video-studio", "ai-twin-voice"],
  },
  {
    slug: "auto-posting",
    shortLabel: "Auto-Posting",
    title: "Auto-Posting",
    subtitle: "One approval, every platform",
    description:
      "Connect your accounts once. Every approved video auto-posts to Instagram Reels, TikTok, LinkedIn, YouTube Shorts, and Facebook — each version optimized for that platform's format, captions, and aspect ratio.",
    icon: Send,
    accent: "mix",
    pillStat: "5 platforms",
    highlights: [
      "5 platforms from a single approval",
      "Visual content calendar with drag-and-drop",
      "Smart scheduling based on audience activity",
    ],
    capabilities: [
      {
        icon: Send,
        label: "Cross-platform publishing",
        text: "IG Reels, TikTok, LinkedIn, YouTube Shorts, Facebook — each version tailored to the platform.",
      },
      {
        icon: CalendarDays,
        label: "Content calendar",
        text: "Drag-and-drop visual scheduling across every platform from one unified timeline.",
      },
      {
        icon: Sparkles,
        label: "Smart scheduling",
        text: "AI suggests optimal posting times based on when your audience is most active on each platform.",
      },
      {
        icon: Globe,
        label: "Platform-native formats",
        text: "Aspect ratios, captions, and durations re-formatted automatically for each destination.",
      },
    ],
    howItWorks: [
      { num: "01", label: "Connect accounts", text: "One-time OAuth for every platform you publish to." },
      { num: "02", label: "Approve once", text: "Single approval queues the video for every connected platform." },
      { num: "03", label: "Auto-publish", text: "Each platform gets its own optimized version on schedule." },
    ],
    related: ["analytics", "ai-video-studio"],
  },
  {
    slug: "analytics",
    shortLabel: "Analytics",
    title: "Analytics",
    subtitle: "Know what works across every platform",
    description:
      "Track views, engagement, followers gained, and content performance across every platform in one unified dashboard. See cost-per-lead, ROI, and which formats drive real business — not just likes.",
    icon: BarChart3,
    accent: "utility",
    pillStat: "Unified dashboard",
    highlights: [
      "Unified metrics across all 5 platforms",
      "ROI and cost-per-lead attribution",
      "Format-level performance breakdown",
    ],
    capabilities: [
      {
        icon: BarChart3,
        label: "Unified dashboard",
        text: "Views, engagement, follower growth, and shares from every platform — in one place.",
      },
      {
        icon: TrendingUp,
        label: "ROI attribution",
        text: "Connect content to leads and revenue. Know exactly which videos drive business.",
      },
      {
        icon: Sparkles,
        label: "Format performance",
        text: "Which formats convert best for your audience? The dashboard tells you what to make more of.",
      },
      {
        icon: CheckCircle,
        label: "Audience insights",
        text: "When your audience is active, what they engage with, and where they convert.",
      },
    ],
    howItWorks: [
      { num: "01", label: "Connect once", text: "Same OAuth as Auto-Posting — no extra setup." },
      { num: "02", label: "Data syncs nightly", text: "Every metric refreshed automatically across platforms." },
      { num: "03", label: "Read the dashboard", text: "One unified view tells you what to double down on." },
    ],
    related: ["auto-posting", "ai-video-studio"],
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}

export function getRelatedFeatures(slug: string): Feature[] {
  const f = getFeatureBySlug(slug);
  if (!f) return [];
  return f.related
    .map(getFeatureBySlug)
    .filter((x): x is Feature => Boolean(x));
}
