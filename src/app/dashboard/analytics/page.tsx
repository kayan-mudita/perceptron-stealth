"use client";

import {
  Eye,
  Heart,
  Share2,
  MessageSquare,
  TrendingUp,
  Video,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";

const overviewStats = [
  { label: "Total Views", value: "14,247", change: "+23%", trend: "up", icon: Eye, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Total Likes", value: "2,831", change: "+18%", trend: "up", icon: Heart, color: "text-pink-400", bg: "bg-pink-500/10" },
  { label: "Total Shares", value: "847", change: "+35%", trend: "up", icon: Share2, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Comments", value: "412", change: "+12%", trend: "up", icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10" },
];

const weeklyData = [
  { week: "Week 1", views: 1200, likes: 280, shares: 85 },
  { week: "Week 2", views: 2100, likes: 420, shares: 130 },
  { week: "Week 3", views: 3400, likes: 560, shares: 210 },
  { week: "Week 4", views: 4800, likes: 780, shares: 290 },
];

const topContent = [
  { title: "Monthly Market Recap — Jan 2026", views: 5600, likes: 890, shares: 234, model: "Seedance 2.0", platform: "LinkedIn" },
  { title: "Google Review — 5 Star Service", views: 3200, likes: 540, shares: 178, model: "Seedance 2.0", platform: "Instagram" },
  { title: "Weekly Market Update — Downtown", views: 2400, likes: 380, shares: 120, model: "Kling 2.6", platform: "Instagram" },
  { title: "Know Your Rights — Tenant Law", views: 1800, likes: 290, shares: 95, model: "Seedance 2.0", platform: "TikTok" },
  { title: "First-Time Buyer Tips", views: 1247, likes: 231, shares: 67, model: "Kling 2.6", platform: "YouTube" },
];

const platformBreakdown = [
  { platform: "Instagram", views: 5800, percentage: 41, color: "bg-pink-500" },
  { platform: "LinkedIn", views: 4200, percentage: 29, color: "bg-blue-500" },
  { platform: "TikTok", views: 2400, percentage: 17, color: "bg-cyan-500" },
  { platform: "YouTube", views: 1247, percentage: 9, color: "bg-red-500" },
  { platform: "Facebook", views: 600, percentage: 4, color: "bg-indigo-500" },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-white/40 mt-1">Track your content performance across all platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary !py-2 text-xs gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Last 30 Days
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {stat.trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Growth Chart (simplified bar chart) */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Weekly Growth</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" /> Views</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-400" /> Likes</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Shares</span>
            </div>
          </div>

          <div className="space-y-4">
            {weeklyData.map((week, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
                  <span>{week.week}</span>
                  <span>{week.views.toLocaleString()} views</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400" style={{ width: `${(week.views / 5000) * 100}%` }} />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-1.5 rounded-full bg-pink-400" style={{ width: `${(week.likes / 800) * 30}%` }} />
                    <div className="h-1.5 rounded-full bg-cyan-400" style={{ width: `${(week.shares / 300) * 20}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-6">Platform Breakdown</h3>
          <div className="space-y-4">
            {platformBreakdown.map((platform, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{platform.platform}</span>
                  <span className="text-white/40">{platform.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full ${platform.color}`} style={{ width: `${platform.percentage}%` }} />
                </div>
                <div className="text-xs text-white/30 mt-1">{platform.views.toLocaleString()} views</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="font-semibold">Top Performing Content</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-white/30 px-5 py-3">Video</th>
                <th className="text-left text-xs font-medium text-white/30 px-3 py-3">Model</th>
                <th className="text-left text-xs font-medium text-white/30 px-3 py-3">Platform</th>
                <th className="text-right text-xs font-medium text-white/30 px-3 py-3">Views</th>
                <th className="text-right text-xs font-medium text-white/30 px-3 py-3">Likes</th>
                <th className="text-right text-xs font-medium text-white/30 px-5 py-3">Shares</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topContent.map((video, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium">{video.title}</td>
                  <td className="px-3 py-3 text-xs text-white/40">{video.model}</td>
                  <td className="px-3 py-3 text-xs text-white/40">{video.platform}</td>
                  <td className="px-3 py-3 text-sm text-right">{video.views.toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm text-right text-pink-400">{video.likes.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-right text-cyan-400">{video.shares.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
