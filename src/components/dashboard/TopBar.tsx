"use client";

import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-white/5 bg-[#060911]/80 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search videos, content..."
          className="input-field pl-10 !py-2 !text-sm !rounded-lg max-w-sm"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-white/50" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* Plan badge */}
        <div className="hidden sm:block px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <span className="text-xs font-semibold text-blue-400 uppercase">
            {(session?.user as any)?.plan || "Free"} Plan
          </span>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-white leading-none">
              {session?.user?.name || "User"}
            </div>
            <div className="text-xs text-white/40 mt-0.5">
              {session?.user?.email || ""}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
