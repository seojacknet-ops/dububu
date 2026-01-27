import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getConvexClient } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[STRIPE_WEBHOOK_SIGNATURE]", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    const convex = getConvexClient();
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          // Update order payment status
          await convex.mutation(api.orders.updatePaymentStatus, {
            orderId: orderId as Id<"orders">,
            paymentStatus: "paid",
            paymentIntentId: paymentIntent.id,
          });

          // Trigger fulfillment
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.dububu.com";
          await fetch(`${baseUrl}/api/fulfillment/process`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          });

          console.log(`[STRIPE_WEBHOOK] Payment succeeded for order ${orderId}`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await convex.mutation(api.orders.updatePaymentStatus, {
            orderId: orderId as Id<"orders">,
            paymentStatus: "failed",
            paymentIntentId: paymentIntent.id,
          });

          console.log(`[STRIPE_WEBHOOK] Payment failed for order ${orderId}`);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        // Find order by payment intent ID and update status
        // This would require adding a query by paymentIntentId to orders
        console.log(`[STRIPE_WEBHOOK] Refund processed for payment ${paymentIntentId}`);
        break;
      }

      default:
        console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK_HANDLER]", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
