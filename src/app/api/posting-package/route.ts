import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-helpers";

// Industry-relevant hashtag pools
const hashtagPools: Record<string, string[]> = {
  technology: ["#tech", "#innovation", "#AI", "#startups", "#digital", "#coding", "#software", "#futuretech", "#machinelearning", "#automation", "#SaaS", "#techlife", "#programming", "#devlife", "#techtrends"],
  marketing: ["#marketing", "#digitalmarketing", "#contentcreator", "#socialmedia", "#branding", "#growthhacking", "#marketingtips", "#contentmarketing", "#SEO", "#brand", "#startup", "#entrepreneur", "#business", "#creative", "#strategy"],
  fitness: ["#fitness", "#workout", "#health", "#gym", "#fitlife", "#motivation", "#training", "#wellness", "#fitnessmotivation", "#healthylifestyle", "#bodybuilding", "#exercise", "#strength", "#fitnessjourney", "#gains"],
  realestate: ["#realestate", "#realtor", "#property", "#homes", "#investment", "#luxuryhomes", "#househunting", "#dreamhome", "#realtorlife", "#homesforsale", "#broker", "#commercialrealestate", "#firsttimebuyer", "#sold", "#openhouse"],
  finance: ["#finance", "#investing", "#money", "#wealth", "#stocks", "#financialfreedom", "#personalfinance", "#crypto", "#trading", "#budgeting", "#passiveincome", "#wealthbuilding", "#financetips", "#moneytips", "#invest"],
  other: ["#content", "#creator", "#viral", "#trending", "#fyp", "#explore", "#business", "#tips", "#growth", "#success", "#motivation", "#hustle", "#learn", "#share", "#community"],
};

// Time recommendations by platform and day
const optimalPostingTimes: Record<string, { day: string; time: string; reason: string }[]> = {
  instagram: [
    { day: "Tuesday", time: "11:00 AM", reason: "Peak engagement during mid-morning scroll" },
    { day: "Wednesday", time: "10:00 AM", reason: "Highest reach for Reels content" },
    { day: "Thursday", time: "2:00 PM", reason: "Strong afternoon engagement window" },
    { day: "Friday", time: "10:00 AM", reason: "Weekend planning browsing peak" },
  ],
  tiktok: [
    { day: "Tuesday", time: "9:00 AM", reason: "Early bird algorithm boost" },
    { day: "Thursday", time: "12:00 PM", reason: "Lunch break viral window" },
    { day: "Friday", time: "5:00 PM", reason: "Weekend binge-watch session start" },
    { day: "Saturday", time: "11:00 AM", reason: "Weekend content discovery peak" },
  ],
  linkedin: [
    { day: "Tuesday", time: "8:00 AM", reason: "Professional morning feed check" },
    { day: "Wednesday", time: "10:00 AM", reason: "Mid-week engagement sweet spot" },
    { day: "Thursday", time: "9:00 AM", reason: "Strong B2B engagement window" },
  ],
};

function pickHashtags(industry: string, count: number = 12): string[] {
  const pool = hashtagPools[industry] || hashtagPools.other;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getNextOptimalTime(platform: string): { day: string; time: string; reason: string } {
  const times = optimalPostingTimes[platform] || optimalPostingTimes.instagram;
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Find next optimal day
  for (const slot of times) {
    const slotDayIdx = dayNames.indexOf(slot.day);
    if (slotDayIdx > dayOfWeek) return slot;
  }
  return times[0]; // wrap to next week
}

function generateInstagramCaption(title: string, script: string, industry: string): string {
  const hookLine = script
    ? script.split(/[.!?\n]/).filter(Boolean)[0]?.trim() || title
    : title;

  const hashtags = pickHashtags(industry, 10);

  return `${hookLine} \u{1F525}\n\nThis is the kind of content that changes the game. Save this for later and share it with someone who needs to see it. \u{1F4A1}\n\nDrop a \u{1F64C} in the comments if you agree!\n\n${hashtags.join(" ")}\n\n#contentcreator #viral #fyp`;
}

function generateTikTokCaption(title: string, script: string, industry: string): string {
  const hookLine = script
    ? script.split(/[.!?\n]/).filter(Boolean)[0]?.trim() || title
    : title;

  const trending = ["#fyp", "#viral", "#foryou", "#trending"];
  const industryTags = pickHashtags(industry, 4);

  return `${hookLine} \u{1F631}\n\nWait for it... \u{1F525}\n\n${trending.join(" ")} ${industryTags.join(" ")}`;
}

function generateLinkedInCaption(title: string, script: string, industry: string): string {
  const hookLine = script
    ? script.split(/[.!?\n]/).filter(Boolean)[0]?.trim() || title
    : title;

  const bodyContent = script && script.length > 100
    ? script.substring(0, 300).trim()
    : `The landscape of ${industry} is shifting faster than ever. Here is what most people are missing.`;

  return `${hookLine}\n\n${bodyContent}\n\nHere are 3 key takeaways:\n\n1. Start before you feel ready\n2. Consistency beats perfection\n3. The best time to begin was yesterday\n\nWhat are your thoughts on this? I would love to hear your perspective in the comments.\n\n#${industry} #contentcreation #growthmindset #leadership #innovation`;
}

export async function POST(req: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    let body: { videoId: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body.videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    // Fetch video with user details
    const video = await prisma.video.findFirst({
      where: { id: body.videoId, userId: user.id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Get user industry for relevant hashtags
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
      select: { industry: true },
    });
    const industry = userRecord?.industry || "other";

    const title = video.title;
    const script = video.script || "";

    // Generate captions for each platform
    const instagramCaption = generateInstagramCaption(title, script, industry);
    const tiktokCaption = generateTikTokCaption(title, script, industry);
    const linkedinCaption = generateLinkedInCaption(title, script, industry);

    // Get optimal posting times
    const instagramTime = getNextOptimalTime("instagram");
    const tiktokTime = getNextOptimalTime("tiktok");
    const linkedinTime = getNextOptimalTime("linkedin");

    // Generate hashtag set
    const hashtags = pickHashtags(industry, 15);

    const postingPackage = {
      videoId: video.id,
      videoTitle: video.title,
      generatedAt: new Date().toISOString(),
      captions: {
        instagram: instagramCaption,
        tiktok: tiktokCaption,
        linkedin: linkedinCaption,
      },
      recommendedTimes: {
        instagram: instagramTime,
        tiktok: tiktokTime,
        linkedin: linkedinTime,
      },
      hashtags,
      industry,
    };

    return NextResponse.json(postingPackage);
  } catch (err) {
    console.error("[POST /api/posting-package]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
