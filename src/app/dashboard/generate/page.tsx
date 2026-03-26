"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Sparkles,
  Cpu,
  Zap,
  Check,
  RefreshCw,
  ChevronDown,
  Video,
  Star,
  FileText,
  MessageSquare,
  Home,
  MapPin,
  TrendingUp,
  X,
  Loader2,
  Film,
  Users,
  Heart,
  Lightbulb,
  Megaphone,
  BookOpen,
  Camera,
  Award,
  Target,
  Mic,
  Globe,
  BarChart3,
  Shield,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useGenerationProgress } from "@/hooks/use-generation-progress";
import { GenerationProgressBar } from "@/components/GenerationProgress";

// ─── Template Gallery Data (Item 16) ──────────────────────────────

interface TemplateItem {
  id: string;
  label: string;
  icon: any;
  prompt: string;
  model: "kling_2.6" | "seedance_2.0";
  category: string;
  description: string;
  estimatedDuration: string;
}

const templateCategories = [
  { id: "all", label: "All Templates" },
  { id: "market_updates", label: "Market Updates" },
  { id: "tips_education", label: "Tips & Education" },
  { id: "personal_brand", label: "Personal Brand" },
  { id: "client_stories", label: "Client Stories" },
];

const industryTemplateGallery: Record<string, TemplateItem[]> = {
  real_estate: [
    { id: "re_market_weekly", label: "Weekly Market Update", icon: TrendingUp, prompt: "Create a market update video for [area] covering this week's inventory, pricing trends, and buyer activity.", model: "seedance_2.0", category: "market_updates", description: "Recap local market stats and trends", estimatedDuration: "15s" },
    { id: "re_market_monthly", label: "Monthly Market Recap", icon: BarChart3, prompt: "Create a monthly market recap for [area] with key stats: median price, days on market, inventory changes, and predictions.", model: "kling_2.6", category: "market_updates", description: "In-depth monthly analysis with data", estimatedDuration: "30s" },
    { id: "re_interest_rates", label: "Interest Rate Update", icon: TrendingUp, prompt: "Create a quick video about the latest interest rate changes and what they mean for buyers and sellers in [area].", model: "seedance_2.0", category: "market_updates", description: "Break down rate impacts simply", estimatedDuration: "15s" },
    { id: "re_price_alert", label: "Price Reduction Alert", icon: Megaphone, prompt: "Create an alert video about price reductions in [area] this week. Highlight the best deals.", model: "seedance_2.0", category: "market_updates", description: "Spotlight best deals in your area", estimatedDuration: "8s" },
    { id: "re_new_listings", label: "New Listings This Week", icon: Home, prompt: "Create a video showcasing the best new listings in [area] this week with key highlights.", model: "kling_2.6", category: "market_updates", description: "Curated picks from new inventory", estimatedDuration: "15s" },
    { id: "re_buyer_tips", label: "Buyer Tips", icon: Lightbulb, prompt: "Create an educational video with tips for first-time buyers in today's market.", model: "kling_2.6", category: "tips_education", description: "Help buyers navigate the process", estimatedDuration: "15s" },
    { id: "re_seller_tips", label: "Seller Preparation", icon: BookOpen, prompt: "Create a video with the top 5 things sellers should do before listing their home.", model: "kling_2.6", category: "tips_education", description: "Pre-listing checklist for sellers", estimatedDuration: "30s" },
    { id: "re_staging_tips", label: "Home Staging Tips", icon: Home, prompt: "Create a video with home staging tips that help properties sell faster.", model: "seedance_2.0", category: "tips_education", description: "Quick staging wins for sellers", estimatedDuration: "15s" },
    { id: "re_mortgage_101", label: "Mortgage 101", icon: FileText, prompt: "Create an educational video explaining mortgage basics: types, rates, down payments.", model: "kling_2.6", category: "tips_education", description: "Demystify mortgages for buyers", estimatedDuration: "30s" },
    { id: "re_invest_tips", label: "Investment Property Tips", icon: Target, prompt: "Create a video about what to look for when buying investment property in [area].", model: "kling_2.6", category: "tips_education", description: "Guide to real estate investing", estimatedDuration: "30s" },
    { id: "re_listing_tour", label: "Listing Video Tour", icon: Camera, prompt: "Create a property walkthrough video for my new listing at [address]. Highlight key features.", model: "kling_2.6", category: "personal_brand", description: "Cinematic walkthrough of a listing", estimatedDuration: "15s" },
    { id: "re_open_house", label: "Open House Invite", icon: MapPin, prompt: "Create an open house invitation video for [address] this [day] from [time]. Make it warm and inviting.", model: "seedance_2.0", category: "personal_brand", description: "Drive attendance to your open house", estimatedDuration: "8s" },
    { id: "re_neighborhood", label: "Neighborhood Spotlight", icon: Globe, prompt: "Create a neighborhood spotlight for [area] covering restaurants, schools, parks, and community vibe.", model: "kling_2.6", category: "personal_brand", description: "Showcase what makes a neighborhood special", estimatedDuration: "30s" },
    { id: "re_day_in_life", label: "Day in the Life", icon: Camera, prompt: "Create a 'day in the life' video showing your daily routine as a real estate agent.", model: "seedance_2.0", category: "personal_brand", description: "Authentic behind-the-scenes content", estimatedDuration: "15s" },
    { id: "re_about_me", label: "Agent Introduction", icon: Mic, prompt: "Create a personal introduction video. I'm [name], a real estate agent in [area] specializing in [specialty].", model: "kling_2.6", category: "personal_brand", description: "Build trust with a personal intro", estimatedDuration: "15s" },
    { id: "re_just_sold", label: "Just Sold Celebration", icon: Star, prompt: "Create a 'Just Sold' announcement video for [address]. Congratulate the buyers and highlight the journey.", model: "seedance_2.0", category: "client_stories", description: "Celebrate closings and build social proof", estimatedDuration: "15s" },
    { id: "re_testimonial", label: "Client Testimonial", icon: Award, prompt: "Transform this client review into a video testimonial: [paste review text]", model: "seedance_2.0", category: "client_stories", description: "Turn reviews into engaging video", estimatedDuration: "15s" },
    { id: "re_success_story", label: "Buyer Success Story", icon: Heart, prompt: "Create a video about a buyer's journey from searching to finding their dream home.", model: "kling_2.6", category: "client_stories", description: "Inspire buyers with real stories", estimatedDuration: "30s" },
    { id: "re_first_home", label: "First-Time Buyer Win", icon: Star, prompt: "Create a celebratory video for a first-time homebuyer who just closed on their home.", model: "seedance_2.0", category: "client_stories", description: "Celebrate first-time buyer milestones", estimatedDuration: "8s" },
    { id: "re_relocation", label: "Relocation Story", icon: Globe, prompt: "Create a video about helping a family relocate to [area] and find their perfect home.", model: "kling_2.6", category: "client_stories", description: "Showcase your relocation expertise", estimatedDuration: "15s" },
  ],
  legal: [
    { id: "le_law_update", label: "New Law Alert", icon: Shield, prompt: "Create a video about a new law or regulation that affects [area of law] and what it means for people.", model: "kling_2.6", category: "market_updates", description: "Break down new legal developments", estimatedDuration: "15s" },
    { id: "le_court_ruling", label: "Court Ruling Breakdown", icon: MessageSquare, prompt: "Create a video explaining a recent court ruling about [topic] and its implications.", model: "kling_2.6", category: "market_updates", description: "Make complex rulings understandable", estimatedDuration: "30s" },
    { id: "le_deadline_alert", label: "Legal Deadline Alert", icon: Megaphone, prompt: "Create an alert about an upcoming legal deadline for [filing/claim type].", model: "seedance_2.0", category: "market_updates", description: "Warn about important deadlines", estimatedDuration: "8s" },
    { id: "le_industry_trends", label: "Legal Industry Trends", icon: TrendingUp, prompt: "Create a video discussing trends in [practice area] this quarter.", model: "kling_2.6", category: "market_updates", description: "Position yourself as a thought leader", estimatedDuration: "15s" },
    { id: "le_regulatory_change", label: "Regulatory Update", icon: FileText, prompt: "Create a video about a regulatory change in [industry/area] that affects businesses or individuals.", model: "seedance_2.0", category: "market_updates", description: "Keep your audience informed", estimatedDuration: "15s" },
    { id: "le_know_rights", label: "Know Your Rights", icon: Shield, prompt: "Create a 'Know Your Rights' video about [topic, e.g., tenant rights, employment rights].", model: "kling_2.6", category: "tips_education", description: "Empower people with legal knowledge", estimatedDuration: "15s" },
    { id: "le_legal_tip", label: "Legal Tip of the Week", icon: Lightbulb, prompt: "Create a weekly legal tip video about [topic]. Keep it accessible.", model: "seedance_2.0", category: "tips_education", description: "Bite-sized legal wisdom", estimatedDuration: "8s" },
    { id: "le_process_explainer", label: "Legal Process Explainer", icon: BookOpen, prompt: "Create an explainer about the [legal process, e.g., personal injury claim] process step by step.", model: "kling_2.6", category: "tips_education", description: "Demystify legal processes", estimatedDuration: "30s" },
    { id: "le_common_mistakes", label: "Common Legal Mistakes", icon: Target, prompt: "Create a video about common legal mistakes people make regarding [topic].", model: "seedance_2.0", category: "tips_education", description: "Help people avoid costly errors", estimatedDuration: "15s" },
    { id: "le_faq", label: "Legal FAQ", icon: MessageSquare, prompt: "Answer a frequently asked legal question about [topic] in a clear, accessible way.", model: "seedance_2.0", category: "tips_education", description: "Address common questions", estimatedDuration: "15s" },
    { id: "le_firm_intro", label: "Firm Introduction", icon: Building2, prompt: "Create a professional introduction video for our law firm specializing in [practice areas].", model: "kling_2.6", category: "personal_brand", description: "Build trust with a firm overview", estimatedDuration: "15s" },
    { id: "le_attorney_intro", label: "Attorney Profile", icon: Mic, prompt: "Create a personal introduction video. I'm [name], an attorney specializing in [practice area].", model: "kling_2.6", category: "personal_brand", description: "Personal attorney introduction", estimatedDuration: "15s" },
    { id: "le_behind_scenes", label: "Behind the Scenes", icon: Camera, prompt: "Show what a day looks like at our law firm -- the work, the team, the mission.", model: "seedance_2.0", category: "personal_brand", description: "Humanize your practice", estimatedDuration: "15s" },
    { id: "le_community", label: "Community Involvement", icon: Heart, prompt: "Create a video about our firm's involvement in [community event or pro bono work].", model: "seedance_2.0", category: "personal_brand", description: "Show community commitment", estimatedDuration: "15s" },
    { id: "le_thought_leader", label: "Thought Leadership", icon: TrendingUp, prompt: "Share your perspective on [trending legal topic] as an experienced attorney.", model: "kling_2.6", category: "personal_brand", description: "Establish authority in your field", estimatedDuration: "30s" },
    { id: "le_case_result", label: "Case Result Highlight", icon: Award, prompt: "Create a video highlighting a recent case result (anonymized): [brief summary and outcome].", model: "seedance_2.0", category: "client_stories", description: "Showcase your track record", estimatedDuration: "15s" },
    { id: "le_client_testimonial", label: "Client Testimonial", icon: Star, prompt: "Transform this client review into a video testimonial: [paste review]", model: "seedance_2.0", category: "client_stories", description: "Build trust through client voices", estimatedDuration: "15s" },
    { id: "le_justice_story", label: "Justice Story", icon: Shield, prompt: "Create a video about how we helped a client get justice in a [type of case].", model: "kling_2.6", category: "client_stories", description: "Inspire trust with real outcomes", estimatedDuration: "30s" },
    { id: "le_settlement", label: "Settlement Win", icon: Star, prompt: "Create a video celebrating a significant settlement result for a client (anonymized).", model: "seedance_2.0", category: "client_stories", description: "Highlight major wins", estimatedDuration: "8s" },
    { id: "le_client_journey", label: "Client Journey", icon: Users, prompt: "Create a video following a client's journey through the legal process to resolution.", model: "kling_2.6", category: "client_stories", description: "Show the full client experience", estimatedDuration: "30s" },
  ],
  finance: [
    { id: "fi_market_monday", label: "Market Monday", icon: TrendingUp, prompt: "Recap last week's market moves and what to watch this week.", model: "seedance_2.0", category: "market_updates", description: "Weekly market analysis", estimatedDuration: "15s" },
    { id: "fi_earnings", label: "Earnings Breakdown", icon: BarChart3, prompt: "Break down this week's major earnings reports and what they mean for investors.", model: "kling_2.6", category: "market_updates", description: "Make earnings digestible", estimatedDuration: "30s" },
    { id: "fi_fed_update", label: "Fed Decision Update", icon: Building2, prompt: "Create a video about the latest Federal Reserve decision and its impact on markets.", model: "kling_2.6", category: "market_updates", description: "Explain policy impacts", estimatedDuration: "15s" },
    { id: "fi_sector_spotlight", label: "Sector Spotlight", icon: Target, prompt: "Create a video spotlighting the [sector] sector: trends, leaders, and opportunities.", model: "kling_2.6", category: "market_updates", description: "Deep dive into a sector", estimatedDuration: "30s" },
    { id: "fi_crypto_update", label: "Crypto Market Update", icon: Globe, prompt: "Create a video covering this week's cryptocurrency market moves and trends.", model: "seedance_2.0", category: "market_updates", description: "Digital asset analysis", estimatedDuration: "15s" },
    { id: "fi_tax_tip", label: "Tax Planning Tip", icon: Lightbulb, prompt: "Share a tax planning strategy that can save your audience money.", model: "seedance_2.0", category: "tips_education", description: "Actionable tax strategies", estimatedDuration: "8s" },
    { id: "fi_budget_101", label: "Budgeting Basics", icon: BookOpen, prompt: "Create an educational video about budgeting fundamentals everyone should know.", model: "kling_2.6", category: "tips_education", description: "Help people budget better", estimatedDuration: "30s" },
    { id: "fi_retirement", label: "Retirement Planning", icon: Target, prompt: "Create a video about retirement planning milestones for people in their [age range].", model: "kling_2.6", category: "tips_education", description: "Age-specific retirement advice", estimatedDuration: "30s" },
    { id: "fi_invest_mistake", label: "Investment Mistakes", icon: Shield, prompt: "Create a video about the top investment mistakes people make and how to avoid them.", model: "seedance_2.0", category: "tips_education", description: "Prevent common investing errors", estimatedDuration: "15s" },
    { id: "fi_myth_busting", label: "Financial Myth Busting", icon: MessageSquare, prompt: "Debunk a common financial myth with evidence-based information.", model: "seedance_2.0", category: "tips_education", description: "Correct money misconceptions", estimatedDuration: "8s" },
    { id: "fi_advisor_intro", label: "Advisor Introduction", icon: Mic, prompt: "Create a personal introduction video. I'm [name], a financial advisor helping [audience].", model: "kling_2.6", category: "personal_brand", description: "Build client trust", estimatedDuration: "15s" },
    { id: "fi_firm_culture", label: "Our Firm Culture", icon: Users, prompt: "Create a video showing the culture and values of our financial advisory firm.", model: "seedance_2.0", category: "personal_brand", description: "Showcase your team", estimatedDuration: "15s" },
    { id: "fi_behind_numbers", label: "Behind the Numbers", icon: Camera, prompt: "Pull back the curtain on how you analyze investments or build financial plans.", model: "kling_2.6", category: "personal_brand", description: "Show your analytical process", estimatedDuration: "30s" },
    { id: "fi_office_tour", label: "Office Tour", icon: Building2, prompt: "Create a brief tour of your office space to make clients feel welcome.", model: "seedance_2.0", category: "personal_brand", description: "Invite clients into your space", estimatedDuration: "8s" },
    { id: "fi_thought_leader", label: "Market Perspective", icon: TrendingUp, prompt: "Share your perspective on [current market trend or economic event].", model: "kling_2.6", category: "personal_brand", description: "Establish market authority", estimatedDuration: "15s" },
    { id: "fi_client_win", label: "Client Win", icon: Award, prompt: "Share a client success story about financial goals achieved (anonymized).", model: "seedance_2.0", category: "client_stories", description: "Celebrate client milestones", estimatedDuration: "15s" },
    { id: "fi_retirement_story", label: "Retirement Success", icon: Star, prompt: "Create a video about helping a client successfully retire on their terms.", model: "kling_2.6", category: "client_stories", description: "Inspire with retirement wins", estimatedDuration: "30s" },
    { id: "fi_testimonial", label: "Client Testimonial", icon: Star, prompt: "Transform this client review into a video testimonial: [paste review]", model: "seedance_2.0", category: "client_stories", description: "Social proof through video", estimatedDuration: "15s" },
    { id: "fi_debt_free", label: "Debt-Free Journey", icon: Heart, prompt: "Create a video about helping a client become debt-free.", model: "seedance_2.0", category: "client_stories", description: "Motivating financial stories", estimatedDuration: "15s" },
    { id: "fi_wealth_milestone", label: "Wealth Milestone", icon: Award, prompt: "Create a video celebrating a client hitting a major wealth milestone.", model: "seedance_2.0", category: "client_stories", description: "Celebrate financial achievements", estimatedDuration: "8s" },
  ],
  medical: [
    { id: "me_health_news", label: "Health News Update", icon: Heart, prompt: "Create a video about the latest health news regarding [topic].", model: "seedance_2.0", category: "market_updates", description: "Keep patients informed", estimatedDuration: "15s" },
    { id: "me_seasonal_health", label: "Seasonal Health Alert", icon: Megaphone, prompt: "Create a seasonal health alert about [flu season/allergies/sun safety].", model: "seedance_2.0", category: "market_updates", description: "Timely health reminders", estimatedDuration: "8s" },
    { id: "me_new_treatment", label: "New Treatment Spotlight", icon: Lightbulb, prompt: "Create a video about a new treatment or procedure now available at your practice.", model: "kling_2.6", category: "market_updates", description: "Introduce new services", estimatedDuration: "15s" },
    { id: "me_research_update", label: "Research Roundup", icon: FileText, prompt: "Create a video summarizing recent research findings about [health topic].", model: "kling_2.6", category: "market_updates", description: "Translate research for patients", estimatedDuration: "30s" },
    { id: "me_guideline_change", label: "Guideline Update", icon: Shield, prompt: "Create a video about updated medical guidelines for [condition/screening].", model: "kling_2.6", category: "market_updates", description: "Explain guideline changes", estimatedDuration: "15s" },
    { id: "me_health_tip", label: "Health Tip", icon: Lightbulb, prompt: "Create a health tip video about [topic, e.g., sleep hygiene, heart health].", model: "seedance_2.0", category: "tips_education", description: "Quick actionable health advice", estimatedDuration: "8s" },
    { id: "me_procedure_explainer", label: "Procedure Explainer", icon: BookOpen, prompt: "Create a reassuring explainer about what patients can expect during [procedure].", model: "kling_2.6", category: "tips_education", description: "Reduce procedure anxiety", estimatedDuration: "30s" },
    { id: "me_myth_busting", label: "Medical Myth Busting", icon: MessageSquare, prompt: "Debunk a common health myth about [topic] with evidence-based information.", model: "seedance_2.0", category: "tips_education", description: "Correct health misinformation", estimatedDuration: "15s" },
    { id: "me_wellness", label: "Wellness Series", icon: Heart, prompt: "Create a wellness video about [topic]. Encourage healthy habits and preventive care.", model: "seedance_2.0", category: "tips_education", description: "Promote preventive wellness", estimatedDuration: "15s" },
    { id: "me_nutrition", label: "Nutrition Tips", icon: Heart, prompt: "Create a video with nutrition tips for [condition/general health].", model: "seedance_2.0", category: "tips_education", description: "Evidence-based dietary advice", estimatedDuration: "15s" },
    { id: "me_doctor_intro", label: "Doctor Introduction", icon: Mic, prompt: "Create a personal introduction video. I'm Dr. [name], specializing in [specialty].", model: "kling_2.6", category: "personal_brand", description: "Build patient rapport", estimatedDuration: "15s" },
    { id: "me_practice_tour", label: "Practice Tour", icon: Building2, prompt: "Create a welcoming tour of your medical practice for new patients.", model: "kling_2.6", category: "personal_brand", description: "Make patients feel at home", estimatedDuration: "15s" },
    { id: "me_team_spotlight", label: "Team Spotlight", icon: Users, prompt: "Introduce a member of your medical team and their role in patient care.", model: "seedance_2.0", category: "personal_brand", description: "Showcase your caring team", estimatedDuration: "15s" },
    { id: "me_why_chose", label: "Why I Chose Medicine", icon: Heart, prompt: "Share your personal story about why you chose to practice medicine.", model: "kling_2.6", category: "personal_brand", description: "Build emotional connection", estimatedDuration: "30s" },
    { id: "me_community", label: "Community Health Event", icon: Globe, prompt: "Create a video about your practice's community health event or initiative.", model: "seedance_2.0", category: "personal_brand", description: "Show community involvement", estimatedDuration: "15s" },
    { id: "me_patient_story", label: "Patient Success Story", icon: Award, prompt: "Create a video about a patient's health journey and recovery (with permission).", model: "kling_2.6", category: "client_stories", description: "Inspire with recovery stories", estimatedDuration: "30s" },
    { id: "me_testimonial", label: "Patient Testimonial", icon: Star, prompt: "Transform this patient review into a video testimonial: [paste review]", model: "seedance_2.0", category: "client_stories", description: "Build trust through patient voices", estimatedDuration: "15s" },
    { id: "me_before_after", label: "Treatment Results", icon: Star, prompt: "Create a video showcasing treatment results for [procedure/condition] (with consent).", model: "seedance_2.0", category: "client_stories", description: "Visual proof of outcomes", estimatedDuration: "15s" },
    { id: "me_gratitude", label: "Patient Gratitude", icon: Heart, prompt: "Create a video sharing a heartwarming patient gratitude story.", model: "seedance_2.0", category: "client_stories", description: "Emotional patient stories", estimatedDuration: "8s" },
    { id: "me_milestone", label: "Practice Milestone", icon: Award, prompt: "Celebrate a practice milestone: years of service, patients helped, procedures completed.", model: "seedance_2.0", category: "client_stories", description: "Celebrate your practice's impact", estimatedDuration: "8s" },
  ],
};

