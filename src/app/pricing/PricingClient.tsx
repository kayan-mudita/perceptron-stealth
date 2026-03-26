"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, ChevronDown, Loader2, Clock, Users, ArrowRight } from "lucide-react";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import CTASection from "@/components/marketing/CTASection";

/* ─── Item 37: Value Anchor Data ───────────────────────────────── */

const valueAnchors = [
  {
    label: "Video production agency",
    cost: "$3,000-5,000/month for 4 videos",
  },
  {
    label: "Freelance videographer",
    cost: "$1,500/month for 8 videos",
  },
  {
    label: "DIY with ring light",
    cost: "Free but 20 hours of your time",
    noStrike: true,
  },
];

/* ─── Item 36: Single Plan ─────────────────────────────────────── */

const mainPlan = {
  name: "Everything Plan",
  planId: "starter",
  price: "$79",
  period: "/mo",
  description: "Everything included. No upsells. No limits that matter.",
  features: [
    "30 videos per month",
    "All platforms (Instagram, TikTok, LinkedIn, YouTube, Facebook)",
    "Voice cloning",
    "AI digital twin",
    "Multi-cut composition",
    "Advanced analytics",
    "Auto-posting & scheduling",
    "Content calendar",
    "Smart scripts",
    "Brand vault",
  ],
  cta: "Start your free week \u2014 $79/mo after",
};

const enterprisePlan = {
  name: "Enterprise",
  planId: "enterprise",
  price: "Custom",
  period: "",
  description: "For teams and agencies that need scale and control.",
  features: [
    "Unlimited videos",
    "All platforms",
    "Dedicated support",
    "Custom AI models",
    "API access",
    "Multi-user accounts",
  ],
  cta: "Contact sales",
};

/* ─── Item 36: Updated comparison (Pro vs Enterprise) ──────────── */

const comparisonFeatures = [
  {
    category: "Content Creation",
    features: [
      { name: "Videos per month", pro: "30", enterprise: "Unlimited" },
      { name: "AI digital twin", pro: true, enterprise: true },
      { name: "Multi-cut composition", pro: true, enterprise: true },
      { name: "Voice cloning", pro: true, enterprise: true },
      { name: "Smart scripts", pro: true, enterprise: true },
      { name: "Custom AI models", pro: false, enterprise: true },
    ],
  },
  {
    category: "Publishing",
    features: [
      { name: "Platforms", pro: "All", enterprise: "All" },
      { name: "Auto-posting", pro: true, enterprise: true },
      { name: "Content calendar", pro: true, enterprise: true },
      { name: "Optimal time scheduling", pro: true, enterprise: true },
    ],
  },
  {
    category: "Analytics & Admin",
    features: [
      { name: "Basic analytics", pro: true, enterprise: true },
      { name: "Advanced analytics", pro: true, enterprise: true },
      { name: "Brand vault", pro: true, enterprise: true },
      { name: "Multi-user accounts", pro: false, enterprise: true },
      { name: "API access", pro: false, enterprise: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Email support", pro: true, enterprise: true },
      { name: "Priority generation", pro: true, enterprise: true },
      { name: "Dedicated support", pro: false, enterprise: true },
    ],
  },
];

const faqs = [
  {
    q: "How does the free trial work?",
    a: "Start your free 7-day trial with full access to every feature. Cancel anytime during the trial and you will not be charged. After 7 days, your plan begins at $79/mo.",
  },
  {
    q: "Why one plan instead of tiers?",
    a: "Because you deserve every feature from day one. We don't believe in holding back voice cloning or analytics behind a higher price. You get everything for $79.",
  },
  {
    q: "What platforms do you support?",
    a: "Instagram Reels, TikTok, LinkedIn, YouTube Shorts, and Facebook. Each video is automatically optimized for the platform it is posted to.",
  },
  {
    q: "How long does it take to get my first video?",
    a: "Under five minutes from signup to your first generated video. Upload your photos, pick a format, and the AI handles the rest.",
  },
  {
    q: "Will the videos actually look like me?",
    a: "Yes. The AI builds a detailed character model from your photos that maintains your likeness from every angle. This is not a face swap — it is a full digital twin.",
  },
  {
    q: "What if I do not like a video?",
    a: "Every video goes through your approval queue before posting. You can request revisions, edit the script, or reject it entirely. Nothing goes live without your approval.",
  },
  {
    q: "How does team pricing work?",
    a: "Each team member gets their own AI twin, voice clone, and content calendar for $79/seat per month. Contact us for teams of 10 or more for volume discounts.",
  },
  {
    q: "Is there a contract?",
    a: "No. Month-to-month billing. Cancel anytime, effective at the end of your current billing period.",
  },
];

/* ─── Item 38: Countdown Timer Hook ────────────────────────────── */

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Always 14 days from "now" — rolling perpetual promo
    const getExpiration = () => {
      const stored = typeof window !== "undefined" ? localStorage.getItem("promo_expiry") : null;
      if (stored) {
        const exp = new Date(stored);
        if (exp.getTime() > Date.now()) return exp;
      }
      const exp = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      if (typeof window !== "undefined") {
        localStorage.setItem("promo_expiry", exp.toISOString());
      }
      return exp;
    };

    const expiry = getExpiration();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, expiry.getTime() - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-[13px] text-white/50">{value}</span>;
  }
  return value ? (
    <Check className="w-4 h-4 text-white/40 mx-auto" />
  ) : (
    <Minus className="w-4 h-4 text-white/15 mx-auto" />
  );
}

