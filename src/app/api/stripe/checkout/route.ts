import { NextRequest, NextResponse } from "next/server";
import { requireAuth, errorResponse } from "@/lib/api-helpers";
import { createCheckoutSession, PLAN_CONFIG, isStripeConfigured } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return errorResponse("Payments are not configured yet. Please try again later.", 503);
  }

  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const { plan } = body;

    if (!plan || !PLAN_CONFIG[plan]) {
      return errorResponse("Invalid plan. Must be one of: starter, authority", 400);
    }

    if (!PLAN_CONFIG[plan].priceId) {
      return errorResponse(`Stripe price ID not configured for plan: ${plan}`, 500);
    }

    // Fetch full user record to get stripeCustomerId
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { email: true, stripeCustomerId: true },
    });

    if (!dbUser) {
      return errorResponse("User not found", 404);
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const session = await createCheckoutSession({
      userId: user.id,
      userEmail: dbUser.email,
      plan,
      stripeCustomerId: dbUser.stripeCustomerId,
      successUrl: `${origin}/dashboard/settings?tab=plan&checkout=success`,
      cancelUrl: `${origin}/dashboard/settings?tab=plan&checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Stripe checkout error:", err);
    return errorResponse(message, 500);
  }
}
