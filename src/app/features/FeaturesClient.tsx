"use client";

import Link from "next/link";
import {
  ArrowRight,
  ScanFace,
  Film,
  Mic,
  Send,
  CalendarDays,
  BarChart3,
  Settings2,
  FolderLock,
  Layers,
  MonitorPlay,
  PenTool,
  Globe,
} from "lucide-react";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import CTASection from "@/components/marketing/CTASection";

const primaryFeatures = [
  {
    icon: ScanFace,
    title: "AI Digital Twin",
    description:
      "Upload three photos. The AI generates detailed character sheets and a 360-degree model that maintains your likeness from every angle — front, profile, three-quarter. No uncanny valley. No generic avatars.",
    details: [
      "Character sheet generation from 3 photos",
      "Consistent likeness across all camera angles",
      "Natural expression and gesture mapping",
      "Automatic lighting and skin tone adaptation",
    ],
    accent: "from-blue-500/20 to-blue-500/0",
  },
  {
    icon: Film,
    title: "Multi-Cut Video Composition",
    description:
      "Every video is 3-8 separate clips stitched together with hooks, transitions, B-roll, and CTAs. Real video editing, not one-shot AI generation. This is why our videos look like they were professionally produced.",
    details: [
      "3-8 cuts per video with professional transitions",
      "Hook-body-CTA structure in every video",
      "Starting frame composition for each shot",
      "Format-first approach drives editing decisions",
    ],
    accent: "from-violet-500/20 to-violet-500/0",
  },
  {
    icon: Mic,
    title: "Voice Cloning",
    description:
      "Record a 30-second voice sample. The AI clones your voice, your tone, your cadence. Every video sounds like you recorded it yourself. Supports multiple languages and natural inflection.",
    details: [
      "Clone your voice from a 30-second sample",
      "Natural cadence and emphasis preservation",
      "Tone adaptation for different content types",
      "Multi-language support",
    ],
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
];

const secondaryFeatures = [
  {
    icon: Send,
    title: "Auto-Posting",
    description:
      "Connect your accounts once. Every approved video auto-posts to Instagram Reels, TikTok, LinkedIn, YouTube Shorts, and Facebook — each optimized for that platform.",
    link: { label: "See pricing for platform limits", href: "/pricing" },
  },
  {
    icon: CalendarDays,
    title: "Content Calendar",
    description:
      "Visual scheduling across all platforms. Drag and drop to rearrange. The AI suggests optimal posting times based on your audience activity patterns.",
    link: null,
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track views, engagement, followers gained, and content performance across every platform in one unified dashboard. Know what works.",
    link: null,
  },
  {
    icon: Settings2,
    title: "Admin Controls",
    description:
      "Swap between AI video models. Edit prompts and scripts before generation. Fine-tune your digital twin. Full control over every aspect of content creation.",
    link: null,
  },
  {
    icon: FolderLock,
    title: "Brand Vault",
    description:
      "Store your photos, voice samples, brand colors, logos, and style preferences in one secure location. The AI references your vault for every piece of content.",
    link: null,
  },
  {
    icon: PenTool,
    title: "Smart Scripts",
    description:
      "AI writes scripts using frameworks from top creators — proven hooks, story arcs, and CTAs. Or write your own and the AI handles the rest.",
    link: null,
  },
];

const technicalFeatures = [
  {
    icon: Layers,
    label: "Multiple AI models",
    text: "Kling 2.6, Seedance 2.0, and Sora 2 — the best model for each shot type",
  },
  {
    icon: MonitorPlay,
    label: "Starting frame composition",
    text: "Every shot begins from a composed frame with specific angle, expression, and position",
  },
  {
    icon: Globe,
    label: "Platform-native formats",
    text: "Each video is reformatted for its destination — aspect ratio, duration, captions",
  },
  {
    icon: Film,
    label: "Real editing pipeline",
    text: "Hook, B-roll, talking head, CTA — structured like a real production, not a single prompt",
  },
];

export default function FeaturesClient() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/4 w-[300px] h-[300px] bg-violet-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-4">
            Features
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-6">
            Everything you need.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Nothing you don&apos;t.
            </span>
          </h1>
          <p className="text-[17px] text-white/35 max-w-xl mx-auto leading-relaxed font-light">
            A complete content production system — from AI video generation to
            cross-platform publishing — built for professionals who need to post
            but never have time to film.
          </p>
        </div>
      </section>

      {/* Primary features — deep dive cards */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {primaryFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] hover:bg-white/[0.025] transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${feature.accent}`}
              />
              <div className="p-8 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-white/[0.1] transition-colors">
                        <feature.icon className="w-4.5 h-4.5 text-white/40" />
                      </div>
                      <h2 className="text-[20px] font-semibold text-white/90">
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-[15px] text-white/30 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="lg:col-span-5">
                    <ul className="space-y-3">
                      {feature.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-[13px] text-white/40"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Secondary features — grid */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
              Platform
            </p>
            <h2 className="text-[36px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
              Publish, schedule,
              <br />
              <span className="text-white/40">and measure everything.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {secondaryFeatures.map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] hover:bg-white/[0.025] transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-white/[0.1] transition-colors">
                  <feature.icon className="w-4 h-4 text-white/30" />
                </div>
                <h3 className="text-[15px] font-semibold text-white/80 mb-2">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-white/25 leading-relaxed mb-3">
                  {feature.description}
                </p>
                {feature.link && (
                  <Link
                    href={feature.link.href}
                    className="text-[12px] text-blue-400/60 hover:text-blue-400 transition-colors"
                  >
                    {feature.link.label} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical details strip */}
      <section className="py-16 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-8">
            Under the hood
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon className="w-4 h-4 text-white/20 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[13px] font-medium text-white/60 mb-1">
                    {item.label}
                  </h4>
                  <p className="text-[12px] text-white/20 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link to pricing */}
      <section className="py-16 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[15px] text-white/30 mb-4">
            All features are available on every plan. The difference is volume.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-[14px] text-blue-400/70 hover:text-blue-400 transition-colors font-medium"
          >
            View pricing
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <CTASection
        heading="Start creating today."
        description="Every feature. No credit card. Your first video in under five minutes."
        badge="All features included in every plan"
      />
    </MarketingLayout>
  );
}