export default function PricingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();
  const countdown = useCountdown();

  async function handleSubscribe(planId: string) {
    if (planId === "enterprise") return;

    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      if (res.status === 401) {
        router.push("/auth/signup");
        return;
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        router.push("/dashboard/settings?tab=plan");
      }
    } catch (err) {
      console.error("Checkout request failed:", err);
      router.push("/auth/signup");
    } finally {
      setLoadingPlan(null);
    }
  }

  const isLoading = loadingPlan === mainPlan.planId;

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h1 className="text-[42px] sm:text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-6">
            One plan.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Everything included.
            </span>
          </h1>
          <p className="text-[17px] text-white/35 max-w-xl mx-auto leading-relaxed font-light">
            No tiers, no upsells. Every feature for one price. Try free for 7 days,
            then $79/mo. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Item 37: Price Anchor Section */}
      <section className="pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-8">
            <p className="text-[13px] font-medium text-white/40 uppercase tracking-widest mb-6 text-center">
              What this would cost elsewhere
            </p>

            <div className="space-y-4 mb-8">
              {valueAnchors.map((anchor, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-[14px] text-white/50">{anchor.label}</span>
                  <span
                    className={`text-[14px] font-medium ${
                      anchor.noStrike
                        ? "text-white/30 italic"
                        : "text-red-400/70 line-through decoration-red-500/60 decoration-2"
                    }`}
                  >
                    {anchor.cost}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] pt-6 text-center">
              <p className="text-[18px] sm:text-[20px] font-semibold text-white">
                Official AI:{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  $79/month
                </span>{" "}
                for 30 videos.
              </p>
              <p className="text-[14px] text-white/30 mt-1">
                Zero hours of your time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Item 38: Promotional Banner */}
      <section className="pb-8 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.06] via-blue-500/[0.04] to-violet-500/[0.06] p-6 overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative text-center">
              <p className="text-[13px] font-semibold text-emerald-400 uppercase tracking-widest mb-2">
                Spring Launch Special
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span className="text-[36px] font-bold text-white">$59</span>
                <span className="text-[14px] text-white/20">/mo</span>
                <span className="text-[14px] text-white/30 line-through ml-2">$79/mo</span>
              </div>

              {/* Countdown timer */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-white/60">
                  <Clock className="w-3.5 h-3.5 text-emerald-400/70" />
                  <span className="text-[13px] font-medium">Offer expires in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { value: countdown.days, label: "d" },
                    { value: countdown.hours, label: "h" },
                    { value: countdown.minutes, label: "m" },
                    { value: countdown.seconds, label: "s" },
                  ].map((unit, i) => (
                    <div key={i} className="flex items-center gap-0.5">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[14px] font-bold text-white tabular-nums">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-white/25 font-medium">{unit.label}</span>
                      {i < 3 && <span className="text-white/15 text-[14px] mx-0.5">:</span>}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[12px] text-emerald-400/60 font-medium">
                Lock in this rate forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main pricing card (Item 36: one plan) */}
      <section className="pb-24 px-6">
        <div className="max-w-lg mx-auto">
          <div className="relative p-8 rounded-2xl border border-white/[0.1] bg-white/[0.025]">
            {/* Popular badge */}
            <div className="absolute -top-3 left-8">
              <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                Everything included
              </span>
            </div>

            <h3 className="text-[18px] font-semibold text-white/90 mt-2">
              {mainPlan.name}
            </h3>
            <div className="flex items-baseline gap-1.5 mt-3 mb-2">
              <span className="text-[42px] font-bold text-white">
                {mainPlan.price}
              </span>
              <span className="text-[14px] text-white/20">{mainPlan.period}</span>
            </div>
            <p className="text-[13px] text-white/25 mb-8">
              {mainPlan.description}
            </p>

            <ul className="space-y-3 mb-8">
              {mainPlan.features.map((f, j) => (
                <li
                  key={j}
                  className="flex items-center gap-2.5 text-[13px] text-white/40"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400/50 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(mainPlan.planId)}
              disabled={isLoading}
              className="block w-full text-center text-[15px] font-semibold py-4 min-h-[52px] flex items-center justify-center rounded-xl transition-all disabled:opacity-60 bg-white text-[#050508] hover:bg-white/90 active:bg-white/80"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mainPlan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            <p className="text-[12px] text-white/15 text-center mt-3">
              Try free for 7 days. Cancel anytime.
            </p>
          </div>

          {/* Enterprise below */}
          <div className="mt-5 p-6 rounded-2xl border border-white/[0.04] bg-white/[0.015]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-white/80">
                  {enterprisePlan.name}
                </h3>
                <p className="text-[12px] text-white/25 mt-0.5">
                  {enterprisePlan.description}
                </p>
              </div>
              <Link
                href="mailto:hello@officialai.com?subject=Enterprise%20Inquiry"
                className="text-[13px] font-medium px-5 py-2.5 min-h-[40px] flex items-center justify-center rounded-xl transition-all border border-white/[0.08] text-white/50 hover:text-white/70 hover:border-white/[0.12] active:bg-white/[0.04]"
              >
                {enterprisePlan.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Item 42: Team pricing section */}
      <section className="pb-24 px-6 border-t border-white/[0.04] pt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
              <Users className="w-3 h-3 text-blue-400/70" />
              <span className="text-[12px] text-white/40 font-medium">
                Team pricing
              </span>
            </div>
            <h2 className="text-[32px] sm:text-[36px] font-bold tracking-tight text-white mb-3">
              Scale across your firm
            </h2>
            <p className="text-[15px] text-white/30 max-w-lg mx-auto">
              Add team members at{" "}
              <span className="text-white/60 font-medium">$79/seat per month</span>.
              Each member gets their own AI twin, voice, and content calendar.
            </p>
          </div>

          {/* Example calculation */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <p className="text-[13px] text-white/30 uppercase tracking-widest mb-4">
              Example
            </p>
            <div className="flex items-center justify-center gap-3 text-white mb-4 flex-wrap">
              <span className="text-[28px] font-bold">5 attorneys</span>
              <span className="text-[20px] text-white/20">x</span>
              <span className="text-[28px] font-bold">$79</span>
              <span className="text-[20px] text-white/20">=</span>
              <span className="text-[28px] font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                $395/mo
              </span>
            </div>
            <p className="text-[14px] text-white/25 mb-6">
              for your entire firm
            </p>

            <ul className="inline-flex flex-col items-start gap-2 text-left mb-8">
              {[
                "Each member gets their own AI twin",
                "Individual voice clones for every person",
                "Separate content calendars",
                "Shared brand vault & analytics",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[13px] text-white/40">
                  <Check className="w-3.5 h-3.5 text-blue-400/40 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] rounded-xl bg-white text-[#050508] text-[15px] font-semibold hover:bg-white/90 active:bg-white/80 transition-all"
            >
              Start with your team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
              Compare plans
            </p>
            <h2 className="text-[36px] sm:text-[40px] font-bold tracking-tight text-white">
              Feature comparison
            </h2>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[420px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-4 pr-4 text-[13px] font-medium text-white/30 w-[50%]" />
                  <th className="text-center py-4 px-4 text-[13px] font-medium text-white/80 w-[25%]">
                    $79/mo
                  </th>
                  <th className="text-center py-4 px-4 text-[13px] font-medium text-white/50 w-[25%]">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((group) => (
                  <React.Fragment key={group.category}>
                    <tr>
                      <td
                        colSpan={3}
                        className="pt-8 pb-3 text-[12px] font-medium text-blue-400/60 uppercase tracking-widest"
                      >
                        {group.category}
                      </td>
                    </tr>
                    {group.features.map((feature, i) => (
                      <tr
                        key={`${group.category}-${i}`}
                        className="border-b border-white/[0.03]"
                      >
                        <td className="py-3.5 pr-4 text-[13px] text-white/40">
                          {feature.name}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <CellValue value={feature.pro} />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <CellValue value={feature.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-3">
              FAQ
            </p>
            <h2 className="text-[36px] sm:text-[40px] font-bold tracking-tight text-white">
              Common questions
            </h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/[0.04] hover:border-white/[0.06] transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left min-h-[48px]"
                >
                  <span className="text-[14px] font-medium text-white/70 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-white/20 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === i ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-[13px] text-white/30 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Start your free week."
        description="Full access for 7 days. Cancel anytime. See what AI content looks like with your face and voice."
        badge="Try free for 7 days, cancel anytime"
      />
    </MarketingLayout>
  );
}
