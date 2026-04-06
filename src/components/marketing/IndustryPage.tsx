"use client";

import Link from "next/link";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import CTASection from "@/components/marketing/CTASection";
import FadeIn from "@/components/motion/FadeIn";

interface PainPoint {
  title: string;
  description: string;
}

interface Solution {
  title: string;
  description: string;
}

interface IndustryPageProps {
  industry: string;
  headline: string;
  headlineAccent: string;
  subtext: string;
  painPoints: PainPoint[];
  solutions: Solution[];
  ctaBadge: string;
  ctaHeading: string;
  ctaDescription: string;
}

export default function IndustryPage({
  industry,
  headline,
  headlineAccent,
  subtext,
  painPoints,
  solutions,
  ctaBadge,
  ctaHeading,
  ctaDescription,
}: IndustryPageProps) {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/4 w-[300px] h-[300px] bg-violet-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn delay={0} duration={0.6}>
            <p className="text-p3 font-medium text-blue-400/70 uppercase tracking-widest mb-4">
              Official AI for {industry}
            </p>
          </FadeIn>

          <FadeIn delay={0.1} duration={0.7}>
            <h1 className="text-h1 sm:text-h0 font-bold tracking-[-0.03em] leading-[1.08] text-white mb-6">
              {headline}
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                {headlineAccent}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2} duration={0.7}>
            <p className="text-title text-white/35 max-w-xl mx-auto leading-relaxed font-light mb-10">
              {subtext}
            </p>
          </FadeIn>

          <FadeIn delay={0.3} duration={0.7}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="btn-cta-glow group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] w-full sm:w-auto rounded-xl bg-white text-[#050508] text-p2 font-semibold hover:bg-white/90 active:bg-white/80 transition-all"
              >
                Start free trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] w-full sm:w-auto rounded-xl text-p2 text-white/40 hover:text-white/60 active:text-white/70 transition-all"
              >
                View pricing
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pain Points */}
      <FadeIn>
        <section className="py-24 px-6 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-p3 font-medium text-blue-400/70 uppercase tracking-widest mb-3">
                The problem
              </p>
              <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-white leading-tight">
                Sound familiar?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {painPoints.map((point, i) => (
                <FadeIn key={i} delay={i * 0.1} duration={0.6}>
                  <div className="relative p-6 rounded-2xl card-hairline h-full">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-rose-500/20 to-transparent" />
                    <div className="w-9 h-9 rounded-xl bg-rose-500/[0.06] border border-rose-500/15 flex items-center justify-center mb-4">
                      <AlertCircle className="w-4 h-4 text-rose-400/60" />
                    </div>
                    <h3 className="text-p2 font-semibold text-white/80 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-p3 text-white/30 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Solutions */}
      <FadeIn>
        <section className="py-24 px-6 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-p3 font-medium text-blue-400/70 uppercase tracking-widest mb-3">
                The solution
              </p>
              <h2 className="text-h2 sm:text-h1 font-bold tracking-tight text-white leading-tight">
                Official AI handles it all.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {solutions.map((sol, i) => (
                <FadeIn key={i} delay={i * 0.1} duration={0.6}>
                  <div className="relative p-6 rounded-2xl card-hairline h-full">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/20 to-transparent" />
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 flex items-center justify-center mb-4">
                      <Check className="w-4 h-4 text-emerald-400/60" />
                    </div>
                    <h3 className="text-p2 font-semibold text-white/80 mb-2">
                      {sol.title}
                    </h3>
                    <p className="text-p3 text-white/30 leading-relaxed">
                      {sol.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Pricing teaser */}
      <FadeIn>
        <section className="py-20 px-6 border-t border-white/[0.04]">
          <div className="max-w-lg mx-auto text-center">
            <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
              <p className="text-p3 text-blue-400/70 uppercase tracking-widest font-medium mb-3">
                Pricing
              </p>
              <div className="flex items-baseline justify-center gap-1.5 mb-2">
                <span className="text-h0 font-bold text-white tracking-tight">
                  $79
                </span>
                <span className="text-p2 text-white/25">/mo</span>
              </div>
              <p className="text-p2 text-white/30 mb-6">
                10 videos per month. Upgrade to 30 for $149/mo.
              </p>
              <Link
                href="/auth/signup"
                className="btn-cta-glow group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#050508] text-p2 font-semibold hover:bg-white/90 active:bg-white/80 transition-all"
              >
                Start free trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <p className="text-p3 text-white/15 mt-4">
                No credit card required
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      <CTASection
        heading={ctaHeading}
        description={ctaDescription}
        badge={ctaBadge}
      />
    </MarketingLayout>
  );
}
