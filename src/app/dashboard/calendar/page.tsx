"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  Cpu,
  Sparkles,
  Zap,
  RefreshCw,
  Check,
  X,
  Calendar as CalendarIcon,
  TrendingUp,
  Target,
  Lightbulb,
} from "lucide-react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const scheduledContent: Record<string, { title: string; platform: string; time: string; model: string; status: string }[]> = {
  "2026-02-24": [
    { title: "Market Update — Downtown", platform: "Instagram", time: "10:00 AM", model: "Kling 2.6", status: "published" },
  ],
  "2026-02-26": [
    { title: "Property Tour — Oak Lane", platform: "Instagram", time: "2:00 PM", model: "Kling 2.6", status: "scheduled" },
  ],
  "2026-02-28": [
    { title: "Client Story Highlight", platform: "LinkedIn", time: "9:00 AM", model: "Seedance 2.0", status: "scheduled" },
  ],
  "2026-03-03": [
    { title: "Weekly Tips — Mortgage Rates", platform: "TikTok", time: "11:00 AM", model: "Seedance 2.0", status: "scheduled" },
  ],
  "2026-03-05": [
    { title: "Google Review Video", platform: "Instagram", time: "3:00 PM", model: "Kling 2.6", status: "scheduled" },
  ],
  "2026-03-07": [
    { title: "Open House Announcement", platform: "Facebook", time: "10:00 AM", model: "Seedance 2.0", status: "scheduled" },
  ],
};

const platformColors: Record<string, string> = {
  Instagram: "bg-pink-500/20 text-pink-400",
  LinkedIn: "bg-blue-500/20 text-blue-400",
  TikTok: "bg-cyan-500/20 text-cyan-400",
  Facebook: "bg-indigo-500/20 text-indigo-400",
  YouTube: "bg-red-500/20 text-red-400",
};

// AI-suggested content week (personalized based on industry + trending topics)
const aiSuggestedWeek = [
  {
    id: "ai1",
    day: "Monday",
    title: "Market Monday — Weekly Stats Breakdown",
    platform: "Instagram",
    time: "10:00 AM",
    model: "Kling 2.6",
    reason: "Market update posts get 3.2x more engagement on Mondays",
    contentType: "market_update",
    script: "Hey everyone! Let's break down this week's market numbers...",
  },
  {
    id: "ai2",
    day: "Tuesday",
    title: "Client Success Story — The Johnsons",
    platform: "LinkedIn",
    time: "9:00 AM",
    model: "Seedance 2.0",
    reason: "Testimonial content performs best mid-week on LinkedIn",
    contentType: "testimonial",
    script: "I'm so excited to share another client success story...",
  },
  {
    id: "ai3",
    day: "Wednesday",
    title: "Quick Tip — First-Time Buyer Mistakes",
    platform: "TikTok",
    time: "12:00 PM",
    model: "Seedance 2.0",
    reason: "Educational tips under 30s see highest completion rates on TikTok",
    contentType: "educational",
    script: "3 mistakes first-time buyers make. Number one...",
  },
  {
    id: "ai4",
    day: "Thursday",
    title: "Behind the Scenes — Open House Prep",
    platform: "Instagram",
    time: "3:00 PM",
    model: "Kling 2.6",
    reason: "BTS content builds authenticity — 47% higher save rate",
    contentType: "behind_scenes",
    script: "Come with me as I prep for this weekend's open house...",
  },
  {
    id: "ai5",
    day: "Friday",
    title: "Google Review Spotlight",
    platform: "Instagram",
    time: "11:00 AM",
    model: "Kling 2.6",
    reason: "Review videos on Fridays drive weekend inquiry spikes",
    contentType: "review_video",
    script: "Check out what our latest client had to say...",
  },
  {
    id: "ai6",
    day: "Saturday",
    title: "Weekend Open House Tour",
    platform: "TikTok",
    time: "9:00 AM",
    model: "Seedance 2.0",
    reason: "Property tours on Saturday mornings get 2x more shares",
    contentType: "property_tour",
    script: "This stunning 3-bed in Capitol Hill just hit the market...",
  },
];

