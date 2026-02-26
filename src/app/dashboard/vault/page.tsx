"use client";

import { useState } from "react";
import {
  Shield,
  Camera,
  Mic,
  Upload,
  Play,
  Pause,
  Trash2,
  Star,
  Check,
  AlertCircle,
  Lock,
  Eye,
  Palette,
  User,
  Volume2,
  ImageIcon,
} from "lucide-react";

const tabs = [
  { id: "photos", label: "Photos", icon: Camera },
  { id: "voice", label: "Voice Samples", icon: Mic },
  { id: "brand", label: "Brand Profile", icon: Palette },
];

const demoPhotos = [
  { id: "p1", name: "Professional Headshot", isPrimary: true, date: "Feb 15, 2026" },
  { id: "p2", name: "Office Environment", isPrimary: false, date: "Feb 15, 2026" },
  { id: "p3", name: "Casual Portrait", isPrimary: false, date: "Feb 16, 2026" },
  { id: "p4", name: "Event Photo", isPrimary: false, date: "Feb 18, 2026" },
  { id: "p5", name: "Team Photo", isPrimary: false, date: "Feb 20, 2026" },
];

const demoVoices = [
  { id: "v1", name: "Primary Voice — Professional Tone", duration: "0:45", isDefault: true, date: "Feb 15, 2026" },
  { id: "v2", name: "Casual Tone", duration: "0:30", isDefault: false, date: "Feb 16, 2026" },
  { id: "v3", name: "Energetic / Social Media", duration: "0:35", isDefault: false, date: "Feb 20, 2026" },
];

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState("photos");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold">Vault</h1>
        </div>
        <p className="text-sm text-white/40">
          Your secure digital identity — photos, voice samples, and brand assets. You retain full ownership and control.
        </p>
      </div>

      {/* Consent notice */}
      <div className="glass-card p-4 flex items-start gap-3 bg-green-500/5 border-green-500/10">
        <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-medium text-green-400">Your data is secure</div>
          <p className="text-xs text-white/40 mt-0.5">
            All assets are encrypted and stored securely. We never share, sell, or train on your data. You can revoke consent and delete everything at any time.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue-500/15 text-blue-400"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Photos Tab */}
      {activeTab === "photos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{demoPhotos.length} photos uploaded</h3>
            <button className="btn-primary gap-2 text-sm !py-2">
              <Upload className="w-4 h-4" /> Upload Photos
            </button>
          </div>
          <p className="text-xs text-white/30">Upload 5-10 photos of yourself. These are used to generate video content featuring your likeness.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {demoPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-white/5 overflow-hidden flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white/20" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {photo.isPrimary && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-500/80 text-[10px] font-semibold flex items-center gap-1">
                    <Star className="w-2.5 h-2.5" /> Primary
                  </div>
                )}
                <div className="mt-2">
                  <div className="text-xs font-medium truncate">{photo.name}</div>
                  <div className="text-[10px] text-white/30">{photo.date}</div>
                </div>
              </div>
            ))}

            {/* Upload placeholder */}
            <button className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-2 transition-colors">
              <Upload className="w-6 h-6 text-white/20" />
              <span className="text-xs text-white/20">Add Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* Voice Tab */}
      {activeTab === "voice" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{demoVoices.length} voice samples</h3>
            <button className="btn-primary gap-2 text-sm !py-2">
              <Mic className="w-4 h-4" /> Record New Sample
            </button>
          </div>
          <p className="text-xs text-white/30">Record 30-60 second voice samples. The AI learns your unique vocal patterns for authentic narration.</p>

          <div className="space-y-3">
            {demoVoices.map((voice) => (
              <div key={voice.id} className="glass-card p-4 flex items-center gap-4">
                <button
                  onClick={() => setPlayingVoice(playingVoice === voice.id ? null : voice.id)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    playingVoice === voice.id ? "bg-blue-500/20" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {playingVoice === voice.id ? (
                    <Pause className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Play className="w-5 h-5 text-white/50 ml-0.5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {voice.name}
                    {voice.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">Default</span>
                    )}
                  </div>
                  <div className="text-xs text-white/30 mt-0.5">Duration: {voice.duration} · Added: {voice.date}</div>
                  {/* Waveform placeholder */}
                  <div className="flex items-center gap-0.5 mt-2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full ${
                          playingVoice === voice.id && i < 20 ? "bg-blue-400" : "bg-white/10"
                        }`}
                        style={{ height: `${8 + Math.random() * 16}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!voice.isDefault && (
                    <button className="text-xs text-white/30 hover:text-white/50 px-2 py-1 rounded-lg hover:bg-white/5">
                      Set Default
                    </button>
                  )}
                  <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recording interface placeholder */}
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="font-semibold mb-1">Record a New Voice Sample</h3>
            <p className="text-sm text-white/40 max-w-md mx-auto mb-4">
              Click the button below to start recording. Speak naturally for 30-60 seconds about any topic.
            </p>
            <button className="btn-primary gap-2">
              <Mic className="w-4 h-4" /> Start Recording
            </button>
          </div>
        </div>
      )}

      {/* Brand Tab */}
      {activeTab === "brand" && (
        <div className="space-y-6">
          <p className="text-xs text-white/30">Your brand profile helps the AI create content that matches your voice, style, and audience.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Business Info
              </h3>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Brand / Business Name</label>
                <input type="text" placeholder="Your business name" className="input-field !py-2 text-sm" defaultValue="Rockwell Realty Group" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Tagline</label>
                <input type="text" placeholder="Your tagline" className="input-field !py-2 text-sm" defaultValue="Your trusted Seattle real estate partner" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Industry</label>
                <select className="input-field !py-2 text-sm">
                  <option value="real_estate">Real Estate</option>
                  <option value="legal">Legal / Attorney</option>
                  <option value="medical">Medical / Healthcare</option>
                  <option value="creator">Creator / Consultant</option>
                </select>
              </div>
            </div>

            <div className="glass-card p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" /> Voice & Tone
              </h3>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Tone of Voice</label>
                <select className="input-field !py-2 text-sm">
                  <option value="professional">Professional & Authoritative</option>
                  <option value="friendly">Friendly & Approachable</option>
                  <option value="casual">Casual & Conversational</option>
                  <option value="educational">Educational & Informative</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Target Audience</label>
                <input type="text" placeholder="Who are you trying to reach?" className="input-field !py-2 text-sm" defaultValue="First-time homebuyers in Seattle area, ages 28-45" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Competitors</label>
                <input type="text" placeholder="Key competitors (comma separated)" className="input-field !py-2 text-sm" defaultValue="Windermere, Compass, Redfin" />
              </div>
            </div>

            <div className="md:col-span-2 glass-card p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4 text-green-400" /> Brand Guidelines
              </h3>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Brand Colors</label>
                <div className="flex gap-2">
                  {["#4c6ef5", "#7c3aed", "#06b6d4", "#ffffff"].map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button className="w-8 h-8 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 text-sm hover:border-white/20">+</button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Additional Guidelines</label>
                <textarea
                  placeholder="Any specific brand guidelines, topics to avoid, preferred messaging..."
                  className="input-field min-h-[80px] resize-none text-sm"
                  defaultValue="Always emphasize local market expertise. Never use high-pressure sales language. Focus on education and trust-building."
                />
              </div>
              <button className="btn-primary gap-2 text-sm !py-2.5">
                <Check className="w-4 h-4" /> Save Brand Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
