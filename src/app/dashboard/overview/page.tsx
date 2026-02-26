"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  Eye,
  Heart,
  Share2,
  Clock,
  CheckCircle2,
  TrendingUp,
  Wand2,
  ArrowRight,
  Play,
  Calendar,
  BarChart3,
} from "lucide-react";

// Demo data for the dashboard
const statsCards = [
  { label: "Total Videos", value: "24", icon: Video, change: "+3 this week", color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Total Views", value: "14.2K", icon: Eye, change: "+60x growth", color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Engagement", value: "2.8K", icon: Heart, change: "+10x likes", color: "text-pink-400", bg: "bg-pink-500/10" },
  { label: "Shares", value: "847", icon: Share2, change: "+8x increase", color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

const recentContent = [
  { id: 1, title: "Weekly Market Update — Downtown", model: "Kling 2.6", status: "published", date: "Feb 24", views: "2.4K", platform: "Instagram" },
  { id: 2, title: "Client Testimonial — Johnson Family", model: "Seedance 2.0", status: "review", date: "Feb 23", views: "—", platform: "LinkedIn" },
  { id: 3, title: "Property Tour — 1234 Oak Lane", model: "Kling 2.6", status: "scheduled", date: "Feb 26", views: "—", platform: "Instagram" },
  { id: 4, title: "Know Your Rights — Tenant Law", model: "Seedance 2.0", status: "published", date: "Feb 21", views: "1.8K", platform: "TikTok" },
  { id: 5, title: "Health Tip — Sleep Quality", model: "Kling 2.6", status: "approved", date: "Feb 25", views: "—", platform: "YouTube" },
];

const upcomingSchedule = [
  { day: "Mon", date: "Feb 24", title: "Market Analysis Video", platform: "Instagram", time: "10:00 AM" },
  { day: "Wed", date: "Feb 26", title: "Property Tour — Oak Lane", platform: "Instagram", time: "2:00 PM" },
  { day: "Fri", date: "Feb 28", title: "Client Story Highlight", platform: "LinkedIn", time: "9:00 AM" },
];

const statusStyles: Record<string, string> = {
  published: "bg-green-500/10 text-green-400",
  review: "bg-yellow-500/10 text-yellow-400",
  scheduled: "bg-blue-500/10 text-blue-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  draft: "bg-gray-500/10 text-gray-400",
  generating: "bg-purple-500/10 text-purple-400",
};

export default function OverviewPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-white/40 mt-1">
            Here&apos;s what&apos;s happening with your content this week
          </p>
        </div>
        <Link href="/dashboard/generate" className="btn-primary gap-2">
          <Wand2 className="w-4 h-4" />
          Create New Video
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-white/40 mt-0.5">{stat.label}</div>
            <div className="text-xs text-green-400 mt-2">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Content */}
        <div className="lg:col-span-2 glass-card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold">Recent Content</h2>
            <Link href="/dashboard/content" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentContent.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.title}</div>
                  <div className="text-xs text-white/30 mt-0.5">
                    {item.model} · {item.platform}
                  </div>
                </div>
                <div className="text-xs text-white/30">{item.date}</div>
                <div className="text-xs text-white/30 w-12 text-right">{item.views}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusStyles[item.status]}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="glass-card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h2 className="font-semibold">Upcoming Posts</h2>
            <Link href="/dashboard/calendar" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {upcomingSchedule.map((item, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 text-center">
                    <div className="text-xs text-white/30 uppercase">{item.day}</div>
                    <div className="text-sm font-bold">{item.date.split(" ")[1]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-white/30 mt-0.5">
                      {item.platform} · {item.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/5">
            <Link
              href="/dashboard/calendar"
              className="btn-secondary w-full gap-2 !py-2.5 text-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              View Full Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Approvals Banner */}
      <div className="glass-card p-5 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-yellow-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="font-semibold">3 videos awaiting your approval</div>
              <div className="text-sm text-white/40">Review and approve content before it goes live</div>
            </div>
          </div>
          <Link href="/dashboard/approvals" className="btn-primary !py-2 gap-2 text-xs">
            Review Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
