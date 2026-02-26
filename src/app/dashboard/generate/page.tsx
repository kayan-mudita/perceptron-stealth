"use client";

import { useState } from "react";
import {
  Wand2,
  Camera,
  Mic,
  Video,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Play,
  RefreshCw,
  Cpu,
  Zap,
  MessageSquare,
  FileText,
  Star,
  ImageIcon,
  Volume2,
} from "lucide-react";

type Step = "content" | "photo" | "voice" | "model" | "generate" | "preview";

const contentTypes = [
  { id: "general", label: "Brand Video", desc: "Introduce yourself or share expertise", icon: Video },
  { id: "market_update", label: "Market Update", desc: "Weekly industry insights and trends", icon: FileText },
  { id: "testimonial", label: "Client Testimonial", desc: "Turn a review into a video story", icon: Star },
  { id: "educational", label: "Educational Content", desc: "Tips, how-tos, and explainers", icon: MessageSquare },
  { id: "listing", label: "Property / Service", desc: "Showcase a listing or service offering", icon: ImageIcon },
  { id: "review_video", label: "Google Review Video", desc: "Transform a Google review into video", icon: Star },
];

const demoPhotos = [
  { id: "p1", name: "Professional Headshot", primary: true },
  { id: "p2", name: "Office Shot", primary: false },
  { id: "p3", name: "Casual Portrait", primary: false },
];

const demoVoices = [
  { id: "v1", name: "Primary Voice Sample", duration: "0:45", isDefault: true },
  { id: "v2", name: "Formal Tone", duration: "0:30", isDefault: false },
];

