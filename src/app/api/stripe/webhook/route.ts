import { NextRequest, NextResponse } from "next/server";
import { stripe, planFromPriceId } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

/**
 * Stripe sends webhook payloads as raw body, so we must NOT parse
 * the body as JSON ourselves -- we read it as text for signature
 * verification.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        // Unhandled event type -- acknowledge receipt
        break;
    }
  } catch (err: any) {
    console.error(`Error handling webhook event ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * When a checkout session completes, persist the Stripe customer ID,
 * subscription ID, and the chosen plan on the User record.
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("checkout.session.completed: No userId in metadata");
    return;
  }

  const plan = session.metadata?.plan || "free";
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
  });

  console.log(`User ${userId} upgraded to ${plan}`);
}

/**
 * When a subscription is updated (e.g. plan change, renewal),
 * sync the plan in our database to match Stripe.
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Determine the new plan from the subscription's price
  const priceId = subscription.items.data[0]?.price?.id;
  const plan = priceId ? planFromPriceId(priceId) : "free";

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });

  if (!user) {
    console.error(`subscription.updated: No user found for customer ${customerId}`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan,
      stripeSubscriptionId: subscription.id,
    },
  });

  console.log(`User ${user.id} subscription updated to ${plan}`);
}

/**
 * When a subscription is deleted (cancelled), downgrade the user to free.
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });

  if (!user) {
    console.error(`subscription.deleted: No user found for customer ${customerId}`);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "free",
      stripeSubscriptionId: null,
    },
  });

  console.log(`User ${user.id} subscription cancelled, downgraded to free`);
}
