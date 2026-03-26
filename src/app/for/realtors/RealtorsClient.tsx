"use client";

import IndustryPage from "@/components/marketing/IndustryPage";

export default function RealtorsClient() {
  return (
    <IndustryPage
      industry="Realtors"
      headline="Sell more homes."
      headlineAccent="Post more content."
      subtext="Listing tours, market updates, and client testimonials posted daily to all your platforms. No filming, no editing, no crew."
      painPoints={[
        {
          title: "No time between showings",
          description:
            "Between open houses, client calls, and closings you have zero bandwidth to sit down and film content. The camera stays in your bag.",
        },
        {
          title: "Competitors are outposting you",
          description:
            "The agents dominating your market post 5-7 times a week. You are posting once a month when you remember. Every silent day is a lost lead.",
        },
        {
          title: "Agencies are too expensive",
          description:
            "A decent video production team charges $3,000-5,000/month for 4 videos. That is a serious cut into your commission checks for minimal output.",
        },
      ]}
      solutions={[
        {
          title: "Daily content on autopilot",
          description:
            "Listing spotlights, market updates, neighborhood guides, and home-buying tips generated from your face and voice. Posted automatically to Instagram, TikTok, LinkedIn, YouTube, and Facebook.",
        },
        {
          title: "Your brand, your face, your voice",
          description:
            "Every video features you. Not a generic avatar. AI builds a character model from your photos and clones your voice so every piece of content is unmistakably you.",
        },
        {
          title: "30 videos for $79/month",
          description:
            "Replace your $5,000/month agency with 30 professionally produced videos for the price of one closing dinner. Setup takes 5 minutes.",
        },
      ]}
      ctaBadge="Built for real estate professionals"
      ctaHeading="List more. Close more. Post more."
      ctaDescription="Upload your headshots and get your first listing video in under 5 minutes."
    />
  );
}
