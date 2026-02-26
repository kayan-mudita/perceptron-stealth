"use client";

import { useState } from "react";
import {
  Play,
  Check,
  X,
  RefreshCw,
  Cpu,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const pendingVideos = [
  {
    id: "1",
    title: "Weekly Market Update — Bellevue Area",
    model: "Kling 2.6",
    contentType: "Market Update",
    script: "This week in Bellevue real estate, we're seeing a 12% increase in buyer activity compared to last month. The average days on market has dropped to just 18 days, signaling a strong seller's market...",
    date: "Feb 25, 2026",
    duration: "0:45",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "2",
    title: "Client Success Story — The Martinez Family",
    model: "Seedance 2.0",
    contentType: "Testimonial",
    script: "When the Martinez family first reached out, they were feeling overwhelmed by the competitive market. Within three weeks, we found them their dream home, 15% under asking price...",
    date: "Feb 24, 2026",
    duration: "0:30",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "3",
    title: "5 Tips for First-Time Homebuyers",
    model: "Kling 2.6",
    contentType: "Educational",
    script: "If you're buying your first home, here are five things you absolutely need to know. Number one: get pre-approved before you start looking. Number two: don't skip the home inspection...",
    date: "Feb 23, 2026",
    duration: "1:15",
    color: "from-green-500/20 to-emerald-500/20",
  },
];

export default function ApprovalsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const current = pendingVideos[currentIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Approvals</h1>
          <p className="text-sm text-white/40 mt-1">
            {pendingVideos.length} videos awaiting your review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/40">
            {currentIndex + 1} of {pendingVideos.length}
          </span>
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(pendingVideos.length - 1, currentIndex + 1))}
            disabled={currentIndex === pendingVideos.length - 1}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="glass-card p-4 flex items-center gap-3 bg-blue-500/5 border-blue-500/10">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <p className="text-sm text-white/60">
          All content requires your explicit approval before publishing. Nothing goes live without your consent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Video Preview - 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card overflow-hidden">
            <div className={`aspect-video bg-gradient-to-br ${current.color} relative flex items-center justify-center`}>
              <div className="absolute inset-0 bg-[#0a0e17]/30" />
              <button className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:scale-105 transition-transform">
                <Play className="w-7 h-7 text-white ml-1" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full">
                <Cpu className="w-3 h-3" />
                <span className="text-xs font-medium">{current.model}</span>
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs">
                {current.duration}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button className="btn-primary flex-1 gap-2">
              <Check className="w-4 h-4" /> Approve
            </button>
            <button className="btn-secondary flex-1 gap-2">
              <RefreshCw className="w-4 h-4" /> Request Changes
            </button>
            <button className="btn-secondary gap-2 text-red-400 border-red-500/10 hover:bg-red-500/5">
              <X className="w-4 h-4" /> Reject
            </button>
          </div>
        </div>

        {/* Details - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h2 className="font-semibold text-lg">{current.title}</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Content Type</span>
                <span className="font-medium">{current.contentType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">AI Model</span>
                <span className="font-medium">{current.model}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Duration</span>
                <span className="font-medium">{current.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Created</span>
                <span className="font-medium">{current.date}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-3">Script</h3>
            <p className="text-sm text-white/50 leading-relaxed">{current.script}</p>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-3">
              <MessageSquare className="w-4 h-4 inline mr-1.5" />
              Feedback (optional)
            </h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add notes or requested changes..."
              className="input-field min-h-[80px] resize-none text-sm"
            />
          </div>

          {/* Schedule after approval */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-3">
              <Calendar className="w-4 h-4 inline mr-1.5" />
              Schedule After Approval
            </h3>
            <select className="input-field !py-2 text-sm mb-3">
              <option value="">Select platform...</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
            </select>
            <input type="datetime-local" className="input-field !py-2 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
