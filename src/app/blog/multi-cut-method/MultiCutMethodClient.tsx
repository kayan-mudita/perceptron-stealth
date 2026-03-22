"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import CTASection from "@/components/marketing/CTASection";

export default function MultiCutMethodClient() {
  return (
    <MarketingLayout>
      {/* Article header */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-white/50 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to blog
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border text-blue-400/70 bg-blue-500/10 border-blue-500/20">
              Technology
            </span>
            <span className="text-[12px] text-white/20">March 18, 2026</span>
            <span className="inline-flex items-center gap-1 text-[12px] text-white/20">
              <Clock className="w-3 h-3" />
              6 min read
            </span>
          </div>

          <h1 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] text-white mb-6">
            The Multi-Cut Method: Why One-Shot AI Video Looks Like Garbage
          </h1>

          <p className="text-[17px] text-white/35 leading-relaxed">
            Every AI video tool on the market generates a single continuous shot from
            a text prompt. And every single one of them looks immediately,
            unmistakably fake. Here is why — and how multi-cut composition fixes it.
          </p>
        </div>
      </section>

      {/* Article body */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <article className="space-y-8">
            {/* Section 1 */}
            <div>
              <h2 className="text-[22px] font-bold text-white/90 mb-4">
                The one-shot problem
              </h2>
              <div className="space-y-4">
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  Open any AI video tool. Type in a prompt. Hit generate. What you
                  get back is a single, continuous shot — typically 5 to 15 seconds
                  of uninterrupted video. Sometimes it looks impressive in isolation.
                  But put it next to real content on a social feed and it sticks out
                  immediately.
                </p>
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  The reason is simple: real video is never a single shot. Think
                  about the last good social media video you watched. It had cuts.
                  It had different angles. It had a hook shot that was different from
                  the body, which was different from the close. That is how video
                  works. That is how human attention works.
                </p>
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  One-shot AI video ignores all of this. It generates a single
                  continuous motion that has no editorial intent, no pacing, no
                  structure. The result is something that feels uncanny even when the
                  individual frames look photorealistic.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-white/[0.06] mx-auto" />

            {/* Section 2 */}
            <div>
              <h2 className="text-[22px] font-bold text-white/90 mb-4">
                What real video looks like
              </h2>
              <div className="space-y-4">
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  Break down any successful short-form video and you will find the
                  same structure: a hook shot (usually tight on the face), a
                  transition to the body content (wider angle or different
                  composition), supporting visuals or B-roll, and a close with a
                  call-to-action.
                </p>
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  This is not complicated filmmaking. It is basic video editing that
                  every content creator learns intuitively. But it is the difference
                  between content that feels real and content that feels generated.
                </p>
              </div>

              {/* Inline diagram */}
              <div className="mt-6 p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015]">
                <p className="text-[12px] font-medium text-white/30 uppercase tracking-wider mb-4">
                  Anatomy of a multi-cut video
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Hook", desc: "Tight face shot, pattern interrupt", time: "0-2s" },
                    { label: "Setup", desc: "Wider angle, introduce topic", time: "2-8s" },
                    { label: "Body", desc: "Main content, B-roll cuts", time: "8-20s" },
                    { label: "CTA", desc: "Close-up, direct address", time: "20-30s" },
                  ].map((cut, i) => (
                    <div key={i} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                      <div className="text-[11px] text-blue-400/60 font-mono mb-1">
                        {cut.time}
                      </div>
                      <div className="text-[13px] font-medium text-white/60 mb-1">
                        {cut.label}
                      </div>
                      <div className="text-[11px] text-white/20 leading-relaxed">
                        {cut.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-white/[0.06] mx-auto" />

            {/* Section 3 */}
            <div>
              <h2 className="text-[22px] font-bold text-white/90 mb-4">
                The multi-cut approach
              </h2>
              <div className="space-y-4">
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  Instead of generating one continuous shot, the multi-cut method
                  generates 3 to 8 separate clips — each from a carefully composed
                  starting frame with a specific camera angle, expression, and body
                  position. Each clip is generated independently, then they are
                  stitched together with professional editing.
                </p>
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  The starting frame is the key innovation. Instead of letting the
                  AI decide what the first frame looks like (which leads to random,
                  unintentional compositions), each shot begins from a composed
                  frame — the way a real director would plan a shot.
                </p>
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  The result is video that has editorial intent. It has pacing. It
                  has visual variety. It has the structure that your brain expects
                  from real content. And because each cut is only 2-5 seconds long,
                  the AI generation quality stays high — there is less time for
                  artifacts to accumulate.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-white/[0.06] mx-auto" />

            {/* Section 4 */}
            <div>
              <h2 className="text-[22px] font-bold text-white/90 mb-4">
                Why this matters for professionals
              </h2>
              <div className="space-y-4">
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  If you are a real estate agent, attorney, or financial advisor
                  using AI video to build your online presence, quality is not
                  optional. Your professional reputation is on the line. Content
                  that looks obviously AI-generated does more harm than posting
                  nothing at all.
                </p>
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  Multi-cut composition is the difference between AI content that
                  enhances your credibility and AI content that undermines it. It
                  is the difference between someone watching your video and thinking
                  &quot;that is a great tip&quot; versus thinking &quot;that is clearly AI.&quot;
                </p>
                <p className="text-[15px] text-white/35 leading-[1.8]">
                  We built Official AI around multi-cut composition because we
                  believe professionals deserve AI content that meets their
                  standards. Not AI slop that goes viral for being obviously fake.
                  Content that builds trust, drives engagement, and generates real
                  business.
                </p>
              </div>
            </div>
          </article>

          {/* Post footer */}
          <div className="mt-16 pt-8 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[13px] text-white/30 hover:text-white/50 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                All posts
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-[13px] text-blue-400/70 hover:text-blue-400 transition-colors"
              >
                See how it works
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        heading="See multi-cut in action."
        description="Upload your photos and get your first multi-cut AI video in under five minutes."
        badge="Free trial, no credit card"
      />
    </MarketingLayout>
  );
}