const contentTypeIcons: Record<string, string> = {
  market_update: "📊",
  testimonial: "⭐",
  educational: "💡",
  behind_scenes: "🎬",
  review_video: "📝",
  property_tour: "🏠",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [showAiSuggestions, setShowAiSuggestions] = useState(true);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleGenerateWeek = () => {
    setIsGeneratingWeek(true);
    setTimeout(() => {
      setIsGeneratingWeek(false);
      setShowAiSuggestions(true);
      setAcceptedSuggestions([]);
      setDismissedSuggestions([]);
    }, 2000);
  };

  const acceptSuggestion = (id: string) => {
    setAcceptedSuggestions([...acceptedSuggestions, id]);
  };

  const dismissSuggestion = (id: string) => {
    setDismissedSuggestions([...dismissedSuggestions, id]);
  };

  const acceptAllSuggestions = () => {
    const remaining = aiSuggestedWeek
      .filter((s) => !dismissedSuggestions.includes(s.id))
      .map((s) => s.id);
    setAcceptedSuggestions([...acceptedSuggestions, ...remaining]);
  };

  const visibleSuggestions = aiSuggestedWeek.filter(
    (s) => !dismissedSuggestions.includes(s.id)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-sm text-white/40 mt-1">AI-powered scheduling with weekly content suggestions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateWeek}
            disabled={isGeneratingWeek}
            className="btn-secondary gap-2 text-sm !py-2"
          >
            {isGeneratingWeek ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> AI Generate Week
              </>
            )}
          </button>
          <button className="btn-primary gap-2 text-sm !py-2">
            <Plus className="w-4 h-4" /> Schedule Post
          </button>
        </div>
      </div>

      {/* AI Weekly Suggestions Panel */}
      {showAiSuggestions && visibleSuggestions.length > 0 && (
        <div className="glass-card p-5 space-y-4 border-blue-500/10 bg-blue-500/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  AI Content Plan — This Week
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                    Personalized
                  </span>
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Based on your industry, audience, and top-performing content patterns
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={acceptAllSuggestions}
                className="btn-primary gap-1.5 text-xs !py-1.5 !px-3"
              >
                <Check className="w-3 h-3" /> Accept All
              </button>
              <button
                onClick={() => setShowAiSuggestions(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Insight bar */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span>Optimal posting: <span className="text-green-400 font-medium">6 posts/week</span></span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span>Best engagement: <span className="text-purple-400 font-medium">Tue & Thu 9-11 AM</span></span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
              <span>Trending topic: <span className="text-yellow-400 font-medium">Spring market predictions</span></span>
            </div>
          </div>

          {/* Suggestion cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleSuggestions.map((suggestion) => {
              const isAccepted = acceptedSuggestions.includes(suggestion.id);
              return (
                <div
                  key={suggestion.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAccepted
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{contentTypeIcons[suggestion.contentType]}</span>
                      <span className="text-xs font-semibold text-white/60">{suggestion.day}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${platformColors[suggestion.platform]}`}>
                      {suggestion.platform}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mb-1">{suggestion.title}</h4>
                  <p className="text-[11px] text-white/30 mb-2 line-clamp-2">&ldquo;{suggestion.script}&rdquo;</p>

                  {/* AI reason */}
                  <div className="flex items-start gap-1.5 mb-3 p-2 rounded-lg bg-white/[0.03]">
                    <Zap className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[10px] text-white/40">{suggestion.reason}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                      <Clock className="w-3 h-3" />
                      {suggestion.time} · {suggestion.model}
                    </div>
                    {isAccepted ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Scheduled
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => acceptSuggestion(suggestion.id)}
                          className="p-1 rounded-md bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => dismissSuggestion(suggestion.id)}
                          className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white/30 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar Header */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold">
            {months[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-white/30 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const dateKey = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
            const events = dateKey ? scheduledContent[dateKey] || [] : [];
            const isToday = day && year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

            return (
              <div
                key={i}
                className={`min-h-[100px] rounded-lg p-2 transition-colors ${
                  day
                    ? "bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 cursor-pointer"
                    : ""
                }`}
              >
                {day && (
                  <>
                    <div
                      className={`text-xs font-medium mb-1 ${
                        isToday
                          ? "w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center"
                          : "text-white/40"
                      }`}
                    >
                      {day}
                    </div>
                    {events.map((event, j) => (
                      <div
                        key={j}
                        className={`mt-1 p-1.5 rounded-md border cursor-pointer transition-colors ${
                          event.status === "published"
                            ? "bg-green-500/10 border-green-500/10 hover:bg-green-500/15"
                            : "bg-blue-500/10 border-blue-500/10 hover:bg-blue-500/15"
                        }`}
                      >
                        <div className="text-[10px] font-medium text-white truncate">{event.title}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[9px] px-1 py-0.5 rounded ${platformColors[event.platform] || "bg-white/10 text-white/40"}`}>
                            {event.platform}
                          </span>
                          <span className="text-[9px] text-white/20">{event.time}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming list */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold">Upcoming Scheduled Posts</h3>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <CalendarIcon className="w-3.5 h-3.5" />
            {Object.values(scheduledContent).flat().length} posts scheduled
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {Object.entries(scheduledContent)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, events]) =>
              events.map((event, i) => (
                <div key={`${date}-${i}`} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    event.status === "published" ? "bg-green-500/10" : "bg-blue-500/10"
                  }`}>
                    <Video className={`w-4 h-4 ${event.status === "published" ? "text-green-400" : "text-blue-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{event.title}</div>
                    <div className="flex items-center gap-2 text-xs text-white/30 mt-0.5">
                      <Cpu className="w-3 h-3" /> {event.model}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${platformColors[event.platform]}`}>
                    {event.platform}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    event.status === "published"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {event.status}
                  </span>
                  <div className="text-xs text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {date} · {event.time}
                  </div>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
}
