"use client";

import { useState } from "react";
import {
  Settings,
  User,
  CreditCard,
  Bell,
  Link2,
  Shield,
  Check,
  ExternalLink,
  Trash2,
  Plus,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "plan", label: "Plan & Billing", icon: CreditCard },
  { id: "social", label: "Connected Accounts", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
];

const socialPlatforms = [
  { id: "instagram", name: "Instagram", handle: "@rockwellrealty", connected: true, icon: "IG", color: "from-pink-500 to-purple-500" },
  { id: "linkedin", name: "LinkedIn", handle: "Ryan Rockwell", connected: true, icon: "in", color: "from-blue-600 to-blue-400" },
  { id: "tiktok", name: "TikTok", handle: "", connected: false, icon: "TT", color: "from-gray-600 to-gray-400" },
  { id: "facebook", name: "Facebook", handle: "", connected: false, icon: "FB", color: "from-blue-700 to-blue-500" },
  { id: "youtube", name: "YouTube", handle: "", connected: false, icon: "YT", color: "from-red-600 to-red-400" },
];

const plans = [
  {
    id: "professional",
    name: "Professional",
    price: "$79",
    period: "/month",
    features: ["3 AI video clips/month", "Voice cloning", "500 AI images", "Review-to-video", "Save 80% vs agencies"],
    popular: false,
  },
  {
    id: "authority",
    name: "Authority",
    price: "$199",
    period: "/month",
    features: ["8 AI video clips/month", "1,500 AI images", "Up to 10 team members", "3x more testimonials", "Content strategy"],
    popular: true,
  },
  {
    id: "expert",
    name: "Expert",
    price: "$375",
    period: "/month",
    features: ["40+ AI video clips/month", "Unlimited images", "Dedicated AI strategist", "Monthly content calendar", "Competitor research"],
    popular: false,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPlan] = useState("authority");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage your account, plan, and connected platforms</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                : "text-white/40 hover:text-white/60 border border-transparent"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="font-semibold">Personal Information</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <div>
              <button className="text-sm text-blue-400 hover:text-blue-300">Change avatar</button>
              <p className="text-xs text-white/30 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">First Name</label>
              <input type="text" className="input-field !py-2.5 text-sm" defaultValue="Ryan" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Last Name</label>
              <input type="text" className="input-field !py-2.5 text-sm" defaultValue="Rockwell" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Email</label>
              <input type="email" className="input-field !py-2.5 text-sm" defaultValue="ryan@rockwellrealty.com" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Company</label>
              <input type="text" className="input-field !py-2.5 text-sm" defaultValue="Rockwell Realty Group" />
            </div>
          </div>
          <button className="btn-primary gap-2 text-sm !py-2.5">
            <Check className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}

      {/* Plan & Billing Tab */}
      {activeTab === "plan" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`glass-card p-5 relative ${
                  currentPlan === plan.id ? "border-blue-500/30 bg-blue-500/5" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-[10px] font-semibold">
                    Popular
                  </div>
                )}
                <h4 className="font-semibold text-lg">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-white/30">{plan.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-5 w-full gap-2 text-sm !py-2.5 ${
                    currentPlan === plan.id ? "btn-secondary" : "btn-primary"
                  }`}
                >
                  {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Accounts Tab */}
      {activeTab === "social" && (
        <div className="space-y-4">
          <p className="text-xs text-white/30">Connect your social media accounts for automatic content publishing.</p>
          {socialPlatforms.map((platform) => (
            <div key={platform.id} className="glass-card p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold text-xs`}>
                {platform.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{platform.name}</div>
                {platform.connected ? (
                  <div className="text-xs text-green-400 mt-0.5">Connected · {platform.handle}</div>
                ) : (
                  <div className="text-xs text-white/30 mt-0.5">Not connected</div>
                )}
              </div>
              {platform.connected ? (
                <button className="btn-secondary !py-1.5 !px-3 text-xs text-red-400 border-red-500/10 hover:bg-red-500/5">
                  Disconnect
                </button>
              ) : (
                <button className="btn-primary !py-1.5 !px-3 text-xs gap-1.5">
                  <Plus className="w-3 h-3" /> Connect
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="glass-card p-6 space-y-5">
          <h3 className="font-semibold">Notification Preferences</h3>
          {[
            { label: "New content ready for review", desc: "Get notified when AI generates new content", checked: true },
            { label: "Content published", desc: "Notify when scheduled content goes live", checked: true },
            { label: "Weekly performance digest", desc: "Weekly summary of your content analytics", checked: true },
            { label: "AI model updates", desc: "Notified about Kling 2.6 and Seedance 2.0 improvements", checked: false },
            { label: "Marketing tips", desc: "Content strategy tips from the Official AI team", checked: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-white/30 mt-0.5">{item.desc}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/50 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 peer-checked:after:bg-white" />
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" /> Data & Privacy
            </h3>
            <p className="text-sm text-white/40">You own all content generated by Official AI. We never sell, share, or train on your data.</p>
            <div className="space-y-3 pt-2">
              <button className="btn-secondary gap-2 text-sm !py-2.5 w-full sm:w-auto">
                <ExternalLink className="w-4 h-4" /> Download All My Data
              </button>
              <button className="btn-secondary gap-2 text-sm !py-2.5 w-full sm:w-auto">
                Revoke AI Consent
              </button>
              <button className="btn-secondary gap-2 text-sm !py-2.5 w-full sm:w-auto text-red-400 border-red-500/10 hover:bg-red-500/5">
                <Trash2 className="w-4 h-4" /> Delete My Account & All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
