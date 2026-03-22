import type { Metadata } from "next";
import FeaturesClient from "./FeaturesClient";

export const metadata: Metadata = {
  title: "Features",
  description:
    "AI Digital Twin, multi-cut video composition, voice cloning, auto-posting, content calendar, analytics, and more. Everything you need to automate your social presence.",
};

export default function FeaturesPage() {
  return <FeaturesClient />;
}
