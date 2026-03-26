"use client";

import IndustryPage from "@/components/marketing/IndustryPage";

export default function AdvisorsClient() {
  return (
    <IndustryPage
      industry="Financial Advisors"
      headline="Grow your AUM."
      headlineAccent="Without growing your workload."
      subtext="Market commentary, financial tips, and thought leadership posted daily. Build trust with prospects before the first meeting."
      painPoints={[
        {
          title: "Clients expect daily insights",
          description:
            "Your prospects follow advisors who post daily market commentary on LinkedIn and Instagram. If you are not visible, you are not considered.",
        },
        {
          title: "Compliance makes content slow",
          description:
            "Every piece of content needs careful review. You cannot afford off-the-cuff comments about markets or investment advice that has not been vetted.",
        },
        {
          title: "Content creation is a second job",
          description:
            "Between portfolio reviews, client meetings, and market research, creating video content feels like running an entirely separate business.",
        },
      ]}
      solutions={[
        {
          title: "Daily market commentary on autopilot",
          description:
            "AI generates commentary videos based on market trends and your area of expertise. Review over morning coffee, approve, and auto-post by market open.",
        },
        {
          title: "Full review and approval workflow",
          description:
            "Every script lands in your approval queue. Edit anything. Reject anything. Nothing goes live without your sign-off. Built for compliance-conscious firms.",
        },
        {
          title: "Build authority for $79/month",
          description:
            "Post more than advisors spending $5K/month on agencies. 10 to 30 professional videos featuring your face, voice, and expertise. Five-minute setup.",
        },
      ]}
      ctaBadge="Built for RIAs, wealth managers, and financial planners"
      ctaHeading="More visibility. More trust. More AUM."
      ctaDescription="Upload your headshot and get your first market commentary video in under 5 minutes."
    />
  );
}