const genericTemplates: TemplateItem[] = [
  { id: "gen_industry_update", label: "Industry Update", icon: TrendingUp, prompt: "Share what's new in your industry this week.", model: "seedance_2.0", category: "market_updates", description: "Keep your audience informed", estimatedDuration: "15s" },
  { id: "gen_trend_analysis", label: "Trend Analysis", icon: BarChart3, prompt: "Analyze a current trend in your industry and its implications.", model: "kling_2.6", category: "market_updates", description: "Break down industry trends", estimatedDuration: "30s" },
  { id: "gen_news_reaction", label: "News Reaction", icon: Megaphone, prompt: "React to breaking news in your industry with your expert perspective.", model: "seedance_2.0", category: "market_updates", description: "Hot take on industry news", estimatedDuration: "8s" },
  { id: "gen_predictions", label: "Industry Predictions", icon: Target, prompt: "Share your predictions for [topic/quarter/year] in your industry.", model: "kling_2.6", category: "market_updates", description: "Position yourself as forward-thinking", estimatedDuration: "15s" },
  { id: "gen_weekly_wrap", label: "Weekly Wrap-Up", icon: BarChart3, prompt: "Wrap up the week's biggest stories and developments in your field.", model: "seedance_2.0", category: "market_updates", description: "End the week with key takeaways", estimatedDuration: "15s" },
  { id: "gen_quick_tip", label: "Quick Tip", icon: Lightbulb, prompt: "Share an actionable tip your audience can use right away.", model: "seedance_2.0", category: "tips_education", description: "Bite-sized value for followers", estimatedDuration: "8s" },
  { id: "gen_how_to", label: "How-To Guide", icon: BookOpen, prompt: "Create a step-by-step guide on [topic in your expertise].", model: "kling_2.6", category: "tips_education", description: "Teach something practical", estimatedDuration: "30s" },
  { id: "gen_common_mistakes", label: "Common Mistakes", icon: Shield, prompt: "Share the top mistakes people make in [topic] and how to avoid them.", model: "seedance_2.0", category: "tips_education", description: "Help people avoid pitfalls", estimatedDuration: "15s" },
  { id: "gen_myth_busting", label: "Myth Busting", icon: MessageSquare, prompt: "Debunk a common misconception about [topic in your field].", model: "seedance_2.0", category: "tips_education", description: "Correct common myths", estimatedDuration: "8s" },
  { id: "gen_explainer", label: "Concept Explainer", icon: FileText, prompt: "Explain [complex concept] in simple terms anyone can understand.", model: "kling_2.6", category: "tips_education", description: "Make the complex simple", estimatedDuration: "30s" },
  { id: "gen_brand_intro", label: "Brand Introduction", icon: Mic, prompt: "Create a personal brand introduction video. I'm [name], I help [audience] with [value proposition].", model: "kling_2.6", category: "personal_brand", description: "Tell your story compellingly", estimatedDuration: "15s" },
  { id: "gen_behind_scenes", label: "Behind the Scenes", icon: Camera, prompt: "Give your audience a peek behind the curtain of your work.", model: "seedance_2.0", category: "personal_brand", description: "Build authentic connection", estimatedDuration: "15s" },
  { id: "gen_day_in_life", label: "Day in the Life", icon: Camera, prompt: "Show what a typical day looks like in your professional life.", model: "seedance_2.0", category: "personal_brand", description: "Relatable daily content", estimatedDuration: "15s" },
  { id: "gen_values", label: "Our Values", icon: Heart, prompt: "Create a video about the core values that drive your work.", model: "kling_2.6", category: "personal_brand", description: "Connect through shared values", estimatedDuration: "15s" },
  { id: "gen_thought_leader", label: "Thought Leadership", icon: TrendingUp, prompt: "Share your perspective on [trending topic in your industry].", model: "kling_2.6", category: "personal_brand", description: "Establish authority", estimatedDuration: "30s" },
  { id: "gen_testimonial", label: "Client Testimonial", icon: Star, prompt: "Transform this client review into a video testimonial: [paste review]", model: "seedance_2.0", category: "client_stories", description: "Turn reviews into content", estimatedDuration: "15s" },
  { id: "gen_case_study", label: "Case Study", icon: Award, prompt: "Create a video case study about how you helped [client type] achieve [result].", model: "kling_2.6", category: "client_stories", description: "Show real results", estimatedDuration: "30s" },
  { id: "gen_success_story", label: "Success Story", icon: Star, prompt: "Share a client success story that demonstrates the impact of your work.", model: "seedance_2.0", category: "client_stories", description: "Inspire with outcomes", estimatedDuration: "15s" },
  { id: "gen_before_after", label: "Before & After", icon: Star, prompt: "Create a before-and-after video showcasing the transformation you provide.", model: "seedance_2.0", category: "client_stories", description: "Visual proof of impact", estimatedDuration: "8s" },
  { id: "gen_client_journey", label: "Client Journey", icon: Users, prompt: "Create a video following a client's journey from start to successful outcome.", model: "kling_2.6", category: "client_stories", description: "Full transformation story", estimatedDuration: "30s" },
];

