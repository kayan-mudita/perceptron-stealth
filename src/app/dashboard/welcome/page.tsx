"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Building2, Briefcase } from "lucide-react";
import SessionProvider from "@/components/SessionProvider";

const INDUSTRIES = [
  { value: "real_estate", label: "Real Estate", emoji: "🏠" },
  { value: "legal", label: "Legal / Attorney", emoji: "⚖️" },
  { value: "finance", label: "Finance / Insurance", emoji: "💰" },
  { value: "medical", label: "Healthcare / Medical", emoji: "🏥" },
  { value: "creator", label: "Creator / Influencer", emoji: "🎬" },
  { value: "saas", label: "SaaS / Tech", emoji: "💻" },
  { value: "consulting", label: "Consulting", emoji: "📊" },
  { value: "ecommerce", label: "E-Commerce", emoji: "🛒" },
  { value: "other", label: "Other", emoji: "✨" },
];

function trackEvent(event: string, metadata?: Record<string, unknown>) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, metadata }),
  }).catch(() => {});
}

function WelcomeFlow() {
  const router = useRouter();
  const [industry, setIndustry] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!industry) return;
    setSaving(true);
    trackEvent("onboarding_industry_selected", { industry, company });

    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, company: company || undefined }),
      });
    } catch {
      // Non-blocking — don't prevent dashboard access
    }

    await fetch("/api/onboarding/complete", { method: "POST" }).catch(() => {});
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#060610] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="text-5xl"
          >
            🎉
          </motion.div>
          <h1 className="text-[28px] font-extrabold text-white tracking-tight">
            Welcome to Official AI
          </h1>
          <p className="text-[14px] text-white/40 font-medium">
            One more thing — help us personalize your content.
          </p>
        </div>

        {/* Industry selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[13px] font-semibold text-white/50">
            <Briefcase className="w-3.5 h-3.5" />
            What industry are you in?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {INDUSTRIES.map((ind) => (
              <motion.button
                key={ind.value}
                onClick={() => setIndustry(ind.value)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all text-center ${
                  industry === ind.value
                    ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-[18px]">{ind.emoji}</span>
                <span
                  className={`text-[11px] font-semibold leading-tight ${
                    industry === ind.value ? "text-indigo-300" : "text-white/40"
                  }`}
                >
                  {ind.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Company name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[13px] font-semibold text-white/50">
            <Building2 className="w-3.5 h-3.5" />
            Business name <span className="text-white/20 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Smith & Associates"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleContinue}
          disabled={!industry || saving}
          whileHover={industry && !saving ? { scale: 1.02 } : {}}
          whileTap={industry && !saving ? { scale: 0.97 } : {}}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[15px] font-bold text-white disabled:opacity-35 disabled:cursor-not-allowed transition-all"
          style={
            industry
              ? {
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)",
                  boxShadow: "0 0 25px rgba(99,102,241,0.35)",
                }
              : {
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }
          }
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Enter your dashboard
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        <button
          onClick={() => {
            trackEvent("onboarding_industry_skipped");
            fetch("/api/onboarding/complete", { method: "POST" }).catch(() => {});
            router.push("/dashboard");
          }}
          className="w-full py-2 text-[12px] text-white/15 hover:text-white/30 transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <SessionProvider>
      <WelcomeFlow />
    </SessionProvider>
  );
}
