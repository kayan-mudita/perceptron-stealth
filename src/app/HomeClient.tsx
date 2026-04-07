"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Zap, Camera, Sparkles, Send, Play, Star, Quote } from "lucide-react";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import FadeIn from "@/components/motion/FadeIn";

const demoVideos = [
  {
    id: "attorney",
    label: "Attorney",
    title: "Watch AI create a video",
    subtitle: "in 30 seconds",
    duration: "0:30",
    gradient: "from-blue-900/20 via-[#0a0e17] to-violet-900/20",
  },
  {
    id: "doctor",
    label: "Doctor",
    title: "Watch AI explain a procedure",
    subtitle: "in 45 seconds",
    duration: "0:45",
    gradient: "from-emerald-900/20 via-[#0a0e17] to-blue-900/20",
  },
  {
    id: "realtor",
    label: "Realtor",
    title: "Watch AI tour a listing",
    subtitle: "in 60 seconds",
    duration: "1:00",
    gradient: "from-amber-900/20 via-[#0a0e17] to-rose-900/20",
  },
  {
    id: "advisor",
    label: "Advisor",
    title: "Watch AI break down a market move",
    subtitle: "in 30 seconds",
    duration: "0:30",
    gradient: "from-violet-900/20 via-[#0a0e17] to-fuchsia-900/20",
  },
];

const testimonials = [
  {
    name: "Marcus Rivera",
    title: "Managing Partner",
    industry: "Personal Injury Law",
    quote:
      "We were spending $4,000 a month on a videographer who delivered four videos. Official AI gives us 30 for a fraction of the cost and they actually look like me on camera.",
  },
  {
    name: "Dr. Priya Patel",
    title: "Board-Certified Dermatologist",
    industry: "Medical",
    quote:
      "My patients constantly tell me they watched my videos before booking. I review the scripts for accuracy, approve them, and they post automatically. It takes me 20 minutes a week.",
  },
  {
    name: "Sarah Mitchell",
    title: "Broker / Owner",
    industry: "Real Estate",
    quote:
      "I went from posting once a month to five times a week. My DMs are full of people saying they see me everywhere. Three new listings came from social this quarter alone.",
  },
];