// ─── Chat Types ───────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  videoData?: { videoId: string; title: string; model: string; status: string; videoUrl: string | null; error?: string };
  showProgress?: boolean;
}

const modelLabels: Record<string, string> = { "kling_2.6": "Kling 2.6", "seedance_2.0": "Seedance 2.0" };

function GeneratePageInner() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"kling_2.6" | "seedance_2.0">("kling_2.6");
  const [selectedFormat, setSelectedFormat] = useState("talking_head_15");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [industry] = useState("other");
  const [activeTemplateCategory, setActiveTemplateCategory] = useState("all");
  const [showGallery, setShowGallery] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const activeStatusMsgIdRef = useRef<string | null>(null);

  const { progress, stepLabel } = useGenerationProgress({
    videoId: activeVideoId, enabled: isGenerating && !!activeVideoId, interval: 3000,
    onComplete: useCallback((video: { videoUrl: string | null }) => {
      const msgId = activeStatusMsgIdRef.current;
      if (msgId) { setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, content: "Your video is ready! Review it below.", showProgress: false, videoData: m.videoData ? { ...m.videoData, status: "review", videoUrl: video.videoUrl } : undefined } : m)); }
      setIsGenerating(false); setActiveVideoId(null);
    }, []),
    onError: useCallback((errorMsg: string) => {
      const msgId = activeStatusMsgIdRef.current;
      if (msgId) { setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, content: `Generation failed: ${errorMsg}. Saved as a draft -- retry from the content library.`, showProgress: false, videoData: m.videoData ? { ...m.videoData, status: "failed", error: errorMsg } : undefined } : m)); }
      setIsGenerating(false); setActiveVideoId(null);
    }, []),
  });

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    const format = searchParams.get("format");
    if (prompt) setInput(prompt);
    if (format) setSelectedFormat(format);
    if (prompt) setShowGallery(false);
  }, [searchParams]);

  useEffect(() => {
    if (messages.length === 0 && !searchParams.get("prompt")) {
      setMessages([{ id: "welcome", role: "assistant", content: "What would you like to create today? Pick a template below or describe your video.", timestamp: new Date() }]);
    }
  }, [industry, messages.length, searchParams]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const addMessage = (msg: Omit<ChatMessage, "id" | "timestamp">) => { const newMsg = { ...msg, id: `msg-${Date.now()}-${Math.random()}`, timestamp: new Date() }; setMessages((prev) => [...prev, newMsg]); return newMsg; };
  const updateMessage = (id: string, updates: Partial<ChatMessage>) => { setMessages((prev) => prev.map((m) => m.id === id ? { ...m, ...updates } : m)); };

  const templates = industryTemplateGallery[industry] || genericTemplates;
  const filteredTemplates = activeTemplateCategory === "all" ? templates : templates.filter((t) => t.category === activeTemplateCategory);

  const handleTemplateSelect = (template: TemplateItem) => {
    setSelectedModel(template.model);
    const formatMap: Record<string, string> = { "8s": "quick_tip_8", "15s": "talking_head_15", "30s": "educational_30" };
    setSelectedFormat(formatMap[template.estimatedDuration] || "talking_head_15");
    setInput(template.prompt); setShowGallery(false); inputRef.current?.focus();
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const userMsg = input.trim(); setInput(""); setShowGallery(false);
    addMessage({ role: "user", content: userMsg }); setIsGenerating(true);
    const formatLabels: Record<string, string> = { talking_head_15: "Talking Head (15s, 4 cuts)", testimonial_15: "Testimonial (15s, 5 cuts)", educational_30: "Educational (30s, 8 cuts)", quick_tip_8: "Quick Tip (8s, 3 cuts)" };
    const statusMsg = addMessage({ role: "assistant", content: `Building a **${formatLabels[selectedFormat] || selectedFormat}** with **${modelLabels[selectedModel]}**...`, showProgress: true });
    activeStatusMsgIdRef.current = statusMsg.id;
    try {
      const createRes = await fetch("/api/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: userMsg.length > 100 ? userMsg.substring(0, 100) + "..." : userMsg, description: userMsg, script: userMsg, model: selectedModel, contentType: selectedFormat }) });
      if (!createRes.ok) throw new Error("Failed to create video");
      const video = await createRes.json();
      const genRes = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ videoId: video.id, model: selectedModel, script: userMsg, format: selectedFormat }) });
      const genData = genRes.ok ? await genRes.json() : null;
      const videoId = genData?.video?.id || video.id;
      updateMessage(statusMsg.id, { videoData: { videoId, title: genData?.video?.title || video.title, model: selectedModel, status: "generating", videoUrl: null } });
      setActiveVideoId(videoId);
    } catch (err: any) {
      updateMessage(statusMsg.id, { content: `Something went wrong: ${err.message}. Saved as a draft -- retry from the content library.`, showProgress: false });
      setIsGenerating(false); setActiveVideoId(null);
    }
  };

  const handleApprove = async (msgId: string, videoId: string) => {
    try { await fetch(`/api/videos/${videoId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "approved" }) }); setMessages((prev) => prev.map((m) => m.id === msgId && m.videoData ? { ...m, videoData: { ...m.videoData, status: "approved" } } : m)); addMessage({ role: "assistant", content: "Approved! The video is ready to publish. You can schedule it from the calendar or publish now." }); } catch {}
  };

  const handleRegenerate = async (msgId: string, videoId: string) => {
    setIsGenerating(true);
    try { await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ videoId, model: selectedModel }) }); setMessages((prev) => prev.map((m) => m.id === msgId && m.videoData ? { ...m, showProgress: true, content: "Regenerating your video...", videoData: { ...m.videoData, status: "generating", videoUrl: null } } : m)); activeStatusMsgIdRef.current = msgId; setActiveVideoId(videoId); } catch { setIsGenerating(false); }
  };

  const handleRetry = async (msgId: string, videoId: string) => {
    setIsGenerating(true);
    try {
      const retryRes = await fetch("/api/generate/retry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ videoId }) });
      if (!retryRes.ok) { const errData = await retryRes.json().catch(() => ({})); throw new Error(errData.error || "Retry failed"); }
      await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ videoId, model: selectedModel, format: selectedFormat }) });
      setMessages((prev) => prev.map((m) => m.id === msgId && m.videoData ? { ...m, content: "Retrying generation...", showProgress: true, videoData: { ...m.videoData, status: "generating", videoUrl: null, error: undefined } } : m));
      activeStatusMsgIdRef.current = msgId; setActiveVideoId(videoId);
    } catch (err: any) { addMessage({ role: "assistant", content: `Retry failed: ${err.message}` }); setIsGenerating(false); }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 7rem - env(safe-area-inset-bottom, 0px))" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 flex-shrink-0">
        <div className="min-w-0"><h1 className="text-xl font-bold">Create Video</h1><p className="text-xs text-white/30 mt-0.5">Describe what you want and we will generate it</p></div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)} className="px-3 py-2.5 min-h-[44px] rounded-xl border border-white/[0.06] bg-transparent text-[13px] text-white/60 hover:border-white/10 transition-all appearance-none cursor-pointer flex-1 sm:flex-none">
            <option value="quick_tip_8" className="bg-[#0c1018]">Quick Tip (8s)</option>
            <option value="talking_head_15" className="bg-[#0c1018]">Talking Head (15s)</option>
            <option value="testimonial_15" className="bg-[#0c1018]">Testimonial (15s)</option>
            <option value="educational_30" className="bg-[#0c1018]">Educational (30s)</option>
          </select>
          <div className="relative">
            <button onClick={() => setShowModelPicker(!showModelPicker)} className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-xl border border-white/[0.06] text-[13px] text-white/60 hover:border-white/10 active:bg-white/[0.03] transition-all">
              {selectedModel === "kling_2.6" ? (<><Cpu className="w-3.5 h-3.5 text-blue-400" /> <span className="hidden sm:inline">Kling 2.6</span><span className="sm:hidden">Kling</span></>) : (<><Zap className="w-3.5 h-3.5 text-purple-400" /> <span className="hidden sm:inline">Seedance 2.0</span><span className="sm:hidden">Seedance</span></>)}
              <ChevronDown className="w-3 h-3 text-white/20" />
            </button>
            {showModelPicker && (<div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-white/[0.06] bg-[#0c1018] p-1.5 z-50 shadow-2xl">
              {(["kling_2.6", "seedance_2.0"] as const).map((m) => (<button key={m} onClick={() => { setSelectedModel(m); setShowModelPicker(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-sm transition-all min-h-[48px] ${selectedModel === m ? "bg-white/[0.06]" : "hover:bg-white/[0.03] active:bg-white/[0.06]"}`}>
                {m === "kling_2.6" ? <Cpu className="w-4 h-4 text-blue-400" /> : <Zap className="w-4 h-4 text-purple-400" />}
                <div><div className="text-[13px] font-medium text-white/80">{modelLabels[m]}</div><div className="text-[11px] text-white/25">{m === "kling_2.6" ? "Hyper-realistic" : "Creative & dynamic"}</div></div>
                {selectedModel === m && <Check className="w-3.5 h-3.5 text-white/40 ml-auto" />}
              </button>))}
            </div>)}
          </div>
        </div>
      </div>

      {/* Template Gallery (Item 16) */}
      {showGallery && (<div className="flex-shrink-0 mb-4">
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
          {templateCategories.map((cat) => (<button key={cat.id} onClick={() => setActiveTemplateCategory(cat.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTemplateCategory === cat.id ? "bg-white/[0.08] text-white/80 border border-white/[0.08]" : "text-white/30 hover:text-white/50 border border-transparent"}`}>{cat.label}</button>))}
        </div>
        <div className="max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredTemplates.map((tmpl) => (<button key={tmpl.id} onClick={() => handleTemplateSelect(tmpl)} className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.015] transition-all text-left group">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] transition-colors"><tmpl.icon className="w-4 h-4 text-white/25 group-hover:text-white/40 transition-colors" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2"><span className="text-[13px] font-medium text-white/70 group-hover:text-white/90 transition-colors truncate">{tmpl.label}</span><span className="text-[10px] text-white/20 flex-shrink-0">{tmpl.estimatedDuration}</span></div>
                <p className="text-[11px] text-white/25 mt-0.5 line-clamp-1">{tmpl.description}</p>
                <div className="flex items-center gap-2 mt-1.5"><span className="text-[9px] text-white/15">{modelLabels[tmpl.model]}</span><ChevronRight className="w-2.5 h-2.5 text-white/10 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
              </div>
            </button>))}
          </div>
        </div>
      </div>)}

      {!showGallery && messages.length <= 1 && (<button onClick={() => setShowGallery(true)} className="flex items-center gap-2 text-xs text-white/25 hover:text-white/40 transition-colors mb-3 flex-shrink-0"><Sparkles className="w-3 h-3" />Show template gallery</button>)}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pb-4">
        {messages.map((msg) => (<div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}><div className="max-w-[90%]"><div className="flex items-start gap-3">
          {msg.role === "assistant" && (<div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5"><Sparkles className="w-3.5 h-3.5 text-white/40" /></div>)}
          <div className="flex-1">
            <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${msg.role === "user" ? "bg-white/[0.06] border border-white/[0.04] rounded-br-md" : "bg-transparent"}`}>{msg.content.split("**").map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-medium">{part}</strong> : <span key={i} className="text-white/70">{part}</span>)}</div>
            {msg.showProgress && msg.videoData?.status === "generating" && (<div className="mt-3 px-4"><GenerationProgressBar progress={msg.id === activeStatusMsgIdRef.current ? progress : null} compact /></div>)}
            {msg.videoData && (<div className="mt-3">
              <div className="rounded-xl border border-white/[0.04] overflow-hidden">
                <div className="aspect-video bg-white/[0.02] relative flex items-center justify-center">
                  {msg.videoData.videoUrl ? (<video src={msg.videoData.videoUrl} controls playsInline muted className="w-full h-full object-cover" />) : msg.videoData.status === "generating" ? (<div className="flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 text-white/20 animate-spin" /><span className="text-[11px] text-white/20">{msg.id === activeStatusMsgIdRef.current ? stepLabel : "Generating..."}</span></div>) : (<Film className="w-8 h-8 text-white/[0.06]" />)}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur rounded-full">{msg.videoData.model === "kling_2.6" ? <Cpu className="w-3 h-3 text-white/60" /> : <Zap className="w-3 h-3 text-white/60" />}<span className="text-[10px] font-medium text-white/60">{modelLabels[msg.videoData.model] || msg.videoData.model}</span></div>
                  {msg.videoData.status === "approved" && (<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-green-500/80 backdrop-blur rounded-full"><Check className="w-3 h-3 text-white" /><span className="text-[10px] font-semibold text-white">Approved</span></div>)}
                  {msg.videoData.status === "failed" && (<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-red-500/80 backdrop-blur rounded-full"><X className="w-3 h-3 text-white" /><span className="text-[10px] font-semibold text-white">Failed</span></div>)}
                </div>
                <div className="px-4 py-3"><div className="text-[13px] font-medium text-white/80 truncate">{msg.videoData.title}</div></div>
              </div>
              {msg.videoData.status === "review" && (<div className="flex gap-2 mt-3">
                <button onClick={() => handleApprove(msg.id, msg.videoData!.videoId)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#050508] text-[13px] font-medium hover:bg-white/90 transition-all"><Check className="w-3.5 h-3.5" /> Approve</button>
                <button onClick={() => handleRegenerate(msg.id, msg.videoData!.videoId)} disabled={isGenerating} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.06] text-[13px] text-white/50 hover:bg-white/[0.03] transition-all"><RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} /> Regenerate</button>
              </div>)}
              {msg.videoData.status === "failed" && (<div className="mt-3 space-y-2">
                {msg.videoData.error && (<div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400/80">{msg.videoData.error}</div>)}
                <button onClick={() => handleRetry(msg.id, msg.videoData!.videoId)} disabled={isGenerating} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[13px] text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"><RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} /> Retry Generation</button>
              </div>)}
            </div>)}
          </div>
        </div></div></div>))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-4 border-t border-white/[0.04]">
        <div className="flex items-end gap-3"><div className="flex-1 relative">
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Describe what you want to create..." className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 pr-14 text-[14px] text-white/80 placeholder:text-white/15 resize-none focus:outline-none focus:border-white/[0.12] transition-colors min-h-[48px] max-h-[120px]" rows={1} enterKeyHint="send" />
          <button onClick={handleSend} disabled={!input.trim() || isGenerating} className="absolute right-2 bottom-2 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:opacity-10 flex items-center justify-center transition-colors"><Send className="w-4 h-4 text-white/70" /></button>
        </div></div>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-white/15"><span className="flex items-center gap-1">{selectedModel === "kling_2.6" ? <Cpu className="w-3 h-3" /> : <Zap className="w-3 h-3" />}{modelLabels[selectedModel]}</span><span>·</span><span>Enter to send</span></div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-32"><Loader2 className="w-5 h-5 text-white/20 animate-spin" /></div>}>
      <GeneratePageInner />
    </Suspense>
  );
}
