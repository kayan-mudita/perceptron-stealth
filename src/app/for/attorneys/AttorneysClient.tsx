"use client";

import IndustryPage from "@/components/marketing/IndustryPage";

export default function AttorneysClient() {
  return (
    <IndustryPage
      industry="Attorneys"
      headline="Win more clients."
      headlineAccent="Without going on camera."
      subtext="Know-your-rights tips, case results, and legal education videos posted to all your platforms. AI writes the scripts. You approve them."
      painPoints={[
        {
          title: "No time to create content",
          description:
            "Between court dates, client meetings, and depositions, the last thing you have time for is setting up a ring light and reading a script.",
        },
        {
          title: "Risk of saying the wrong thing",
          description:
            "Every word matters in legal content. You cannot wing it on camera. Scripts need to be educational, not advisory, and you need final approval on everything.",
        },
        {
          title: "Competitors are getting the calls",
          description:
            "The attorneys posting daily on TikTok and Instagram are getting the consultation calls you should be getting. Visibility equals credibility.",
        },
      ]}
      solutions={[
        {
          title: "AI scripts, your approval",
          description:
            "Every script is generated from proven legal content frameworks. Educational, not advisory. You review and approve every word before the video is generated.",
        },
        {
          title: "Your expertise on every platform",
          description:
            "Know-your-rights tips, case result highlights, legal myth-busting, and FAQ answers auto-posted to Instagram, TikTok, LinkedIn, YouTube, and Facebook.",
        },
        {
          title: "30 videos for the price of one paralegal hour",
          description:
            "At $79/month you get 10 professionally produced videos. Upgrade to $149 for 30. No camera crew, no agency fees, no billable hour waste.",
        },
      ]}
      ctaBadge="Built for law firms and solo practitioners"
      ctaHeading="More clients. Less filming."
      ctaDescription="Upload your headshot and get your first legal education video in under 5 minutes."
    />
  );
}
