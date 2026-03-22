"use client";

import Link from "next/link";
import {
  Camera,
  Sparkles,
  Send,
  ArrowRight,
  Image,
  Layers,
  Film,
  Mic,
  MonitorPlay,
  CalendarCheck,
  CheckCircle,
  ScanFace,
} from "lucide-react";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import CTASection from "@/components/marketing/CTASection";

const steps = [
  {
    num: "01",
    icon: Camera,
    title: "Upload 3 photos",
    subtitle: "AI builds your digital twin",
    accent: "blue",
    description:
      "Take three photos from your phone — front-facing, slight angle, and profile. That is all the AI needs to build a complete digital representation of you.",
    details: [
      {
        icon: ScanFace,
        label: "Character sheets",
        text: "The AI generates detailed character sheets that capture your facial structure, skin tone, hair, and distinguishing features from every angle.",
      },
      {
        icon: Image,
        label: "360-degree consistency",
        text: "Your digital twin maintains perfect likeness whether the camera is head-on, in profile, or at any angle between. No uncanny valley.",
      },
      {
        icon: Layers,
        label: "Expression mapping",
        text: "The model captures your natural expressions — how you smile, how you talk, how you emphasize a point. It looks like you because it learned from you.",
      },
    ],
  },
  {
    num: "02",
    icon: Sparkles,
    title: "Choose a format",
    subtitle: "AI creates multi-cut video with real editing",
    accent: "violet",
    description:
      "Pick from proven content formats — market update, quick tip, story-based, testimonial highlight, or let the AI recommend what works for your industry.",
    details: [
      {
        icon: Film,
        label: "Multi-cut composition",
        text: "Every video is 3-8 separate clips stitched together with hooks, transitions, B-roll, and CTAs. This is real video editing, not one-shot AI output.",
      },
      {
        icon: MonitorPlay,
        label: "Starting frames",
        text: "Each cut begins from a carefully composed starting frame — specific camera angle, expression, and body position. This is how real directors plan shots.",
      },
      {
        icon: Mic,
        label: "Format-first approach",
        text: "The content format dictates the video structure, not the other way around. A market update has different pacing than a quick tip. The AI knows the difference.",
      },
    ],
  },
  {
    num: "03",
    icon: Send,
    title: "Approve and auto-post",
    subtitle: "Scheduled publishing to all platforms",
    accent: "emerald",
    description:
      "Every video lands in your approval queue. Review it, request changes, or approve it. Once approved, it auto-posts to every platform on your schedule.",
    details: [
      {
        icon: CheckCircle,
        label: "Approval queue",
        text: "Nothing goes live without your sign-off. Preview every video, check the script, and approve or request revisions. You always have final say.",
      },
      {
        icon: CalendarCheck,
        label: "Smart scheduling",
        text: "The AI analyzes when your audience is most active on each platform and suggests optimal posting times. Or set your own schedule.",
      },
      {
        icon: Send,
        label: "Cross-platform publishing",
        text: "One approval publishes to Instagram Reels, TikTok, LinkedIn, YouTube Shorts, and Facebook. Each version is optimized for that platform's format.",
      },
    ],
  },
];

const accentColors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  blue: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/[0.06]",
    text: "text-blue-400",
    glow: "bg-blue-500/[0.04]",
  },
  violet: {
    border: "border-violet-500/20",
    bg: "bg-violet-500/[0.06]",
    text: "text-violet-400",
    glow: "bg-violet-500/[0.04]",
  },
  emerald: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/[0.06]",
    text: "text-emerald-400",
    glow: "bg-emerald-500/[0.04]",
  },
};

export default function HowItWorksClient() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/3 w-[300px] h-[300px] bg-violet-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-4">
            How it works
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-6">
            Three steps to
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              content autopilot.
            </span>
          </h1>
          <p className="text-[17px] text-white/35 max-w-xl mx-auto leading-relaxed font-light">
            Upload your photos. Pick a format. The AI does the rest — writing,
            filming, editing, and publishing. Here is exactly how each step works.
          </p>
        </div>
      </section>

      {/* Steps */}
      {steps.map((step, index) => {
        const colors = accentColors[step.accent];
        return (
          <section
            key={step.num}
            className={`py-24 px-6 ${index > 0 ? "border-t border-white/[0.04]" : ""}`}
          >
            <div className="max-w-5xl mx-auto">
              {/* Step header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5">
                  <div className="sticky top-24">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}
                      >
                        <step.icon className={`w-4.5 h-4.5 ${colors.text}`} />
                      </div>
                      <span className="text-[12px] text-white/20 font-mono">
                        Step {step.num}
                      </span>
                    </div>

                    <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-white leading-tight mb-3">
                      {step.title}
                    </h2>
                    <p className={`text-[15px] ${colors.text} mb-4`}>
                      {step.subtitle}
                    </p>
                    <p className="text-[15px] text-white/30 leading-relaxed">
                      {step.description}
                    </p>

                    {index < steps.length - 1 && (
                      <div className="hidden lg:block mt-8">
                        <div className="w-px h-16 bg-gradient-to-b from-white/[0.06] to-transparent ml-5" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="space-y-4">
                    {step.details.map((detail, i) => (
                      <div
                        key={i}
                        className="group relative p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] hover:bg-white/[0.025] transition-all duration-300"
                      >
                        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent`} />
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-white/[0.1] transition-colors">
                            <detail.icon className="w-4 h-4 text-white/30" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-medium text-white/80 mb-1.5">
                              {detail.label}
                            </h3>
                            <p className="text-[13px] text-white/25 leading-relaxed">
                              {detail.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Tech advantage section */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
              The difference
            </p>
            <h2 className="text-[36px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
              Why this looks real
              <br />
              <span className="text-white/40">and others look like AI.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Multi-cut vs. one-shot",
                ours: "3-8 separate clips stitched with professional editing, transitions, and pacing",
                theirs: "Single continuous AI generation that screams artificial",
              },
              {
                title: "Character sheets vs. face swap",
                ours: "Detailed character model trained from your photos with 360-degree consistency",
                theirs: "Basic face swap that breaks on angles and lighting changes",
              },
              {
                title: "Format-first vs. prompt-first",
                ours: "Content format drives video structure, pacing, and editing decisions",
                theirs: "Generic prompt-to-video with no understanding of content strategy",
              },
              {
                title: "Starting frames vs. random generation",
                ours: "Each shot starts from a composed frame — specific angle, expression, position",
                theirs: "Random generation with no directorial intent or visual planning",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015] hover:border-white/[0.08] transition-all duration-300"
              >
                <h3 className="text-[16px] font-semibold text-white/90 mb-4">
                  {item.title}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[13px] text-white/50 leading-relaxed">
                      {item.ours}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    </div>
                    <p className="text-[13px] text-white/20 leading-relaxed">
                      {item.theirs}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-[13px] text-blue-400/70 hover:text-blue-400 transition-colors"
            >
              Explore all features
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        heading="See it in action."
        description="Upload your photos and get your first AI video in under five minutes. No filming required."
        badge="Setup takes less than 5 minutes"
      />
    </MarketingLayout>
  );
}
