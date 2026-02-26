"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Search,
  Filter,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Calendar,
  Cpu,
  Clock,
  Grid3X3,
  List,
  Video,
} from "lucide-react";

const demoVideos = [
  { id: "1", title: "Weekly Market Update — Downtown Seattle", model: "Kling 2.6", status: "published", contentType: "market_update", date: "Feb 24, 2026", duration: "0:45", views: 2400, platform: "Instagram", color: "from-blue-500/30 to-cyan-500/30" },
  { id: "2", title: "Client Testimonial — Johnson Family", model: "Seedance 2.0", status: "review", contentType: "testimonial", date: "Feb 23, 2026", duration: "0:30", views: 0, platform: "LinkedIn", color: "from-purple-500/30 to-pink-500/30" },
  { id: "3", title: "Property Tour — 1234 Oak Lane", model: "Kling 2.6", status: "scheduled", contentType: "listing", date: "Feb 26, 2026", duration: "0:08", views: 0, platform: "Instagram", color: "from-green-500/30 to-emerald-500/30" },
  { id: "4", title: "Know Your Rights — Tenant Law", model: "Seedance 2.0", status: "published", contentType: "educational", date: "Feb 21, 2026", duration: "1:20", views: 1800, platform: "TikTok", color: "from-orange-500/30 to-red-500/30" },
  { id: "5", title: "Health Tip — Sleep Quality", model: "Kling 2.6", status: "approved", contentType: "educational", date: "Feb 25, 2026", duration: "0:55", views: 0, platform: "YouTube", color: "from-teal-500/30 to-cyan-500/30" },
  { id: "6", title: "Google Review — 5 Star Service", model: "Seedance 2.0", status: "published", contentType: "review_video", date: "Feb 20, 2026", duration: "0:30", views: 3200, platform: "Instagram", color: "from-yellow-500/30 to-orange-500/30" },
  { id: "7", title: "New Listing Alert — Waterfront Condo", model: "Kling 2.6", status: "draft", contentType: "listing", date: "Feb 19, 2026", duration: "0:08", views: 0, platform: "", color: "from-indigo-500/30 to-blue-500/30" },
  { id: "8", title: "Monthly Market Recap — Jan 2026", model: "Seedance 2.0", status: "published", contentType: "market_update", date: "Feb 1, 2026", duration: "1:15", views: 5600, platform: "LinkedIn", color: "from-pink-500/30 to-rose-500/30" },
];

const statusStyles: Record<string, string> = {
  published: "bg-green-500/10 text-green-400",
  review: "bg-yellow-500/10 text-yellow-400",
  scheduled: "bg-blue-500/10 text-blue-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  draft: "bg-gray-500/10 text-gray-400",
  generating: "bg-purple-500/10 text-purple-400",
};

const filters = ["All", "Published", "Review", "Scheduled", "Approved", "Draft"];

export default function ContentPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filtered = demoVideos.filter((v) => {
    if (activeFilter !== "All" && v.status !== activeFilter.toLowerCase()) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Library</h1>
          <p className="text-sm text-white/40 mt-1">{demoVideos.length} videos total</p>
        </div>
        <Link href="/dashboard/generate" className="btn-primary gap-2 text-sm">
          <Video className="w-4 h-4" /> Create New
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 !py-2"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === f
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-white/40 hover:text-white/60 border border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/50"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/50"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((video) => (
            <div key={video.id} className="glass-card-hover overflow-hidden group cursor-pointer">
              <div className={`aspect-video bg-gradient-to-br ${video.color} relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-[#0a0e17]/20" />
                <div className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/50 backdrop-blur rounded-full">
                  <Cpu className="w-2.5 h-2.5" />
                  <span className="text-[10px] font-medium">{video.model}</span>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur rounded text-[10px]">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium truncate">{video.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/30">{video.date}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${statusStyles[video.status]}`}>
                    {video.status}
                  </span>
                </div>
                {video.views > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-white/30">
                    <Eye className="w-3 h-3" /> {video.views.toLocaleString()} views
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden divide-y divide-white/5">
          {filtered.map((video) => (
            <div key={video.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <div className={`w-16 h-10 rounded-lg bg-gradient-to-br ${video.color} flex items-center justify-center flex-shrink-0`}>
                <Play className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{video.title}</div>
                <div className="text-xs text-white/30">{video.model} · {video.duration}</div>
              </div>
              <div className="hidden sm:block text-xs text-white/30">{video.date}</div>
              <div className="hidden sm:block text-xs text-white/30">{video.views > 0 ? `${video.views.toLocaleString()} views` : "—"}</div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${statusStyles[video.status]}`}>
                {video.status}
              </span>
              <button className="p-1 rounded hover:bg-white/5 text-white/30">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
