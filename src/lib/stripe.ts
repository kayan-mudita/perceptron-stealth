import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    })
  : (null as unknown as Stripe);

/** Whether Stripe is configured and available */
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && stripe !== null;
}

/**
 * Plan configuration mapping plan names to Stripe Price IDs.
 * Price IDs are loaded from environment variables so they can differ
 * between Stripe test mode and live mode.
 */
export const PLAN_CONFIG: Record<
  string,
  { name: string; priceId: string | undefined; monthlyPrice: number; videoLimit: number }
> = {
  starter: {
    name: "Starter",
    priceId: process.env.STRIPE_PRICE_STARTER,
    monthlyPrice: 79,
    videoLimit: 30,
  },
  authority: {
    name: "Authority",
    priceId: process.env.STRIPE_PRICE_AUTHORITY,
    monthlyPrice: 149,
    videoLimit: 100,
  },
};

/** Video limit for the free tier */
export const FREE_VIDEO_LIMIT = 1;

/**
 * Look up which plan name corresponds to a given Stripe Price ID.
 * Returns "free" if no match is found.
 */
export function planFromPriceId(priceId: string): string {
  for (const [planKey, config] of Object.entries(PLAN_CONFIG)) {
    if (config.priceId === priceId) return planKey;
  }
  return "free";
}

export type PlanName = "free" | "starter" | "authority" | "enterprise";

export interface PlanInfo {
  plan: PlanName;
  label: string;
  videoLimit: number;
  isActive: boolean;
  currentPeriodEnd: Date | null;
}

/**
 * Determine the user's active plan from their database record.
 * A subscription is considered active if:
 * - The user has a stripeSubscriptionId, AND
 * - stripeCurrentPeriodEnd is in the future (or not set, which means
 *   the webhook hasn't fired yet -- we trust the plan field).
 *
 * Enterprise users are flagged manually (plan === "enterprise").
 */
export function getPlan(user: {
  plan: string;
  stripeSubscriptionId?: string | null;
  stripeCurrentPeriodEnd?: Date | null;
}): PlanInfo {
  // Enterprise is a manual override -- no subscription check needed
  if (user.plan === "enterprise") {
    return {
      plan: "enterprise",
      label: "Enterprise",
      videoLimit: Infinity,
      isActive: true,
      currentPeriodEnd: user.stripeCurrentPeriodEnd ?? null,
    };
  }

  const planKey = user.plan as PlanName;
  const config = PLAN_CONFIG[planKey];

  // No subscription or unrecognised plan -> free
  if (!user.stripeSubscriptionId || !config) {
    return {
      plan: "free",
      label: "Free",
      videoLimit: FREE_VIDEO_LIMIT,
      isActive: true,
      currentPeriodEnd: null,
    };
  }

  // If we have a period end date, check it hasn't expired
  if (user.stripeCurrentPeriodEnd) {
    const isExpired = new Date(user.stripeCurrentPeriodEnd) < new Date();
    if (isExpired) {
      return {
        plan: "free",
        label: "Free",
        videoLimit: FREE_VIDEO_LIMIT,
        isActive: true,
        currentPeriodEnd: null,
      };
    }
  }

  return {
    plan: planKey,
    label: config.name,
    videoLimit: config.videoLimit,
    isActive: true,
    currentPeriodEnd: user.stripeCurrentPeriodEnd ?? null,
  };
}

/**
 * Create a Stripe Checkout Session for subscribing to a plan.
 */
export async function createCheckoutSession({
  userId,
  userEmail,
  plan,
  stripeCustomerId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  userEmail: string;
  plan: string;
  stripeCustomerId?: string | null;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }

  const planConfig = PLAN_CONFIG[plan];
  if (!planConfig || !planConfig.priceId) {
    throw new Error(`Invalid plan or missing price ID for plan: ${plan}`);
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      plan,
    },
  };

  // If the user already has a Stripe customer ID, reuse it.
  // Otherwise let Stripe create a new customer and pre-fill their email.
  if (stripeCustomerId) {
    sessionParams.customer = stripeCustomerId;
  } else {
    sessionParams.customer_email = userEmail;
  }

  return stripe.checkout.sessions.create(sessionParams);
}

/**
 * Create a Stripe Customer Portal session so users can manage
 * their subscription, update payment methods, or cancel.
 */
export async function createPortalSession({
  stripeCustomerId,
  returnUrl,
}: {
  stripeCustomerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }

  return stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
}
