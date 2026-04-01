import type { Metadata } from "next";
import DemoClient from "./DemoClient";

export const metadata: Metadata = {
  title: "Try the Demo — See Your AI Twin in 30 Seconds",
  description:
    "Upload one photo and watch AI create a video of you in 30 seconds. No signup required. See what Official AI can do for your content.",
  alternates: { canonical: "/demo" },
};

export default function Page() {
  return <DemoClient />;
}
