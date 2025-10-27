import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import Stripe from "stripe";
import { prisma } from "@power/db";

export const runtime = "nodejs";

const relevantEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted"
]);

export async function POST(req: NextRequest) {
  const body = await req.arrayBuffer();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(body), signature, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  const subscription = event.data.object as Stripe.Subscription;
  const orgId = subscription.metadata?.orgId;

  if (!orgId) {
    return NextResponse.json({ error: "Missing org metadata" }, { status: 400 });
  }

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      orgId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status: subscription.status?.toUpperCase() as any,
      currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null
    },
    update: {
      status: subscription.status?.toUpperCase() as any,
      currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null
    }
  });

  await prisma.org.update({
    where: { id: orgId },
    data: { stripeCustomerId: subscription.customer as string }
  });

  return NextResponse.json({ received: true });
}
