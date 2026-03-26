"use client";

import Link from "next/link";
import { ArrowRight, Check, X, Minus } from "lucide-react";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import CTASection from "@/components/marketing/CTASection";
import FadeIn from "@/components/motion/FadeIn";

interface ComparisonRow {
  label: string;
  diy: string;
  agency: string;
  official: string;
}

const comparisonData: ComparisonRow[] = [
  {
    label: "Monthly cost",
    diy: "Free",
    agency: "$3,000 - $5,000",
    official: "$79",
  },
  {
    label: "Time investment",
    diy: "5+ hrs/month",
    agency: "10+ hrs/month (meetings)",
    official: "5 min setup",
  },
  {
    label: "Videos per month",
    diy: "2",
    agency: "4",
    official: "30",
  },
  {
    label: "Video quality",
    diy: "Amateur",
    agency: "Professional",
    official: "Professional",
  },
  {
    label: "Your face & voice",
    diy: "yes",
    agency: "yes",
    official: "yes",
  },
  {
    label: "Script writing",
    diy: "You write them",
    agency: "Agency writes",
    official: "AI writes (you approve)",
  },
  {
    label: "Auto-posting",
    diy: "no",
    agency: "no",
    official: "yes",
  },
  {
    label: "Multi-platform",
    diy: "Manual upload each",
    agency: "1-2 platforms",
    official: "5 platforms",
  },
  {
    label: "Analytics",
    diy: "no",
    agency: "Monthly report",
    official: "Real-time dashboard",
  },
  {
    label: "Turnaround time",
    diy: "Whenever you finish",
    agency: "1-2 weeks",
    official: "Under 5 minutes",
  },
];

function CellValue({ value, highlight }: { value: string; highlight?: boolean }) {
  if (value === "yes") {
    return (
      <Check
        className={`w-4 h-4 mx-auto ${
          highlight ? "text-emerald-400" : "text-white/30"
        }`}
      />
    );
  }
  if (value === "no") {
    return <X className="w-4 h-4 mx-auto text-white/15" />;
  }
  return (
    <span
      className={`text-[13px] ${
        highlight ? "text-white/70 font-medium" : "text-white/35"
      }`}
    >
      {value}
    </span>
  );
}

