"use client";

import IndustryPage from "@/components/marketing/IndustryPage";

export default function DoctorsClient() {
  return (
    <IndustryPage
      industry="Doctors"
      headline="Educate patients."
      headlineAccent="Without the production overhead."
      subtext="Health tips, procedure explainers, and wellness content posted to all your platforms. You verify the medical accuracy. AI handles the rest."
      painPoints={[
        {
          title: "Zero time outside of patient care",
          description:
            "Between consultations, procedures, and charting, there is no window to film educational videos. Patient care always comes first.",
        },
        {
          title: "Medical accuracy is non-negotiable",
          description:
            "Health content must be accurate and responsible. You need full control over every script to ensure nothing misleading reaches your audience.",
        },
        {
          title: "Patients research you online first",
          description:
            "Before booking, patients watch your content to see if they trust you. No content means no trust signal. Competitors with active profiles win the appointment.",
        },
      ]}
      solutions={[
        {
          title: "Health education on autopilot",
          description:
            "Common condition explainers, prevention tips, procedure walkthroughs, and seasonal health content generated from your face and voice and posted daily.",
        },
        {
          title: "Full medical review workflow",
          description:
            "Every script enters your review queue for medical accuracy verification. Edit, approve, or reject. Nothing publishes without your explicit sign-off.",
        },
        {
          title: "Build patient trust for $79/month",
          description:
            "Patients who watch your educational content before their appointment arrive informed and trusting. 10 to 30 videos per month, no filming required.",
        },
      ]}
      ctaBadge="Built for physicians, dentists, and specialists"
      ctaHeading="More patients. Better educated. No filming."
      ctaDescription="Upload your headshot and get your first health education video in under 5 minutes."
    />
  );
}
