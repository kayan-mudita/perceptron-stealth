import { NextRequest, NextResponse } from "next/server";
import { requireAuth, errorResponse } from "@/lib/api-helpers";
import { createPortalSession } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    // Fetch full user record to get stripeCustomerId
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    if (!dbUser?.stripeCustomerId) {
      return errorResponse(
        "No Stripe customer found. Please subscribe to a plan first.",
        400
      );
    }

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const session = await createPortalSession({
      stripeCustomerId: dbUser.stripeCustomerId,
      returnUrl: `${origin}/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe portal error:", err);
    return errorResponse(err.message || "Failed to create portal session", 500);
  }
}
