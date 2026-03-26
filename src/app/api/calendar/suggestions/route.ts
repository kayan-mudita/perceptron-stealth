import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";

/**
 * POST /api/calendar/suggestions
 *
 * Returns 30 days of AI-suggested content topics based on industry.
 * Uses hardcoded templates for now -- can be upgraded to LLM-generated later.
 */

interface DaySuggestion {
  date: string; // ISO date string (YYYY-MM-DD)
  dayOfWeek: string;
  topic: string;
  category: string;
  description: string;
  suggestedFormat: string;
}

const industrySuggestions: Record<string, { day: number; topic: string; category: string; description: string; format: string }[]> = {
  real_estate: [
    { day: 1, topic: "Market Update", category: "Education", description: "Share this week's local market stats, inventory levels, and pricing trends.", format: "talking_head_15" },
    { day: 3, topic: "Quick Tip", category: "Tips", description: "Share a quick tip for buyers or sellers in today's market.", format: "quick_tip_8" },
    { day: 5, topic: "Behind the Scenes", category: "Personal Brand", description: "Show a day in your life as an agent -- showings, paperwork, closings.", format: "talking_head_15" },
    { day: 2, topic: "Just Listed Spotlight", category: "Listings", description: "Showcase your newest listing with key features and pricing.", format: "talking_head_15" },
    { day: 4, topic: "Neighborhood Guide", category: "Education", description: "Highlight a local neighborhood -- restaurants, schools, community vibe.", format: "educational_30" },
    { day: 6, topic: "Client Success Story", category: "Social Proof", description: "Share a recent closing story (with permission) to build trust.", format: "testimonial_15" },
    { day: 0, topic: "Open House Promo", category: "Listings", description: "Promote upcoming open houses for the week ahead.", format: "quick_tip_8" },
  ],
  legal: [
    { day: 1, topic: "Know Your Rights", category: "Education", description: "Explain a common legal right people often overlook.", format: "talking_head_15" },
    { day: 3, topic: "Legal Tip of the Week", category: "Tips", description: "Share a practical legal tip your audience can use today.", format: "quick_tip_8" },
    { day: 5, topic: "Behind the Scenes", category: "Personal Brand", description: "Show what a typical day at your firm looks like.", format: "talking_head_15" },
    { day: 2, topic: "Case Study Highlight", category: "Social Proof", description: "Share an anonymized case result that demonstrates your expertise.", format: "testimonial_15" },
    { day: 4, topic: "Legal Process Explainer", category: "Education", description: "Walk through a legal process step by step for your audience.", format: "educational_30" },
    { day: 6, topic: "FAQ Friday", category: "Education", description: "Answer a frequently asked question from potential clients.", format: "quick_tip_8" },
    { day: 0, topic: "Week Ahead Preview", category: "Personal Brand", description: "Preview what's coming this week -- new content, consultations available.", format: "quick_tip_8" },
  ],
  finance: [
    { day: 1, topic: "Market Monday", category: "Education", description: "Recap last week's market moves and what to watch this week.", format: "talking_head_15" },
    { day: 3, topic: "Financial Tip", category: "Tips", description: "Share a quick actionable financial tip for your audience.", format: "quick_tip_8" },
    { day: 5, topic: "Behind the Numbers", category: "Personal Brand", description: "Pull back the curtain on how you analyze investments or financial plans.", format: "talking_head_15" },
    { day: 2, topic: "Tax Strategy Spotlight", category: "Education", description: "Highlight a tax strategy or financial planning concept.", format: "educational_30" },
    { day: 4, topic: "Client Win", category: "Social Proof", description: "Share a client success story (anonymized) about financial goals achieved.", format: "testimonial_15" },
    { day: 6, topic: "Myth Busting", category: "Education", description: "Debunk a common financial myth or misconception.", format: "quick_tip_8" },
    { day: 0, topic: "Week in Review", category: "Education", description: "Summarize key financial news and takeaways from the week.", format: "talking_head_15" },
  ],
  medical: [
    { day: 1, topic: "Health Tip Monday", category: "Tips", description: "Share a health tip to start the week on a positive note.", format: "quick_tip_8" },
    { day: 3, topic: "Wellness Wednesday", category: "Education", description: "Cover a wellness topic -- nutrition, exercise, mental health.", format: "talking_head_15" },
    { day: 5, topic: "Behind the Scenes", category: "Personal Brand", description: "Show what a day at your practice looks like (HIPAA-compliant).", format: "talking_head_15" },
    { day: 2, topic: "Procedure Explainer", category: "Education", description: "Explain what patients can expect during a common procedure.", format: "educational_30" },
    { day: 4, topic: "Patient FAQ", category: "Education", description: "Answer a frequently asked patient question.", format: "quick_tip_8" },
    { day: 6, topic: "Medical Myth Busting", category: "Education", description: "Debunk a common health myth with evidence-based information.", format: "quick_tip_8" },
    { day: 0, topic: "Self-Care Sunday", category: "Tips", description: "Share self-care advice to encourage healthy weekend habits.", format: "quick_tip_8" },
  ],
};

// Default templates for any industry not explicitly mapped
const defaultSuggestions = [
  { day: 1, topic: "Industry Update", category: "Education", description: "Share what's new in your industry this week.", format: "talking_head_15" },
  { day: 3, topic: "Quick Tip", category: "Tips", description: "Share an actionable tip your audience can use right away.", format: "quick_tip_8" },
  { day: 5, topic: "Behind the Scenes", category: "Personal Brand", description: "Give your audience a peek behind the curtain of your work.", format: "talking_head_15" },
  { day: 2, topic: "Educational Deep Dive", category: "Education", description: "Go deeper on a topic your audience cares about.", format: "educational_30" },
  { day: 4, topic: "Client Story", category: "Social Proof", description: "Share a success story or testimonial to build credibility.", format: "testimonial_15" },
  { day: 6, topic: "FAQ Answer", category: "Education", description: "Answer a question you get asked all the time.", format: "quick_tip_8" },
  { day: 0, topic: "Week Preview", category: "Personal Brand", description: "Preview what's coming this week from you.", format: "quick_tip_8" },
];

export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    let body: { industry?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Use user's industry if no body provided
    }

    const industry = body.industry || user.industry || "other";
    const templates = industrySuggestions[industry] || defaultSuggestions;

    // Generate 30 days of suggestions starting from today
    const today = new Date();
    const suggestions: DaySuggestion[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ...

      const template = templates.find((t) => t.day === dayOfWeek);
      if (template) {
        suggestions.push({
          date: date.toISOString().split("T")[0],
          dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek],
          topic: template.topic,
          category: template.category,
          description: template.description,
          suggestedFormat: template.format,
        });
      }
    }

    return NextResponse.json({
      industry,
      suggestions,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/calendar/suggestions] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
