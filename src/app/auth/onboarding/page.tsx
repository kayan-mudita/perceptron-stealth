"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Mic,
  Palette,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import SessionProvider from "@/components/SessionProvider";

type OnboardingStep = "photos" | "voice" | "brand" | "complete";

function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("photos");
  const [uploadedPhotos, setUploadedPhotos] = useState(0);
  const [hasVoice, setHasVoice] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  const steps = [
    { key: "photos", label: "Upload Photos", icon: Camera },
    { key: "voice", label: "Record Voice", icon: Mic },
    { key: "brand", label: "Brand Profile", icon: Palette },
    { key: "complete", label: "Ready!", icon: Sparkles },
  ];

  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 mesh-gradient" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                i < currentIndex ? "bg-green-500 text-white" :
                i === currentIndex ? "bg-blue-500 text-white" :
                "bg-white/10 text-white/30"
              }`}>
                {i < currentIndex ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-1 ${i < currentIndex ? "bg-green-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          {/* Photos step */}
          {step === "photos" && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Upload your photos</h2>
                <p className="text-sm text-white/40 max-w-md mx-auto">
                  Upload 5-10 photos of yourself. These will be used to generate video content featuring your likeness. Phone photos work great!
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-md mx-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setUploadedPhotos(Math.max(uploadedPhotos, i + 1))}
                    className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                      i < uploadedPhotos
                        ? "border-green-500/30 bg-green-500/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {i < uploadedPhotos ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-white/20" />
                    )}
                  </button>
                ))}
              </div>

              <button
                className="btn-secondary gap-2 mx-auto"
                onClick={() => setUploadedPhotos(5)}
              >
                <Upload className="w-4 h-4" /> Upload from Device
              </button>

              <p className="text-xs text-white/20">{uploadedPhotos}/5 photos uploaded (minimum)</p>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep("voice")}
                  disabled={uploadedPhotos < 1}
                  className="btn-primary gap-2 disabled:opacity-30"
                >
                  Next: Record Voice <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Voice step */}
          {step === "voice" && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/15 flex items-center justify-center mx-auto">
                <Mic className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Record your voice</h2>
                <p className="text-sm text-white/40 max-w-md mx-auto">
                  Record a 30-60 second voice sample. Speak naturally — the AI will learn your unique tone and style.
                </p>
              </div>

              {/* Recording UI */}
              <div className="max-w-sm mx-auto">
                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center cursor-pointer transition-all ${
                  recording
                    ? "bg-red-500/20 ring-4 ring-red-500/10 animate-pulse"
                    : hasVoice
                    ? "bg-green-500/20"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                  onClick={() => {
                    if (hasVoice) return;
                    if (recording) {
                      setRecording(false);
                      setHasVoice(true);
                    } else {
                      setRecording(true);
                      setRecordTime(0);
                      const interval = setInterval(() => {
                        setRecordTime((t) => {
                          if (t >= 45) {
                            clearInterval(interval);
                            setRecording(false);
                            setHasVoice(true);
                            return 45;
                          }
                          return t + 1;
                        });
                      }, 1000);
                    }
                  }}
                >
                  {hasVoice ? (
                    <Check className="w-10 h-10 text-green-400" />
                  ) : (
                    <Mic className={`w-10 h-10 ${recording ? "text-red-400" : "text-white/40"}`} />
                  )}
                </div>
                <div className="mt-3 text-sm text-white/40">
                  {recording
                    ? `Recording... ${recordTime}s`
                    : hasVoice
                    ? "Voice sample recorded!"
                    : "Tap to start recording"
                  }
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep("photos")} className="btn-secondary gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep("brand")}
                  disabled={!hasVoice}
                  className="btn-primary gap-2 disabled:opacity-30"
                >
                  Next: Brand Profile <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Brand step */}
          {step === "brand" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Tell us about your brand</h2>
                <p className="text-sm text-white/40 max-w-md mx-auto">
                  Help the AI understand your business so it creates on-brand content.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Business / Brand Name</label>
                  <input type="text" placeholder="e.g., Rockwell Realty Group" className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">What do you do?</label>
                  <textarea placeholder="Brief description of your business and what makes you unique..." className="input-field min-h-[80px] resize-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Who is your target audience?</label>
                  <input type="text" placeholder="e.g., First-time homebuyers in Seattle" className="input-field text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Preferred tone</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Professional", "Friendly", "Educational", "Casual"].map((tone) => (
                      <button key={tone} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 text-sm transition-all">
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep("voice")} className="btn-secondary gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep("complete")} className="btn-primary gap-2">
                  Complete Setup <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Complete step */}
          {step === "complete" && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">You&apos;re all set!</h2>
                <p className="text-sm text-white/40 max-w-md mx-auto">
                  Your AI marketing teammate is ready. We&apos;ll start generating your first batch of content using Kling 2.6 and Seedance 2.0.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-lg font-bold gradient-text">5</div>
                  <div className="text-[10px] text-white/30">Photos</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-lg font-bold gradient-text">1</div>
                  <div className="text-[10px] text-white/30">Voice Sample</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-lg font-bold gradient-text">✓</div>
                  <div className="text-[10px] text-white/30">Brand Profile</div>
                </div>
              </div>

              <button
                onClick={() => router.push("/dashboard/overview")}
                className="btn-primary gap-2 text-lg"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
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