export default function CompareClient() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/4 w-[300px] h-[300px] bg-violet-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn delay={0} duration={0.6}>
            <p className="text-[13px] font-medium text-blue-400/70 uppercase tracking-widest mb-4">
              Compare
            </p>
          </FadeIn>
          <FadeIn delay={0.1} duration={0.7}>
            <h1 className="text-[42px] sm:text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-white mb-6">
              Stop overpaying
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                for content.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2} duration={0.7}>
            <p className="text-[17px] text-white/35 max-w-xl mx-auto leading-relaxed font-light">
              See how Official AI stacks up against doing it yourself or hiring
              an expensive agency.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Comparison Table */}
      <FadeIn>
        <section className="pb-28 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Column Headers */}
            <div className="grid grid-cols-4 gap-3 mb-2">
              <div />
              {/* DIY */}
              <div className="p-5 rounded-t-2xl border border-white/[0.04] border-b-0 bg-white/[0.015] text-center">
                <div className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2">
                  Option 1
                </div>
                <h3 className="text-[15px] font-semibold text-white/60">
                  Do it yourself
                </h3>
              </div>
              {/* Agency */}
              <div className="p-5 rounded-t-2xl border border-white/[0.04] border-b-0 bg-white/[0.015] text-center">
                <div className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2">
                  Option 2
                </div>
                <h3 className="text-[15px] font-semibold text-white/60">
                  Hire an agency
                </h3>
              </div>
              {/* Official AI */}
              <div className="relative p-5 rounded-t-2xl border border-blue-500/20 border-b-0 bg-blue-500/[0.04] text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full whitespace-nowrap">
                    Best value
                  </span>
                </div>
                <div className="text-[11px] text-blue-400/50 uppercase tracking-wider font-medium mb-2">
                  Option 3
                </div>
                <h3 className="text-[15px] font-semibold text-white/90">
                  Official AI
                </h3>
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-0">
              {comparisonData.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-4 gap-3 ${
                    i === comparisonData.length - 1 ? "" : ""
                  }`}
                >
                  {/* Label */}
                  <div
                    className={`flex items-center px-4 py-3.5 text-[13px] text-white/45 font-medium ${
                      i === 0 ? "" : "border-t border-white/[0.04]"
                    }`}
                  >
                    {row.label}
                  </div>
                  {/* DIY */}
                  <div
                    className={`flex items-center justify-center px-4 py-3.5 bg-white/[0.015] border-x border-white/[0.04] ${
                      i === 0
                        ? ""
                        : "border-t border-white/[0.04]"
                    } ${
                      i === comparisonData.length - 1
                        ? "rounded-b-2xl border-b"
                        : ""
                    }`}
                  >
                    <CellValue value={row.diy} />
                  </div>
                  {/* Agency */}
                  <div
                    className={`flex items-center justify-center px-4 py-3.5 bg-white/[0.015] border-x border-white/[0.04] ${
                      i === 0
                        ? ""
                        : "border-t border-white/[0.04]"
                    } ${
                      i === comparisonData.length - 1
                        ? "rounded-b-2xl border-b"
                        : ""
                    }`}
                  >
                    <CellValue value={row.agency} />
                  </div>
                  {/* Official AI — highlighted */}
                  <div
                    className={`flex items-center justify-center px-4 py-3.5 bg-blue-500/[0.04] border-x border-blue-500/20 ${
                      i === 0
                        ? ""
                        : "border-t border-blue-500/10"
                    } ${
                      i === comparisonData.length - 1
                        ? "rounded-b-2xl border-b border-blue-500/20"
                        : ""
                    }`}
                  >
                    <CellValue value={row.official} highlight />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA row */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div />
              <div className="text-center">
                <Minus className="w-5 h-5 text-white/10 mx-auto" />
              </div>
              <div className="text-center">
                <Minus className="w-5 h-5 text-white/10 mx-auto" />
              </div>
              <div className="text-center">
                <Link
                  href="/auth/signup"
                  className="btn-cta-glow inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#050508] text-[13px] font-semibold hover:bg-white/90 active:bg-white/80 transition-all"
                >
                  Start free trial
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Mobile-friendly summary cards (visible on smaller screens) */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:hidden">
              {[
                {
                  title: "Do it yourself",
                  price: "Free",
                  time: "5+ hrs/month",
                  videos: "2 videos",
                  quality: "Amateur quality",
                  highlight: false,
                },
                {
                  title: "Hire an agency",
                  price: "$3,000 - $5,000/mo",
                  time: "10+ hrs/month",
                  videos: "4 videos",
                  quality: "Professional",
                  highlight: false,
                },
                {
                  title: "Official AI",
                  price: "$79/mo",
                  time: "5 min setup",
                  videos: "30 videos",
                  quality: "Professional quality",
                  highlight: true,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl ${
                    card.highlight
                      ? "border border-blue-500/20 bg-blue-500/[0.04]"
                      : "card-hairline"
                  }`}
                >
                  <h3
                    className={`text-[15px] font-semibold mb-3 ${
                      card.highlight ? "text-white/90" : "text-white/60"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <div className="space-y-2 text-[13px]">
                    <div className="text-white/40">{card.price}</div>
                    <div className="text-white/30">{card.time}</div>
                    <div className="text-white/30">{card.videos}</div>
                    <div className="text-white/30">{card.quality}</div>
                  </div>
                  {card.highlight && (
                    <Link
                      href="/auth/signup"
                      className="mt-4 block text-center text-[13px] font-medium py-2.5 rounded-lg bg-white text-[#050508] hover:bg-white/90 transition-all"
                    >
                      Start free trial
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Bottom CTA */}
      <CTASection
        heading="Ready to switch to AI?"
        description="Get 30 professional videos a month for less than the cost of one agency-produced video."
        badge="$79/mo replaces $5,000/mo agencies"
        buttonText="Start free trial"
      />
    </MarketingLayout>
  );
}
