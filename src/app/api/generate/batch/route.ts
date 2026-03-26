import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

/**
 * POST /api/generate/batch
 *
 * Accepts { count: 3 | 5 | 7 } and creates multiple video records
 * using template gallery suggestions based on the user's industry.
 * Each video is assigned a different template.
 *
 * Returns the batch with video IDs so the frontend can poll progress.
 */

const industryTemplates: Record<string, { label: string; prompt: string; model: string; contentType: string }[]> = {
  real_estate: [
    { label: "Listing Video Tour", prompt: "Create a property walkthrough video highlighting key features", model: "kling_2.6", contentType: "talking_head_15" },
    { label: "Weekly Market Update", prompt: "Create a market update video covering inventory and pricing trends", model: "seedance_2.0", contentType: "educational_30" },
    { label: "Just Sold Celebration", prompt: "Create a Just Sold announcement video congratulating the buyers", model: "seedance_2.0", contentType: "quick_tip_8" },
    { label: "Open House Invite", prompt: "Create an open house invitation video that is warm and inviting", model: "seedance_2.0", contentType: "testimonial_15" },
    { label: "Neighborhood Spotlight", prompt: "Create a neighborhood spotlight covering restaurants, schools, and parks", model: "kling_2.6", contentType: "educational_30" },
    { label: "Buyer Tips", prompt: "Create an educational video with tips for first-time buyers in today's market", model: "kling_2.6", contentType: "talking_head_15" },
    { label: "Seller Tips", prompt: "Create an educational video with tips for sellers to maximize their home value", model: "seedance_2.0", contentType: "talking_head_15" },
  ],
  legal: [
    { label: "Know Your Rights", prompt: "Create a Know Your Rights video about common legal topics", model: "kling_2.6", contentType: "talking_head_15" },
    { label: "Legal Tip of the Week", prompt: "Create a weekly legal tip video for a general audience", model: "seedance_2.0", contentType: "quick_tip_8" },
    { label: "Case Result Highlight", prompt: "Create a video highlighting a recent case result", model: "seedance_2.0", contentType: "testimonial_15" },
    { label: "Legal Process Explainer", prompt: "Create an explainer video about a common legal process", model: "kling_2.6", contentType: "educational_30" },
    { label: "FAQ Video", prompt: "Answer the most common legal questions your clients ask", model: "kling_2.6", contentType: "talking_head_15" },
    { label: "Client Testimonial", prompt: "Transform a client review into a video testimonial", model: "seedance_2.0", contentType: "testimonial_15" },
    { label: "Legal Myth Busting", prompt: "Bust a common legal myth that confuses people", model: "kling_2.6", contentType: "quick_tip_8" },
  ],
  medical: [
    { label: "Health Tip", prompt: "Create a patient-friendly health tip video", model: "seedance_2.0", contentType: "quick_tip_8" },
    { label: "Procedure Explainer", prompt: "Create a reassuring explainer video about what patients can expect", model: "kling_2.6", contentType: "educational_30" },
    { label: "Wellness Series", prompt: "Create a wellness video encouraging healthy habits", model: "seedance_2.0", contentType: "talking_head_15" },
    { label: "Medical Myth Busting", prompt: "Create a myth-busting video about a common misconception", model: "kling_2.6", contentType: "quick_tip_8" },
    { label: "Patient FAQ", prompt: "Answer the most common questions patients ask your practice", model: "kling_2.6", contentType: "talking_head_15" },
    { label: "Prevention Tips", prompt: "Share preventive care tips that keep your patients healthy", model: "seedance_2.0", contentType: "educational_30" },
    { label: "Team Introduction", prompt: "Introduce your medical team and what makes your practice special", model: "kling_2.6", contentType: "testimonial_15" },
  ],
  default: [
    { label: "Brand Introduction", prompt: "Create a personal brand introduction video", model: "kling_2.6", contentType: "talking_head_15" },
    { label: "Quick Tip", prompt: "Create a quick tip video sharing your expertise", model: "seedance_2.0", contentType: "quick_tip_8" },
    { label: "Thought Leadership", prompt: "Share your perspective on a trending topic in your industry", model: "kling_2.6", contentType: "educational_30" },
    { label: "Client Testimonial", prompt: "Transform a client review into a video testimonial", model: "seedance_2.0", contentType: "testimonial_15" },
    { label: "Behind the Scenes", prompt: "Show your audience what goes on behind the scenes", model: "kling_2.6", contentType: "talking_head_15" },
    { label: "Industry Update", prompt: "Create a video about the latest trends in your industry", model: "seedance_2.0", contentType: "educational_30" },
    { label: "How-To Guide", prompt: "Create a step-by-step how-to video for your audience", model: "kling_2.6", contentType: "talking_head_15" },
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    let body: { count?: number };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const count = body.count;
    if (!count || ![3, 5, 7].includes(count)) {
      return NextResponse.json(
        { error: "count must be 3, 5, or 7" },
        { status: 400 }
      );
    }

    // Get user's industry for template selection
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
      select: { industry: true },
    });
    const industry = userRecord?.industry || "other";
    const templates = industryTemplates[industry] || industryTemplates.default;

    // Select unique templates (cycle if count > templates.length)
    const selectedTemplates = [];
    for (let i = 0; i < count; i++) {
      selectedTemplates.push(templates[i % templates.length]);
    }

    // Create video records in sequence
    const videos = [];
    for (const template of selectedTemplates) {
      const video = await prisma.video.create({
        data: {
          userId: user.id,
          title: template.label,
          description: template.prompt,
          script: template.prompt,
          model: template.model,
          contentType: template.contentType,
          status: "draft",
        },
      });
      videos.push({
        id: video.id,
        title: video.title,
        model: video.model,
        contentType: video.contentType,
        status: video.status,
      });
    }

    return NextResponse.json({
      batchId: `batch_${Date.now()}`,
      count: videos.length,
      videos,
    });
  } catch (err) {
    console.error("[POST /api/generate/batch]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
