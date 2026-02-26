"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, Video, Cpu } from "lucide-react";

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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-sm text-white/40 mt-1">Schedule and manage your content posting cadence</p>
        </div>
        <button className="btn-primary gap-2 text-sm">
          <Plus className="w-4 h-4" /> Schedule Post
        </button>
      </div>

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
                        className="mt-1 p-1.5 rounded-md bg-blue-500/10 border border-blue-500/10 cursor-pointer hover:bg-blue-500/15 transition-colors"
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
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="font-semibold">Upcoming Scheduled Posts</h3>
        </div>
        <div className="divide-y divide-white/5">
          {Object.entries(scheduledContent)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, events]) =>
              events.map((event, i) => (
                <div key={`${date}-${i}`} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-blue-400" />
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
