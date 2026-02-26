"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  Cpu,
  Zap,
  Play,
  Check,
  RefreshCw,
  Camera,
  Mic,
  Calendar,
  ChevronDown,
  ImageIcon,
  Video,
  Star,
  FileText,
  MessageSquare,
  Home,
  MapPin,
  TrendingUp,
  Wand2,
  ArrowRight,
  Upload,
  X,
} from "lucide-react";

// Industry-specific template definitions
const industryTemplates: Record<string, { id: string; label: string; icon: any; prompt: string; model: "kling_2.6" | "seedance_2.0" }[]> = {
  real_estate: [
    { id: "listing_tour", label: "Listing Video Tour", icon: Home, prompt: "Create a property walkthrough video for my new listing at [address]. Highlight key features like...", model: "kling_2.6" },
    { id: "market_update", label: "Weekly Market Update", icon: TrendingUp, prompt: "Create a market update video for [area] covering this week's inventory, pricing trends, and buyer activity.", model: "seedance_2.0" },
    { id: "just_sold", label: "Just Sold Celebration", icon: Star, prompt: "Create a 'Just Sold' announcement video for [address]. Congratulate the buyers and highlight the journey.", model: "seedance_2.0" },
    { id: "open_house", label: "Open House Invite", icon: MapPin, prompt: "Create an open house invitation video for [address] this [day] from [time]. Make it warm and inviting.", model: "seedance_2.0" },
    { id: "neighborhood", label: "Neighborhood Spotlight", icon: MapPin, prompt: "Create a neighborhood spotlight video for [area] covering restaurants, schools, parks, and community vibe.", model: "kling_2.6" },
    { id: "buyer_tips", label: "Buyer / Seller Tips", icon: MessageSquare, prompt: "Create an educational video with tips for [first-time buyers / sellers] in today's market.", model: "kling_2.6" },
    { id: "review_video", label: "Client Review Video", icon: Star, prompt: "Transform this client review into a video testimonial: ", model: "seedance_2.0" },
    { id: "intro", label: "Personal Introduction", icon: Video, prompt: "Create a personal brand introduction video. I'm [name], a [title] specializing in [area/niche].", model: "kling_2.6" },
  ],
  legal: [
    { id: "know_rights", label: "Know Your Rights", icon: FileText, prompt: "Create a 'Know Your Rights' video about [topic, e.g., tenant rights, wrongful termination].", model: "kling_2.6" },
    { id: "legal_tip", label: "Legal Tip of the Week", icon: MessageSquare, prompt: "Create a weekly legal tip video about [topic]. Keep it accessible for a general audience.", model: "seedance_2.0" },
    { id: "case_result", label: "Case Result Highlight", icon: Star, prompt: "Create a video highlighting a recent case result (anonymized): [brief case summary and outcome].", model: "seedance_2.0" },
    { id: "review_video", label: "Client Review Video", icon: Star, prompt: "Transform this client review into a video testimonial: ", model: "seedance_2.0" },
    { id: "explainer", label: "Legal Process Explainer", icon: FileText, prompt: "Create an explainer video about the [legal process, e.g., personal injury claim, divorce filing] process.", model: "kling_2.6" },
    { id: "intro", label: "Attorney Introduction", icon: Video, prompt: "Create a professional introduction video. I'm [name], attorney at [firm], specializing in [practice area].", model: "kling_2.6" },
  ],
  medical: [
    { id: "health_tip", label: "Health Tip of the Week", icon: MessageSquare, prompt: "Create a health tip video about [topic, e.g., sleep hygiene, heart health]. Keep it patient-friendly.", model: "seedance_2.0" },
    { id: "procedure", label: "Procedure Explainer", icon: FileText, prompt: "Create a reassuring explainer video about what patients can expect during [procedure name].", model: "kling_2.6" },
    { id: "wellness", label: "Wellness Series", icon: Star, prompt: "Create a wellness video about [topic]. Encourage healthy habits and preventive care.", model: "seedance_2.0" },
    { id: "review_video", label: "Patient Review Video", icon: Star, prompt: "Transform this patient review into a video testimonial: ", model: "seedance_2.0" },
    { id: "intro", label: "Doctor Introduction", icon: Video, prompt: "Create an introduction video. I'm Dr. [name] at [practice], specializing in [specialty].", model: "kling_2.6" },
    { id: "myth_busting", label: "Medical Myth Busting", icon: MessageSquare, prompt: "Create a myth-busting video about [common misconception, e.g., 'cold weather causes colds'].", model: "kling_2.6" },
  ],
  creator: [
    { id: "brand_intro", label: "Brand Introduction", icon: Video, prompt: "Create a personal brand introduction video. I'm [name], I help [audience] with [value proposition].", model: "kling_2.6" },
    { id: "tip_video", label: "Quick Tip Video", icon: MessageSquare, prompt: "Create a quick tip video about [topic in your expertise area].", model: "seedance_2.0" },
    { id: "behind_scenes", label: "Behind the Scenes", icon: Camera, prompt: "Create a behind-the-scenes style video showing [your process / workspace / day-in-the-life].", model: "seedance_2.0" },
    { id: "review_video", label: "Client Testimonial", icon: Star, prompt: "Transform this client review into a video testimonial: ", model: "seedance_2.0" },
    { id: "thought_leadership", label: "Thought Leadership", icon: TrendingUp, prompt: "Create a thought leadership video sharing my perspective on [trending topic in your industry].", model: "kling_2.6" },
    { id: "intro", label: "Social Media Intro", icon: Video, prompt: "Create a social-optimized intro video for [platform]. Hook viewers in the first 2 seconds.", model: "seedance_2.0" },
  ],
  other: [
    { id: "brand_intro", label: "Brand Introduction", icon: Video, prompt: "Create a personal brand introduction video. I'm [name], [title] at [company].", model: "kling_2.6" },
    { id: "tip_video", label: "Educational Tip", icon: MessageSquare, prompt: "Create an educational tip video about [topic in your field].", model: "seedance_2.0" },
    { id: "review_video", label: "Client Testimonial", icon: Star, prompt: "Transform this client/customer review into a video testimonial: ", model: "seedance_2.0" },
    { id: "thought_leadership", label: "Thought Leadership", icon: TrendingUp, prompt: "Share your perspective on [trending topic in your industry].", model: "kling_2.6" },
  ],
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  videoPreview?: {
    title: string;
    model: "kling_2.6" | "seedance_2.0";
    status: "generating" | "ready" | "approved";
    color: string;
    platforms?: { name: string; aspect: string }[];
  };
  templateSuggestions?: typeof industryTemplates.real_estate;
  reviewCards?: { name: string; rating: number; text: string; date: string }[];
}

