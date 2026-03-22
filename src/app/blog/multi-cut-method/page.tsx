import type { Metadata } from "next";
import MultiCutMethodClient from "./MultiCutMethodClient";

export const metadata: Metadata = {
  title: "The Multi-Cut Method: Why One-Shot AI Video Looks Like Garbage",
  description:
    "Every AI video tool generates a single continuous shot. That is why they look fake. Here is how multi-cut composition changes everything about AI video quality.",
};

export default function MultiCutMethodPage() {
  return <MultiCutMethodClient />;
}
