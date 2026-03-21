"use client";

import Link from "next/link";
import { ArrowRight, Play, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/90 backdrop-blur-md border-b border-white/[0.03]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <span className="text-[15px] font-semibold tracking-tight">
            Official <span className="text-blue-400">AI</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-[13px] text-white/40 hover:text-white/60 transition-colors">Log in</Link>
            <Link href="/auth/signup" className="text-[13px] px-4 py-2 rounded-lg bg-white text-[#050508] font-medium hover:bg-white/90 transition-colors">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[44px] sm:text-[56px] font-semibold tracking-tight leading-[1.1] text-white mb-5">
            AI video content<br />
            that looks like you<br />
            made it yourself
          </h1>
          <p className="text-[17px] text-white/35 max-w-lg mx-auto mb-10 leading-relaxed">
            Upload a few photos. Get weekly social media videos featuring your face and voice. No filming, no editing, no crew.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#050508] text-[15px] font-medium hover:bg-white/90 transition-all">
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/[0.06] text-[15px] text-white/50 hover:text-white/70 hover:border-white/10 transition-all">
              <Play className="w-4 h-4" /> See it work
            </a>
          </div>
          <p className="text-[13px] text-white/20">No credit card required</p>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-white/[0.03] py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "90%", label: "less time creating" },
            { value: "60x", label: "more views" },
            { value: "5 min", label: "setup time" },
            { value: "$79/mo", label: "starting price" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-[28px] font-semibold text-white">{s.value}</div>
              <div className="text-[13px] text-white/25 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[13px] text-white/25 mb-3">How it works</p>
          <h2 className="text-[32px] font-semibold tracking-tight text-white mb-16">Three steps. Five minutes. Done.</h2>

          <div className="space-y-6">
            {[
              {
                num: "1",
                title: "Upload your photos",
                desc: "Selfies, headshots, casual shots — 1-3 photos from your phone. The AI builds a 3D character model of you that stays consistent across every video.",
              },
              {
                num: "2",
                title: "Tell it what to create",
                desc: "Type what you want — \"market update for Seattle\" or \"client testimonial video.\" The AI writes the script, plans the shots, and picks the hook that'll stop the scroll.",
              },
              {
                num: "3",
                title: "Review, approve, publish",
                desc: "Every video goes through your approval queue. Approve it, schedule it, and it auto-publishes to Instagram, TikTok, LinkedIn, YouTube, and Facebook.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6 p-6 rounded-2xl border border-white/[0.03] hover:border-white/[0.06] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-[15px] font-semibold text-white/30 flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white/90 mb-2">{step.title}</h3>
                  <p className="text-[14px] text-white/35 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 px-6 border-t border-white/[0.03]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[13px] text-white/25 mb-3">What you get</p>
          <h2 className="text-[32px] font-semibold tracking-tight text-white mb-16">A content team that never sleeps</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "AI video generation", desc: "Multiple AI models (Kling 2.6, Seedance 2.0, Sora 2) generate studio-quality video from your photos." },
              { title: "Multi-cut composition", desc: "Every video is 3-8 separate cuts stitched together — hook, main point, b-roll, CTA. Never one-shot AI slop." },
              { title: "Auto-posting", desc: "Schedule and publish to Instagram, TikTok, LinkedIn, YouTube, and Facebook from one dashboard." },
              { title: "Smart scripts", desc: "AI writes scripts using proven content frameworks from top creators. Hooks that stop the scroll." },
              { title: "Your face, your voice", desc: "Character sheets + voice cloning ensure every video looks and sounds like you. Not a generic avatar." },
              { title: "Analytics", desc: "Track views, likes, shares, and comments across all platforms in one place." },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/[0.03]">
                <h3 className="text-[15px] font-medium text-white/80 mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-white/30 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 px-6 border-t border-white/[0.03]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[13px] text-white/25 mb-3">Built for</p>
          <h2 className="text-[32px] font-semibold tracking-tight text-white mb-16">Professionals who need to be everywhere</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Real Estate", desc: "Listing tours, market updates, testimonials" },
              { title: "Legal", desc: "Know-your-rights, case results, legal tips" },
              { title: "Medical", desc: "Health tips, procedure explainers, wellness" },
              { title: "Creators", desc: "Brand intros, thought leadership, tips" },
            ].map((ind, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/[0.03]">
                <h3 className="text-[15px] font-medium text-white/80 mb-1.5">{ind.title}</h3>
                <p className="text-[12px] text-white/25 leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-white/[0.03]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-semibold tracking-tight text-white mb-3">Simple pricing</h2>
            <p className="text-[15px] text-white/30">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { name: "Professional", price: "$79", features: ["3 videos/month", "Voice cloning", "500 AI images", "Review-to-video"] },
              { name: "Authority", price: "$199", features: ["8 videos/month", "1,500 AI images", "10 team members", "Content strategy"], popular: true },
              { name: "Expert", price: "$375", features: ["40+ videos/month", "Dedicated strategist", "Content calendar", "Replaces agency"] },
            ].map((plan, i) => (
              <div key={i} className={`p-6 rounded-xl border ${plan.popular ? "border-white/[0.1] bg-white/[0.02]" : "border-white/[0.03]"}`}>
                {plan.popular && <div className="text-[11px] text-blue-400 font-medium mb-3">Most popular</div>}
                <h3 className="text-[15px] font-semibold text-white/90">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-5">
                  <span className="text-[28px] font-semibold text-white">{plan.price}</span>
                  <span className="text-[13px] text-white/25">/mo</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="w-3.5 h-3.5 text-white/20 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className={`block text-center text-[13px] py-2.5 rounded-lg transition-all ${
                  plan.popular
                    ? "bg-white text-[#050508] font-medium hover:bg-white/90"
                    : "border border-white/[0.06] text-white/50 hover:text-white/70 hover:border-white/10"
                }`}>
                  Start free trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/[0.03]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[32px] font-semibold tracking-tight text-white mb-4">Ready to stop filming?</h2>
          <p className="text-[15px] text-white/30 mb-8">Upload your photos. Get your first video in 5 minutes.</p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#050508] text-[15px] font-medium hover:bg-white/90 transition-all">
            Start free trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.03] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[13px] text-white/20">Official AI</span>
          <span className="text-[12px] text-white/15">&copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}
