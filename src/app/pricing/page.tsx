import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Starter at $79/mo, Authority at $149/mo, or custom Enterprise plans. Start free, no credit card required.",
};

export default function PricingPage() {
  return <PricingClient />;
}