export default function HomeClient() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % demoVideos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = demoVideos[activeVideo];

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Subtle gradient orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
        </div>

        {/* Radial gradient glow behind the hero headline */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,110,245,0.12)_0%,rgba(124,58,237,0.06)_40%,transparent_70%)]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn delay={0} duration={0.6}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-p3 text-white/40 font-medium">
                Now in beta
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} duration={0.7}>
            <h1 className="text-h1 sm:text-h0 font-bold tracking-[-0.03em] leading-[1.05] text-white mb-6">
              Your AI twin.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                Posting for you.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2} duration={0.7}>
            <p className="text-title text-white/35 max-w-xl mx-auto mb-10 leading-relaxed font-light">
              Upload a few photos. Get a full content team that creates,
              schedules, and posts — using your face and voice.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} duration={0.7}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link
                href="/demo"
                className="btn-cta-glow group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] w-full sm:w-auto rounded-xl bg-white text-[#050508] text-p2 font-semibold hover:bg-white/90 active:bg-white/80 transition-all"
              >
                Try it free — no signup
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] w-full sm:w-auto rounded-xl text-p2 text-white/40 hover:text-white/60 active:text-white/70 transition-all"
              >
                See how it works
              </Link>
            </div>

            <p className="text-p3 text-white/15">
              No credit card required
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Hero Demo Video — Item 1 */}
      <FadeIn delay={0.15} duration={0.8}>
        <section className="pb-24 px-6">
          <div
            className="max-w-sm mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 9:16 video container with glow */}
            <div className="relative group">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-b from-blue-500/[0.08] via-violet-500/[0.06] to-transparent rounded-[32px] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Video frame */}
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
                {/* Simulated content / poster background — swaps per active video */}
                {demoVideos.map((video, i) => (
                  <div
                    key={video.id}
                    className={`absolute inset-0 bg-gradient-to-b ${video.gradient} transition-opacity duration-700 ${
                      i === activeVideo ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}

                {/* Subtle mesh grid overlay */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Floating AI generation indicators */}
                <div className="absolute top-6 left-5 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-blue-400/80" />
                  <span className="text-[10px] text-white/40 font-medium">
                    AI Generated
                  </span>
                </div>

                <div className="absolute top-6 right-5">
                  <div className="px-2.5 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                    <span className="text-[10px] text-white/40 font-medium">
                      {current.duration}
                    </span>
                  </div>
                </div>

                {/* Center play button and text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Play button with glow ring */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl scale-150 animate-pulse-slow" />
                    <button
                      className="relative w-16 h-16 rounded-full bg-white/[0.1] border border-white/[0.15] flex items-center justify-center backdrop-blur-sm hover:bg-white/[0.15] hover:border-white/[0.25] hover:scale-105 transition-all duration-300 cursor-pointer"
                      aria-label={`Play ${current.label} demo video`}
                    >
                      <Play className="w-6 h-6 text-white/90 ml-1" />
                    </button>
                  </div>

                  <p
                    key={current.id}
                    className="text-p2 sm:text-p2 text-white/60 font-medium text-center px-8 leading-snug animate-fade-in"
                  >
                    {current.title}
                    <br />
                    {current.subtitle}
                  </p>
                </div>

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050508] to-transparent" />

                {/* Bottom auto-advance progress bar */}
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      key={`${activeVideo}-${isPaused}`}
                      className={`h-full bg-gradient-to-r from-blue-400 to-violet-400 rounded-full ${
                        isPaused ? "w-full opacity-30" : "animate-progress-bar"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail/dot picker */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {demoVideos.map((video, i) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(i);
                  }}
                  className={`group/dot flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                    i === activeVideo
                      ? "bg-white/[0.08] border-white/[0.15]"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]"
                  }`}
                  aria-label={`Play ${video.label} demo`}
                  aria-current={i === activeVideo}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === activeVideo
                        ? "bg-gradient-to-r from-blue-400 to-violet-400"
                        : "bg-white/20 group-hover/dot:bg-white/40"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium transition-colors duration-300 ${
                      i === activeVideo ? "text-white/70" : "text-white/30 group-hover/dot:text-white/50"
                    }`}
                  >
                    {video.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Caption below video */}
            <p className="text-center mt-4 text-p2 text-white/30 leading-relaxed font-light">
              This was made by AI. No camera. No crew. No editing.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Social Proof Wall — Item 4 */}
      <FadeIn>
        <section className="py-20 px-6 border-y border-white/[0.04]">
          <div className="max-w-4xl mx-auto">
            {/* Trusted counter */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
                <div className="flex -space-x-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-yellow-400/80 fill-yellow-400/80"
                    />
                  ))}
                </div>
                <span className="text-p3 text-white/50 font-medium">
                  4.9 average rating
                </span>
              </div>
              <h2 className="text-h3 sm:text-h2 font-bold tracking-tight text-white mb-2">
                Trusted by{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  200+
                </span>{" "}
                professionals
              </h2>
              <p className="text-p2 text-white/25">
                Attorneys, doctors, real estate agents, and advisors use Official
                AI every day.
              </p>
            </div>

            {/* Testimonial cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <FadeIn key={i} delay={i * 0.1} duration={0.6}>
                  <div className="relative p-6 rounded-2xl card-hairline h-full flex flex-col">
                    {/* Accent gradient top */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/20 via-violet-500/10 to-transparent" />

                    {/* Quote icon */}
                    <Quote className="w-5 h-5 text-blue-400/20 mb-4 flex-shrink-0" />

                    {/* Quote text */}
                    <p className="text-p3 text-white/40 leading-relaxed mb-6 flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                      {/* Avatar placeholder */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                        <span className="text-p3 font-semibold text-white/50">
                          {t.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="text-p3 font-medium text-white/70">
                          {t.name}
                        </div>
                        <div className="text-p3 text-white/25">
                          {t.title} &middot; {t.industry}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Stats — oversized gradient numerals */}
      <FadeIn>
        <section className="relative border-b border-white/[0.04] py-24 px-6 overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,110,245,0.08)_0%,transparent_60%)]" />
          </div>

          <div className="relative max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 text-center">
            {[
              { value: "90%", label: "Less time creating" },
              { value: "60x", label: "More views on average" },
              { value: "5 min", label: "Setup to first video" },
              { value: "$79", label: "Per month to start" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1} duration={0.6}>
                <div className="space-y-3">
                  <div className="text-[64px] md:text-[88px] leading-none font-bold tracking-tighter bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-p3 text-white/40 font-medium">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* How it Works */}
      <FadeIn>
        <section id="how" className="py-28 px-6 scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-14">
              <p className="text-p3 font-medium text-blue-400/70 uppercase tracking-widest mb-3">
                How it works
              </p>
              <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-white leading-tight">
                Three steps. Five minutes.
                <br />
                <span className="text-white/40">Content on autopilot.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: Camera,
                  num: "01",
                  title: "Upload your photos",
                  desc: "A few selfies or headshots from your phone. The AI builds a consistent character model of you for every video.",
                  accent: "from-blue-500/20 to-blue-500/0",
                },
                {
                  icon: Sparkles,
                  num: "02",
                  title: "AI creates your content",
                  desc: "Type what you want or let AI decide. It writes the script, plans the shots, and builds a multi-cut video that looks professionally produced.",
                  accent: "from-violet-500/20 to-violet-500/0",
                },
                {
                  icon: Send,
                  num: "03",
                  title: "Review and publish",
                  desc: "Every video hits your approval queue first. Approve it, schedule it, and it auto-posts to Instagram, TikTok, LinkedIn, YouTube, and Facebook.",
                  accent: "from-emerald-500/20 to-emerald-500/0",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="group relative p-6 rounded-2xl card-hairline"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${step.accent}`}
                  />
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5 group-hover:border-white/[0.1] transition-colors">
                    <step.icon className="w-4.5 h-4.5 text-white/40" />
                  </div>
                  <div className="text-p3 text-white/15 font-mono mb-2">
                    {step.num}
                  </div>
                  <h3 className="text-p1 font-semibold text-white/90 mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-p3 text-white/30 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/how-it-works"
                className="text-p3 text-blue-400/70 hover:text-blue-400 transition-colors"
              >
                Learn more about our process &rarr;
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Looping reel strip — visual proof of the process at scale */}
      <FadeIn delay={0.1} duration={0.8}>
        <section className="relative py-20 overflow-hidden border-y border-white/[0.04]">
          {/* Section label */}
          <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
            <p className="text-p3 font-medium text-blue-400/70 uppercase tracking-widest mb-3">
              The output
            </p>
            <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-white leading-tight">
              This is what you get.
              <br />
              <span className="text-white/40">Every single day.</span>
            </h2>
          </div>

          {/* Edge fade masks */}
          <div className="absolute left-0 bottom-20 top-44 w-32 bg-gradient-to-r from-[#050508] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 bottom-20 top-44 w-32 bg-gradient-to-l from-[#050508] to-transparent z-10 pointer-events-none" />

          {/* Looping track */}
          <div className="flex gap-5 animate-loop-left hover:[animation-play-state:paused] w-max">
            {[...Array(2)].map((_, dupIdx) =>
              [
                "from-blue-900/30 via-[#0a0e17] to-violet-900/30",
                "from-emerald-900/30 via-[#0a0e17] to-blue-900/30",
                "from-amber-900/30 via-[#0a0e17] to-rose-900/30",
                "from-violet-900/30 via-[#0a0e17] to-fuchsia-900/30",
                "from-cyan-900/30 via-[#0a0e17] to-blue-900/30",
                "from-rose-900/30 via-[#0a0e17] to-violet-900/30",
                "from-blue-900/30 via-[#0a0e17] to-emerald-900/30",
                "from-violet-900/30 via-[#0a0e17] to-amber-900/30",
              ].map((gradient, i) => (
                <div
                  key={`${dupIdx}-${i}`}
                  className="relative w-[180px] sm:w-[220px] aspect-[9/16] flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent group/reel"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
                  {/* Subtle mesh */}
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />
                  {/* AI badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
                    <Sparkles className="w-2.5 h-2.5 text-blue-400/70" />
                    <span className="text-[9px] text-white/40 font-medium">AI</span>
                  </div>
                  {/* Center play */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover/reel:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-4 h-4 text-white/80 ml-0.5" />
                    </div>
                  </div>
                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#050508] to-transparent" />
                </div>
              ))
            )}
          </div>

          {/* Caption */}
          <p className="text-center mt-10 text-p3 text-white/30 font-light">
            Every video on this page was generated by Official AI
          </p>
        </section>
      </FadeIn>

      {/* Features */}
      <FadeIn>
        <section id="features" className="py-28 px-6 border-t border-white/[0.04] scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="mb-14">
              <p className="text-p3 font-medium text-blue-400/70 uppercase tracking-widest mb-3">
                What you get
              </p>
              <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-white leading-tight">
                A content team
                <br />
                <span className="text-white/40">that never sleeps.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "AI content team",
                  desc: "A full creative team powered by AI -- writing scripts, generating videos, and building your brand presence daily.",
                },
                {
                  title: "Automated posting",
                  desc: "Schedule and publish to Instagram, TikTok, LinkedIn, YouTube, and Facebook from one dashboard. Set it and forget it.",
                },
                {
                  title: "Your face, your voice",
                  desc: "Character sheets and voice cloning ensure every video looks and sounds like you. Not a generic avatar.",
                },
                {
                  title: "Performance insights",
                  desc: "Track views, engagement, and ROI across all platforms. Know what content drives real results.",
                },
                {
                  title: "Content calendar",
                  desc: "Plan, preview, and approve your entire week of content in one place. Nothing posts without your sign-off.",
                },
                {
                  title: "Multi-platform optimization",
                  desc: "Every video is automatically optimized for each platform -- aspect ratios, captions, and posting times.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl card-hairline"
                >
                  <h3 className="text-p2 font-medium text-white/80 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-p3 text-white/25 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/features"
                className="text-p3 text-blue-400/70 hover:text-blue-400 transition-colors"
              >
                See all features &rarr;
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Industries */}
      <FadeIn>
        <section className="py-28 px-6 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-14">
              <p className="text-p3 font-medium text-blue-400/70 uppercase tracking-widest mb-3">
                Built for
              </p>
              <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-white leading-tight">
                Professionals who need
                <br />
                <span className="text-white/40">to be everywhere.</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Legal",
                  desc: "Know-your-rights, case results, legal tips",
                },
                {
                  title: "Medical",
                  desc: "Health tips, procedure explainers, wellness",
                },
                {
                  title: "Real Estate",
                  desc: "Listing tours, market updates, testimonials",
                },
                {
                  title: "Creators",
                  desc: "Brand intros, thought leadership, daily tips",
                },
              ].map((ind, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl card-hairline"
                >
                  <h3 className="text-p2 font-medium text-white/80 mb-1.5">
                    {ind.title}
                  </h3>
                  <p className="text-p3 text-white/20 leading-relaxed">
                    {ind.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/use-cases"
                className="text-p3 text-blue-400/70 hover:text-blue-400 transition-colors"
              >
                Explore all use cases &rarr;
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Pricing — Item 36: One plan, everything included */}
      <FadeIn>
        <section id="pricing" className="py-28 px-6 border-t border-white/[0.04] scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-p3 font-medium text-blue-400/70 uppercase tracking-widest mb-3">
                Pricing
              </p>
              <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-white mb-3">
                One plan. Everything included.
              </h2>
              <p className="text-p2 text-white/25">
                Start free. Upgrade when you are ready.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* Main plan */}
              <div className="relative p-7 rounded-2xl !border-white/[0.1] !bg-white/[0.025] card-hairline">
                <div className="absolute -top-3 left-6">
                  <span className="text-p3 font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                    Everything included
                  </span>
                </div>
                <h3 className="text-p2 font-semibold text-white/90 mt-1">
                  Official AI
                </h3>
                <div className="flex items-baseline gap-1 mt-3 mb-6">
                  <span className="text-h2 font-bold text-white">$79</span>
                  <span className="text-p3 text-white/20">/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "30 videos per month",
                    "All platforms",
                    "Voice cloning",
                    "Multi-cut composition",
                    "Analytics & auto-posting",
                  ].map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2.5 text-p3 text-white/40"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400/40 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className="block text-center text-p3 font-medium py-3 min-h-[44px] flex items-center justify-center rounded-lg transition-all btn-cta-glow bg-white text-[#050508] hover:bg-white/90 active:bg-white/80"
                >
                  Start your free week — $79/mo after
                </Link>
              </div>

              {/* Enterprise */}
              <div className="relative p-7 rounded-2xl card-hairline">
                <h3 className="text-p2 font-semibold text-white/90 mt-1">
                  Enterprise
                </h3>
                <div className="flex items-baseline gap-1 mt-3 mb-6">
                  <span className="text-h2 font-bold text-white">Custom</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    "Unlimited videos",
                    "Dedicated support",
                    "Custom AI models",
                    "API access",
                    "Multi-user accounts",
                  ].map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2.5 text-p3 text-white/40"
                    >
                      <Check className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="mailto:hello@officialai.com?subject=Enterprise%20Inquiry"
                  className="block text-center text-p3 font-medium py-3 min-h-[44px] flex items-center justify-center rounded-lg transition-all border border-white/[0.08] text-white/50 hover:text-white/70 hover:border-white/[0.12] active:bg-white/[0.04]"
                >
                  Contact sales
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/pricing"
                className="text-p3 text-blue-400/70 hover:text-blue-400 transition-colors"
              >
                See full pricing details &rarr;
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* CTA */}
      <FadeIn>
        <section className="py-28 px-6 border-t border-white/[0.04]">
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none">
              <div className="absolute inset-0 bg-blue-500/[0.03] rounded-full blur-[80px]" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
                <Zap className="w-3 h-3 text-yellow-400/70" />
                <span className="text-p3 text-white/40 font-medium">
                  Get your first video in 5 minutes
                </span>
              </div>

              <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-white mb-4">
                Ready to stop filming?
              </h2>
              <p className="text-p1 text-white/30 mb-8 max-w-md mx-auto">
                Upload your photos and let AI handle the rest. Your social
                presence, automated.
              </p>
              <Link
                href="/demo"
                className="btn-cta-glow group inline-flex items-center justify-center gap-2.5 px-8 py-4 min-h-[48px] w-full sm:w-auto rounded-xl bg-white text-[#050508] text-p2 font-semibold hover:bg-white/90 active:bg-white/80 transition-all"
              >
                Try it free — no signup
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </MarketingLayout>
  );
}
