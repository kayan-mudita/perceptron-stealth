"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import SessionProvider from "@/components/SessionProvider";
import CameraCapture from "@/components/onboarding/CameraCapture";
import CharacterSheetReveal from "@/components/onboarding/CharacterSheetReveal";
import PaywallStep from "@/components/onboarding/PaywallStep";

type Step = "photo" | "character" | "paywall";

const INDUSTRIES = [
  { id: "legal", label: "⚖️ Legal" },
  { id: "real_estate", label: "🏠 Real Estate" },
  { id: "medical", label: "🩺 Medical" },
  { id: "finance", label: "📈 Finance" },
  { id: "creator", label: "🎬 Creator" },
  { id: "business", label: "💼 Business" },
];

const STEP_CONFIG: { key: Step; label: string; emoji: string }[] = [
  { key: "photo", label: "Your photo", emoji: "📸" },
  { key: "character", label: "AI twin", emoji: "🤖" },
  { key: "paywall", label: "Go live", emoji: "🚀" },
];

// ── Ambient background orbs ──────────────────────────────────────────
function AmbientBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(79,110,247,0.12) 0%, transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)" }}
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
    </div>
  );
}

// ── Step bar ──────────────────────────────────────────────────────────
function StepBar({ current }: { current: Step }) {
  const idx = STEP_CONFIG.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-1.5">
      {STEP_CONFIG.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s.key} className="flex items-center gap-1.5">
            {i > 0 && (
              <motion.div
                className="w-8 h-px"
                animate={{ backgroundColor: done ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.08)" }}
                transition={{ duration: 0.5 }}
              />
            )}
            <motion.div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
              animate={{
                backgroundColor: active
                  ? "rgba(99,102,241,0.15)"
                  : done
                    ? "rgba(99,102,241,0.06)"
                    : "transparent",
                borderColor: active
                  ? "rgba(99,102,241,0.35)"
                  : done
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(255,255,255,0.06)",
              }}
              style={{ border: "1px solid" }}
            >
              {done ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3.5 h-3.5 rounded-full bg-indigo-500 flex items-center justify-center"
                >
                  <Check className="w-2 h-2 text-white" />
                </motion.div>
              ) : (
                <span>{s.emoji}</span>
              )}
              <span className={active ? "text-indigo-300" : done ? "text-white/40" : "text-white/15"}>
                {s.label}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

// ── Step headlines ────────────────────────────────────────────────────
const STEP_CONTENT: Record<Step, { heading: string; sub: string }> = {
  photo: {
    heading: "Let's see that face. 📸",
    sub: "One photo. That's all it takes.",
  },
  character: {
    heading: "Building your AI twin... 🤖",
    sub: "Give us 5–8 seconds. You're going to love this.",
  },
  paywall: {
    heading: "Your AI twin is alive. 🔥",
    sub: "Start posting daily. Zero effort.",
  },
};

function trackEvent(event: string, metadata?: Record<string, unknown>) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, metadata }),
  }).catch(() => {});
}

function OnboardingFlow() {
  const [step, setStep] = useState<Step>("photo");
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [industry, setIndustry] = useState("business");
  const [characterSheetUrl, setCharacterSheetUrl] = useState<string | null>(null);

  const handlePhotoCapture = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "photo");

      let uploadedUrl: string;
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (uploadRes.ok) {
        uploadedUrl = (await uploadRes.json()).url;
      } else {
        uploadedUrl = `/uploads/photos/${Date.now()}-${file.name}`;
      }

      await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, url: uploadedUrl, isPrimary: true }),
      });

      trackEvent("onboarding_photo_captured", { industry });
      setPhotoUrl(uploadedUrl);
      setStep("character");
    } catch {
      setStep("character");
    } finally {
      setUploading(false);
    }
  }, [industry]);

  const handleSheetSelect = useCallback((poseUrl: string) => {
    trackEvent("onboarding_character_selected");
    setCharacterSheetUrl(poseUrl);
    setStep("paywall");
  }, []);

  const { heading, sub } = STEP_CONTENT[step];

  return (
    <div className="relative min-h-screen bg-[#060610] flex flex-col overflow-hidden">
      <AmbientBg />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-[12px]">✦</span>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">Official AI</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <StepBar current={step} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-16 pt-2">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step + "-h"}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-8"
            >
              <h1 className="text-[28px] font-extrabold text-white tracking-tight leading-tight">
                {heading}
              </h1>
              <p className="text-[14px] text-white/40 mt-2 font-medium">{sub}</p>
            </motion.div>
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait">

            {step === "photo" && (
              <motion.div
                key="photo"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                {/* Industry picker */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.12em]">
                    What do you do?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((ind, i) => (
                      <motion.button
                        key={ind.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setIndustry(ind.id)}
                        className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${
                          industry === ind.id
                            ? "bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                            : "bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/60 hover:border-white/[0.12]"
                        }`}
                      >
                        {ind.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                <CameraCapture
                  onCapture={handlePhotoCapture}
                  uploading={uploading}
                />
              </motion.div>
            )}

            {step === "character" && photoUrl && (
              <motion.div
                key="character"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <CharacterSheetReveal
                  photoUrl={photoUrl}
                  industry={industry}
                  onSelect={handleSheetSelect}
                />
              </motion.div>
            )}

            {step === "paywall" && (
              <motion.div
                key="paywall"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <PaywallStep characterSheetUrl={characterSheetUrl ?? undefined} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <SessionProvider>
      <OnboardingFlow />
    </SessionProvider>
  );
}