export default function GeneratePage() {
  const [step, setStep] = useState<Step>("content");
  const [contentType, setContentType] = useState("");
  const [script, setScript] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("p1");
  const [selectedVoice, setSelectedVoice] = useState("v1");
  const [selectedModel, setSelectedModel] = useState<"kling_2.6" | "seedance_2.0">("kling_2.6");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [googleReview, setGoogleReview] = useState("");

  const steps: { key: Step; label: string; icon: any }[] = [
    { key: "content", label: "Content", icon: FileText },
    { key: "photo", label: "Photo", icon: Camera },
    { key: "voice", label: "Voice", icon: Mic },
    { key: "model", label: "AI Model", icon: Cpu },
    { key: "generate", label: "Generate", icon: Wand2 },
    { key: "preview", label: "Preview", icon: Play },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setStep("preview");
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Video</h1>
        <p className="text-sm text-white/40 mt-1">
          Your AI teammate will generate a video using your photo and voice
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <button
              onClick={() => i <= currentStepIndex && setStep(s.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                step === s.key
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : i < currentStepIndex
                  ? "bg-green-500/10 text-green-400 cursor-pointer"
                  : "text-white/30"
              }`}
            >
              {i < currentStepIndex ? (
                <Check className="w-4 h-4" />
              ) : (
                <s.icon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-6 h-px mx-1 ${i < currentStepIndex ? "bg-green-500/30" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="glass-card p-6 sm:p-8">
        {/* Step 1: Content Type & Script */}
        {step === "content" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">What type of content?</h2>
              <p className="text-sm text-white/40">Choose the type of video you want to create</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    contentType === type.id
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                >
                  <type.icon className={`w-5 h-5 mb-2 ${contentType === type.id ? "text-blue-400" : "text-white/40"}`} />
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-white/30 mt-0.5">{type.desc}</div>
                </button>
              ))}
            </div>

            {contentType === "review_video" && (
              <div>
                <label className="block text-sm font-medium mb-2">Paste Google Review</label>
                <textarea
                  value={googleReview}
                  onChange={(e) => setGoogleReview(e.target.value)}
                  placeholder="Paste the text from a Google review here. The AI will transform it into a compelling video testimonial..."
                  className="input-field min-h-[100px] resize-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Script / Talking Points
                <span className="text-white/30 font-normal ml-2">
                  (optional — AI will generate if left blank)
                </span>
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Tell the AI what you want to say in this video, or leave blank and let your AI teammate write the script based on your brand voice..."
                className="input-field min-h-[120px] resize-none"
              />
              <div className="flex items-center gap-2 mt-3">
                <button className="btn-secondary !py-2 !px-4 text-xs gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-Generate Script
                </button>
                <span className="text-xs text-white/20">AI writes based on your brand profile</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep("photo")}
                disabled={!contentType}
                className="btn-primary gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next: Choose Photo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Photo Selection */}
        {step === "photo" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Choose your photo</h2>
              <p className="text-sm text-white/40">Select a photo from your Vault, or upload a new one</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {demoPhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.id)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPhoto === photo.id
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white/30" />
                  </div>
                  {photo.primary && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold">
                      Primary
                    </div>
                  )}
                  {selectedPhoto === photo.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-3 py-2">
                    <div className="text-xs font-medium truncate">{photo.name}</div>
                  </div>
                </button>
              ))}

              {/* Upload new */}
              <button className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-2 transition-colors">
                <Upload className="w-6 h-6 text-white/30" />
                <span className="text-xs text-white/30">Upload New</span>
              </button>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep("content")} className="btn-secondary gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep("voice")} className="btn-primary gap-2">
                Next: Voice <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Voice Selection */}
        {step === "voice" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Select your voice</h2>
              <p className="text-sm text-white/40">Choose which voice sample to use for this video</p>
            </div>

            <div className="space-y-3">
              {demoVoices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    selectedVoice === voice.id
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedVoice === voice.id ? "bg-blue-500/20" : "bg-white/5"
                  }`}>
                    <Volume2 className={`w-5 h-5 ${selectedVoice === voice.id ? "text-blue-400" : "text-white/40"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{voice.name}</div>
                    <div className="text-xs text-white/30 mt-0.5">Duration: {voice.duration}</div>
                  </div>
                  {voice.isDefault && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Default</span>
                  )}
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Play className="w-4 h-4 text-white/60" />
                  </button>
                </button>
              ))}

              {/* Record new */}
              <button className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Record New Sample</div>
                  <div className="text-xs text-white/30">Record a 30-60 second voice sample</div>
                </div>
              </button>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep("photo")} className="btn-secondary gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep("model")} className="btn-primary gap-2">
                Next: Choose AI Model <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Model Selection */}
        {step === "model" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Choose AI Model</h2>
              <p className="text-sm text-white/40">Select the generation engine for this video</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kling 2.6 */}
              <button
                onClick={() => setSelectedModel("kling_2.6")}
                className={`p-6 rounded-xl text-left border transition-all ${
                  selectedModel === "kling_2.6"
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Kling 2.6</div>
                    <div className="text-xs text-white/30">Hyper-Realistic Generation</div>
                  </div>
                  {selectedModel === "kling_2.6" && (
                    <Check className="w-5 h-5 text-blue-400 ml-auto" />
                  )}
                </div>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-blue-400" /> 4K photorealistic output</li>
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-blue-400" /> Advanced lip-sync technology</li>
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-blue-400" /> Natural human motion</li>
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-blue-400" /> Best for: testimonials, professional content</li>
                </ul>
                <div className="mt-4 text-xs text-white/20">Avg. generation: ~2 minutes</div>
              </button>

              {/* Seedance 2.0 */}
              <button
                onClick={() => setSelectedModel("seedance_2.0")}
                className={`p-6 rounded-xl text-left border transition-all ${
                  selectedModel === "seedance_2.0"
                    ? "bg-purple-500/10 border-purple-500/30"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Seedance 2.0</div>
                    <div className="text-xs text-white/30">Creative & Dynamic</div>
                  </div>
                  {selectedModel === "seedance_2.0" && (
                    <Check className="w-5 h-5 text-purple-400 ml-auto" />
                  )}
                </div>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-purple-400" /> Multiple visual styles</li>
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-purple-400" /> Dynamic transitions & effects</li>
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-purple-400" /> Social-optimized output</li>
                  <li className="flex items-center gap-2"><Check className="w-3 h-3 text-purple-400" /> Best for: reels, trending content</li>
                </ul>
                <div className="mt-4 text-xs text-white/20">Avg. generation: ~90 seconds</div>
              </button>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep("voice")} className="btn-secondary gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => { setStep("generate"); handleGenerate(); }} className="btn-primary gap-2">
                <Wand2 className="w-4 h-4" /> Generate Video
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Generating */}
        {step === "generate" && (
          <div className="py-16 text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto">
              <RefreshCw className={`w-8 h-8 text-blue-400 ${generating ? "animate-spin" : ""}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {generating ? "Generating your video..." : "Video generated!"}
              </h2>
              <p className="text-sm text-white/40 max-w-md mx-auto">
                {generating
                  ? `${selectedModel === "kling_2.6" ? "Kling 2.6" : "Seedance 2.0"} is creating your video. This usually takes about ${selectedModel === "kling_2.6" ? "2 minutes" : "90 seconds"}.`
                  : "Your video is ready for preview"}
              </p>
            </div>
            {generating && (
              <div className="max-w-xs mx-auto">
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" style={{ width: "60%" }} />
                </div>
                <div className="text-xs text-white/20 mt-2">Processing with {selectedModel === "kling_2.6" ? "Kling 2.6" : "Seedance 2.0"}...</div>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Preview */}
        {step === "preview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Preview Your Video</h2>
              <p className="text-sm text-white/40">Review the generated video before approving or scheduling</p>
            </div>

            {/* Video preview */}
            <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#0a0e17]/50" />
              <button className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:scale-105 transition-transform">
                <Play className="w-7 h-7 text-white ml-1" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full">
                <Cpu className="w-3 h-3" />
                <span className="text-xs font-medium">{selectedModel === "kling_2.6" ? "Kling 2.6" : "Seedance 2.0"}</span>
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs">0:08</div>
            </div>

            {/* Video details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-xs text-white/30 mb-1">Model</div>
                <div className="text-sm font-medium">{selectedModel === "kling_2.6" ? "Kling 2.6" : "Seedance 2.0"}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-xs text-white/30 mb-1">Duration</div>
                <div className="text-sm font-medium">8 seconds (1 clip)</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-xs text-white/30 mb-1">Content Type</div>
                <div className="text-sm font-medium capitalize">{contentType.replace("_", " ")}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
              <button className="btn-primary flex-1 gap-2">
                <Check className="w-4 h-4" /> Approve & Schedule
              </button>
              <button className="btn-secondary flex-1 gap-2">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
              <button className="btn-secondary gap-2 text-red-400 border-red-500/10 hover:bg-red-500/5">
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
