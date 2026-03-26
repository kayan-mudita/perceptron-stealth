"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Video,
  Eye,
  ArrowRight,
  Play,
  Calendar,
  Wand2,
  CheckCircle2,
  Loader2,
  Film,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Flame,
  Trophy,
  BarChart3,
} from "lucide-react";
import LiveTracker from "@/components/LiveTracker";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  script: string | null;
  model: string;
  status: string;
  contentType: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  duration: number;
  createdAt: string;
  schedule?: { platform: string; scheduledAt: string } | null;
}

const statusStyles: Record<string, string> = {
  published: "bg-green-500/10 text-green-400",
  review: "bg-yellow-500/10 text-yellow-400",
  scheduled: "bg-blue-500/10 text-blue-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  draft: "bg-white/[0.06] text-white/40",
  generating: "bg-purple-500/10 text-purple-400",
};

const modelLabels: Record<string, string> = {
  kling_2_6: "Kling 2.6",
  "kling_2.6": "Kling 2.6",
  seedance_2_0: "Seedance 2.0",
  "seedance_2.0": "Seedance 2.0",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatScheduleDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatContentType(ct: string): string {
  return ct
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Simulated engagement score based on content attributes
function getEngagementScore(video: VideoItem): number {
  let score = 50;
  if (video.status === "published") score += 20;
  if (video.script && video.script.length > 200) score += 15;
  const title = video.title.toLowerCase();
  if (title.includes("market") || title.includes("tip") || title.includes("secret")) score += 10;
  const daysOld = (Date.now() - new Date(video.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld < 7) score += 10;
  const idHash = video.id.charCodeAt(0) + (video.id.length > 1 ? video.id.charCodeAt(1) : 0);
  score += (idHash % 20) - 10;
  return Math.max(10, Math.min(100, score));
}

// Estimate reach based on video attributes (placeholder calculation)
function getEstimatedReach(video: VideoItem): number {
  const baseReach = 500;
  const statusMultiplier = video.status === "published" ? 3 : video.status === "scheduled" ? 1.5 : 1;
  const engagement = getEngagementScore(video);
  return Math.round(baseReach * statusMultiplier * (engagement / 50));
}

interface RoiData {
  videosThisMonth: number;
  hoursSaved: number;
  dollarValueSaved: number;
  roiMultiplier: number;
  subscriptionCost: number;
  plan: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPublishedAt: string | null;
}

export default function OverviewPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [roi, setRoi] = useState<RoiData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/videos").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/schedule").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/analytics/roi").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/streak").then((r) => (r.ok ? r.json() : null)),
    ]).then(([v, s, r, st]) => {
      setVideos(v);
      setSchedules(s);
      setRoi(r);
      setStreak(st);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalVideos = videos.length;
  const publishedCount = videos.filter((v) => v.status === "published").length;
  const scheduledCount = videos.filter((v) => v.status === "scheduled").length;
  const reviewCount = videos.filter((v) => v.status === "review").length;
  const draftCount = videos.filter((v) => v.status === "draft").length;
  const upcomingSchedules = schedules.filter((s: any) => s.status === "scheduled" && new Date(s.scheduledAt) > new Date());
  const recentVideos = videos.slice(0, 5);

  // Portfolio calculations
  const totalEstimatedReach = videos.reduce((sum, v) => sum + getEstimatedReach(v), 0);

  // Best and worst performing videos (by engagement score)
  const videosWithScores = videos.map((v) => ({ ...v, engagementScore: getEngagementScore(v) }));
  const sortedByEngagement = [...videosWithScores].sort((a, b) => b.engagementScore - a.engagementScore);
  const bestPerforming = sortedByEngagement[0] || null;
  const worstPerforming = sortedByEngagement.length > 1 ? sortedByEngagement[sortedByEngagement.length - 1] : null;

  // Content type distribution
  const contentTypeMap: Record<string, number> = {};
  videos.forEach((v) => {
    const ct = v.contentType || "general";
    contentTypeMap[ct] = (contentTypeMap[ct] || 0) + 1;
  });
  const contentTypes = Object.entries(contentTypeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxContentTypeCount = Math.max(...contentTypes.map(([, count]) => count), 1);

  // Most recently published video for LiveTracker
  const mostRecentPublished = videos.find((v) => v.status === "published") || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
      </div>
    );
  }

  // Empty state for brand new users
  if (totalVideos === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] mb-6">
            <Film className="w-7 h-7 text-white/15" />
          </div>
          <h1 className="text-[24px] font-semibold text-white/90 mb-2">Welcome to Official AI</h1>
          <p className="text-[15px] text-white/35 max-w-md mx-auto mb-8">
            Create your first AI video and watch your content library grow.
          </p>
          <Link href="/dashboard/generate" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#050508] text-[14px] font-medium hover:bg-white/90 transition-all">
            <Wand2 className="w-4 h-4" /> Create Your First Video
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-white/40 mt-1">Your content portfolio at a glance</p>
        </div>
        <Link href="/dashboard/generate" className="btn-primary gap-2">
          <Wand2 className="w-4 h-4" /> Create Video
        </Link>
      </div>

      {/* Portfolio Stats with Status Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-4 h-4 text-blue-400/50" />
          </div>
          <div className="text-2xl font-bold text-white">{totalVideos}</div>
          <div className="text-sm text-white/35 mt-0.5">Total Videos</div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {publishedCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">
                {publishedCount} published
              </span>
            )}
            {scheduledCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                {scheduledCount} scheduled
              </span>
            )}
            {draftCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40">
                {draftCount} draft
              </span>
            )}
            {reviewCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                {reviewCount} review
              </span>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-4 h-4 text-purple-400/50" />
          </div>
          <div className="text-2xl font-bold text-white">{formatNumber(totalEstimatedReach)}</div>
          <div className="text-sm text-white/35 mt-0.5">Est. Total Reach</div>
          <div className="text-xs text-white/20 mt-2">
            ~{formatNumber(Math.round(totalEstimatedReach / Math.max(totalVideos, 1)))} avg per video
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400/50" />
          </div>
          <div className="text-2xl font-bold text-white">{publishedCount}</div>
          <div className="text-sm text-white/35 mt-0.5">Published</div>
          <div className="text-xs text-white/20 mt-2">
            {totalVideos > 0 ? Math.round((publishedCount / totalVideos) * 100) : 0}% of total
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-4 h-4 text-cyan-400/50" />
          </div>
          <div className="text-2xl font-bold text-white">{upcomingSchedules.length}</div>
          <div className="text-sm text-white/35 mt-0.5">Scheduled</div>
          <div className="text-xs text-white/20 mt-2">
            {reviewCount} pending review
          </div>
        </div>
      </div>

      {/* Performance Cards: Best & Worst */}
      {bestPerforming && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-green-500/[0.08] bg-green-500/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold text-green-400/80">Best Performing</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Play className="w-4 h-4 text-green-400/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/85 truncate">{bestPerforming.title}</p>
                <p className="text-xs text-white/30 mt-0.5">
                  {formatContentType(bestPerforming.contentType)} · Engagement: {bestPerforming.engagementScore}/100
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-green-400">{formatNumber(getEstimatedReach(bestPerforming))}</div>
                <div className="text-[10px] text-white/25">est. reach</div>
              </div>
            </div>
          </div>

          {worstPerforming && worstPerforming.id !== bestPerforming.id && (
            <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-white/30" />
                <h3 className="text-sm font-semibold text-white/50">Lowest Performing</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-white/15" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/85 truncate">{worstPerforming.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {formatContentType(worstPerforming.contentType)} · Engagement: {worstPerforming.engagementScore}/100
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-white/50">{formatNumber(getEstimatedReach(worstPerforming))}</div>
                  <div className="text-[10px] text-white/25">est. reach</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Type Distribution Chart */}
      {contentTypes.length > 0 && (
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-blue-400/50" />
            <h2 className="text-[15px] font-semibold text-white/90">Content Distribution</h2>
          </div>
          <div className="space-y-3">
            {contentTypes.map(([type, count]) => {
              const widthPercent = (count / maxContentTypeCount) * 100;
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-28 sm:w-36 flex-shrink-0">
                    <span className="text-xs font-medium text-white/50">{formatContentType(type)}</span>
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500/60 to-purple-500/60 transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white/40 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Performance Tracker for Most Recent Published Video */}
      {mostRecentPublished && (
        <LiveTracker video={mostRecentPublished} averageViews={350} />
      )}

      {/* Streak Counter */}
      {streak && (
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                streak.currentStreak > 0
                  ? "bg-orange-500/10"
                  : "bg-white/[0.03]"
              }`}>
                <Flame className={`w-6 h-6 ${
                  streak.currentStreak > 0 ? "text-orange-400" : "text-white/15"
                }`} />
              </div>
              <div>
                {streak.currentStreak > 0 ? (
                  <>
                    <div className="text-[18px] font-bold text-white flex items-center gap-2">
                      {streak.currentStreak}-day streak
                    </div>
                    <div className="text-[13px] text-white/30 mt-0.5 flex items-center gap-2">
                      <Trophy className="w-3 h-3 text-white/20" />
                      Longest streak: {streak.longestStreak} day{streak.longestStreak !== 1 ? "s" : ""}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[15px] font-medium text-white/60">No active streak</div>
                    <div className="text-[13px] text-white/30 mt-0.5">Post today to start your streak</div>
                  </>
                )}
              </div>
            </div>
            {streak.currentStreak === 0 && (
              <Link
                href="/dashboard/generate"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 text-[13px] text-orange-400 hover:bg-orange-500/20 transition-all"
              >
                <Wand2 className="w-3.5 h-3.5" /> Create Video
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ROI Card */}
      {roi && roi.videosThisMonth > 0 && (
        <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-blue-500/[0.06] to-purple-500/[0.04] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/15 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-[15px] sm:text-base font-semibold text-white/90">
                    You saved {roi.hoursSaved} hours and ${roi.dollarValueSaved.toLocaleString()} this month.
                    {roi.roiMultiplier > 0 && (
                      <span className="text-green-400"> That&apos;s {roi.roiMultiplier}x your subscription.</span>
                    )}
                  </p>
                  <p className="text-xs sm:text-sm text-white/35 mt-1">
                    Based on {roi.videosThisMonth} video{roi.videosThisMonth !== 1 ? "s" : ""} created this month at 45 min each
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-6 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400/60" />
                    <span className="text-sm font-medium text-white/60">{roi.hoursSaved}h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-green-400/60" />
                    <span className="text-sm font-medium text-white/60">${roi.dollarValueSaved.toLocaleString()}</span>
                  </div>
                  {roi.roiMultiplier > 0 && (
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-purple-400/60" />
                      <span className="text-sm font-medium text-white/60">{roi.roiMultiplier}x ROI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Content */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.04] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
            <h2 className="text-[15px] font-semibold text-white/90">Recent Content</h2>
            <Link href="/dashboard/content" className="text-sm text-white/30 hover:text-white/50 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentVideos.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-white/25">No videos yet</div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {recentVideos.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.015] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 text-white/15" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate text-white/85">{item.title}</div>
                    <div className="text-xs text-white/25 mt-0.5">
                      {modelLabels[item.model] || item.model}
                    </div>
                  </div>
                  <div className="hidden sm:block text-xs text-white/25">{formatDate(item.createdAt)}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${statusStyles[item.status] || statusStyles.draft}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Schedule */}
        <div className="rounded-xl border border-white/[0.04] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
            <h2 className="text-[15px] font-semibold text-white/90">Upcoming</h2>
            <Link href="/dashboard/calendar" className="text-sm text-white/30 hover:text-white/50 flex items-center gap-1 transition-colors">
              Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcomingSchedules.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-white/25">Nothing scheduled</div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {upcomingSchedules.slice(0, 4).map((item: any) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="text-sm font-medium text-white/85">{item.video?.title || "Untitled"}</div>
                  <div className="text-xs text-white/25 mt-1">
                    {item.platform} · {formatScheduleDate(item.scheduledAt)} · {formatTime(item.scheduledAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending Approvals Banner */}
      {reviewCount > 0 && (
        <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/[0.03] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <CheckCircle2 className="w-5 h-5 text-yellow-400/70 flex-shrink-0" />
              <div>
                <div className="text-[14px] sm:text-[15px] font-medium text-white/85">{reviewCount} video{reviewCount !== 1 ? "s" : ""} awaiting review</div>
                <div className="text-xs sm:text-sm text-white/30">Review and approve before publishing</div>
              </div>
            </div>
            <Link href="/dashboard/approvals" className="flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white/[0.06] text-sm text-white/60 hover:bg-white/[0.1] hover:text-white/80 active:bg-white/[0.15] transition-all flex-shrink-0">
              Review <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