export default function GeneratePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm your AI marketing teammate. What would you like to create today? Pick a template below or just tell me what you need.",
      timestamp: new Date(),
      templateSuggestions: industryTemplates.real_estate, // default, would use user's actual industry
    },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"kling_2.6" | "seedance_2.0">("kling_2.6");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [industry] = useState("real_estate"); // would come from session
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Omit<ChatMessage, "id" | "timestamp">) => {
    setMessages((prev) => [...prev, { ...msg, id: `msg-${Date.now()}-${Math.random()}`, timestamp: new Date() }]);
  };

  const handleTemplateSelect = (template: typeof industryTemplates.real_estate[0]) => {
    setSelectedModel(template.model);
    setInput(template.prompt);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;

    const userMsg = input.trim();
    setInput("");

    addMessage({ role: "user", content: userMsg });

    // Simulate AI teammate response
    setIsGenerating(true);

    setTimeout(() => {
      // AI acknowledges and starts working
      addMessage({
        role: "assistant",
        content: `Got it! I'll create that for you using **${selectedModel === "kling_2.6" ? "Kling 2.6" : "Seedance 2.0"}**. Working on the script and generating your video now...`,
      });

      // After a beat, show the generating video
      setTimeout(() => {
        addMessage({
          role: "assistant",
          content: "Here's your video! I've optimized it for multiple platforms. Review it below and approve when you're happy.",
          videoPreview: {
            title: userMsg.length > 60 ? userMsg.substring(0, 60) + "..." : userMsg,
            model: selectedModel,
            status: "ready",
            color: selectedModel === "kling_2.6" ? "from-blue-500/30 to-cyan-500/30" : "from-purple-500/30 to-pink-500/30",
            platforms: [
              { name: "Instagram Reel", aspect: "9:16" },
              { name: "LinkedIn", aspect: "16:9" },
              { name: "TikTok", aspect: "9:16" },
            ],
          },
        });
        setIsGenerating(false);
      }, 2500);
    }, 1000);
  };

  const handleApproveVideo = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.videoPreview
          ? { ...m, videoPreview: { ...m.videoPreview, status: "approved" as const } }
          : m
      )
    );
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: "Video approved! I've added it to your content calendar. Want me to schedule it for a specific time, or should I pick the optimal posting time for maximum engagement?",
      });
    }, 500);
  };

  const handleImportReviews = () => {
    addMessage({ role: "user", content: "Import my Google reviews and turn the best ones into videos" });

    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: "I found **6 new 5-star reviews** on your Google Business Profile this month. Here are the best candidates for video testimonials:",
        reviewCards: [
          { name: "Sarah M.", rating: 5, text: "Absolutely amazing experience! Found our dream home in just 2 weeks. Professional, responsive, and genuinely cared about what we wanted.", date: "Feb 22, 2026" },
          { name: "David & Lisa K.", rating: 5, text: "Best realtor in Seattle hands down. Made the entire selling process stress-free. Got 15% over asking price!", date: "Feb 18, 2026" },
          { name: "James T.", rating: 5, text: "As a first-time buyer I had no idea what to expect. They walked me through every step and I couldn't be happier with my new place.", date: "Feb 12, 2026" },
        ],
      });
    }, 1200);
  };

  const handleReviewToVideo = (review: { name: string; text: string }) => {
    addMessage({ role: "user", content: `Turn this review from ${review.name} into a video: "${review.text}"` });
    setIsGenerating(true);

    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: `Created a testimonial video from **${review.name}'s** review using **Seedance 2.0** for dynamic, engaging visuals. Here's the preview:`,
        videoPreview: {
          title: `Client Testimonial — ${review.name}`,
          model: "seedance_2.0",
          status: "ready",
          color: "from-purple-500/30 to-pink-500/30",
          platforms: [
            { name: "Instagram Reel", aspect: "9:16" },
            { name: "LinkedIn", aspect: "16:9" },
            { name: "TikTok", aspect: "9:16" },
          ],
        },
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            AI Teammate
          </h1>
          <p className="text-xs text-white/30 mt-0.5">Your personal content creation partner</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Google Reviews Import */}
          <button
            onClick={handleImportReviews}
            className="btn-secondary !py-2 !px-3 text-xs gap-1.5"
          >
            <Star className="w-3.5 h-3.5 text-yellow-400" />
            Import Reviews
          </button>

          {/* Model Picker */}
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="btn-secondary !py-2 !px-3 text-xs gap-1.5"
            >
              {selectedModel === "kling_2.6" ? (
                <><Cpu className="w-3.5 h-3.5 text-blue-400" /> Kling 2.6</>
              ) : (
                <><Zap className="w-3.5 h-3.5 text-purple-400" /> Seedance 2.0</>
              )}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showModelPicker && (
              <div className="absolute right-0 top-full mt-1 w-64 glass-card p-2 z-50">
                <button
                  onClick={() => { setSelectedModel("kling_2.6"); setShowModelPicker(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-all ${selectedModel === "kling_2.6" ? "bg-blue-500/10" : "hover:bg-white/5"}`}
                >
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium">Kling 2.6</div>
                    <div className="text-[10px] text-white/30">Hyper-realistic · Testimonials, pro content</div>
                  </div>
                  {selectedModel === "kling_2.6" && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                </button>
                <button
                  onClick={() => { setSelectedModel("seedance_2.0"); setShowModelPicker(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-all ${selectedModel === "seedance_2.0" ? "bg-purple-500/10" : "hover:bg-white/5"}`}
                >
                  <Zap className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-medium">Seedance 2.0</div>
                    <div className="text-[10px] text-white/30">Creative & dynamic · Reels, social</div>
                  </div>
                  {selectedModel === "seedance_2.0" && <Check className="w-4 h-4 text-purple-400 ml-auto" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1 -mr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${msg.role === "user" ? "" : ""}`}>
              {/* Avatar + message */}
              <div className="flex items-start gap-3">
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-500/15 border border-blue-500/20 rounded-br-md"
                        : "bg-white/[0.04] border border-white/5 rounded-bl-md"
                    }`}
                  >
                    {msg.content.split("**").map((part, i) =>
                      i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : <span key={i}>{part}</span>
                    )}
                  </div>

                  {/* Template suggestions */}
                  {msg.templateSuggestions && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {msg.templateSuggestions.slice(0, 6).map((tmpl) => (
                        <button
                          key={tmpl.id}
                          onClick={() => handleTemplateSelect(tmpl)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 hover:bg-white/[0.06] transition-all text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <tmpl.icon className="w-4 h-4 text-white/40" />
                          </div>
                          <div>
                            <div className="text-xs font-medium">{tmpl.label}</div>
                            <div className="text-[10px] text-white/20 flex items-center gap-1 mt-0.5">
                              {tmpl.model === "kling_2.6" ? <Cpu className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
                              {tmpl.model === "kling_2.6" ? "Kling 2.6" : "Seedance 2.0"}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Google Review Cards */}
                  {msg.reviewCards && (
                    <div className="mt-3 space-y-2">
                      {msg.reviewCards.map((review, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center text-[10px] font-bold">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-xs font-medium">{review.name}</div>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: review.rating }).map((_, j) => (
                                    <Star key={j} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] text-white/20">{review.date}</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed mb-2">&ldquo;{review.text}&rdquo;</p>
                          <button
                            onClick={() => handleReviewToVideo(review)}
                            className="btn-primary !py-1.5 !px-3 text-[10px] gap-1"
                          >
                            <Wand2 className="w-3 h-3" /> Turn into Video
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Video Preview with Social Platform Mockups */}
                  {msg.videoPreview && (
                    <div className="mt-3 space-y-3">
                      {/* Main video */}
                      <div className="rounded-xl overflow-hidden border border-white/5">
                        <div className={`aspect-video bg-gradient-to-br ${msg.videoPreview.color} relative flex items-center justify-center`}>
                          <div className="absolute inset-0 bg-[#0a0e17]/30" />
                          {msg.videoPreview.status === "generating" ? (
                            <RefreshCw className="w-8 h-8 text-white/60 animate-spin" />
                          ) : (
                            <button className="relative w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:scale-105 transition-transform">
                              <Play className="w-6 h-6 text-white ml-0.5" />
                            </button>
                          )}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur rounded-full">
                            {msg.videoPreview.model === "kling_2.6" ? <Cpu className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                            <span className="text-[10px] font-medium">{msg.videoPreview.model === "kling_2.6" ? "Kling 2.6" : "Seedance 2.0"}</span>
                          </div>
                          {msg.videoPreview.status === "approved" && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-green-500/80 backdrop-blur rounded-full">
                              <Check className="w-3 h-3" />
                              <span className="text-[10px] font-semibold">Approved</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-white/[0.02]">
                          <div className="text-xs font-medium">{msg.videoPreview.title}</div>
                        </div>
                      </div>

                      {/* Social Platform Preview Mockups */}
                      {msg.videoPreview.platforms && msg.videoPreview.status === "ready" && (
                        <div>
                          <div className="text-[10px] text-white/20 mb-2 uppercase tracking-wider font-medium">Platform Previews</div>
                          <div className="flex gap-3 overflow-x-auto pb-1">
                            {msg.videoPreview.platforms.map((platform, i) => (
                              <div key={i} className="flex-shrink-0">
                                <div
                                  className={`rounded-xl border border-white/5 overflow-hidden bg-white/[0.02] ${
                                    platform.aspect === "9:16" ? "w-[100px]" : "w-[160px]"
                                  }`}
                                >
                                  <div
                                    className={`bg-gradient-to-br ${msg.videoPreview!.color} relative flex items-center justify-center ${
                                      platform.aspect === "9:16" ? "aspect-[9/16]" : "aspect-video"
                                    }`}
                                  >
                                    <div className="absolute inset-0 bg-[#0a0e17]/30" />
                                    <Play className="w-4 h-4 text-white/50 relative z-10" />
                                    {/* Platform-specific overlay elements */}
                                    {platform.name.includes("Instagram") && (
                                      <div className="absolute bottom-2 left-2 right-2">
                                        <div className="h-1 rounded bg-white/20 mb-1" />
                                        <div className="flex gap-1">
                                          <div className="w-3 h-3 rounded-full bg-white/20" />
                                          <div className="w-3 h-3 rounded-full bg-white/10" />
                                          <div className="w-3 h-3 rounded-full bg-white/10" />
                                        </div>
                                      </div>
                                    )}
                                    {platform.name.includes("TikTok") && (
                                      <div className="absolute right-1.5 bottom-8 space-y-2">
                                        <div className="w-4 h-4 rounded-full bg-white/20" />
                                        <div className="w-4 h-4 rounded-full bg-white/20" />
                                        <div className="w-4 h-4 rounded-full bg-white/20" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="px-2 py-1.5 text-center">
                                    <div className="text-[9px] font-medium">{platform.name}</div>
                                    <div className="text-[8px] text-white/20">{platform.aspect}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      {msg.videoPreview.status === "ready" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveVideo(msg.id)}
                            className="btn-primary !py-2 !px-4 text-xs gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button className="btn-secondary !py-2 !px-4 text-xs gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                          </button>
                          <button className="btn-secondary !py-2 !px-3 text-xs text-red-400 border-red-500/10 hover:bg-red-500/5">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[10px] text-white/15 mt-1.5">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/5">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Creating your video...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-4 border-t border-white/5">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Tell your AI teammate what to create... e.g. 'Make me a market update for Bellevue this week'"
              className="input-field !py-3 !pr-12 resize-none min-h-[48px] max-h-[120px]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-20 flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-white/15">
          <span className="flex items-center gap-1">
            {selectedModel === "kling_2.6" ? <Cpu className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
            Using {selectedModel === "kling_2.6" ? "Kling 2.6" : "Seedance 2.0"}
          </span>
          <span>·</span>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
