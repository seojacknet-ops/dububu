import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { getConvexClient } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const { paypalOrderId, orderId } = await req.json();

    if (!paypalOrderId) {
      return NextResponse.json(
        { error: "Missing PayPal order ID" },
        { status: 400 }
      );
    }

    const captureResult = await capturePayPalOrder(paypalOrderId);

    if (captureResult.status === "COMPLETED") {
      // Update order payment status
      const convex = getConvexClient();
      if (orderId) {
        await convex.mutation(api.orders.updatePaymentStatus, {
          orderId: orderId as Id<"orders">,
          paymentStatus: "paid",
          paypalOrderId: paypalOrderId,
        });

        // Trigger fulfillment
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.dububu.com";
        try {
          const fulfillmentResponse = await fetch(`${baseUrl}/api/fulfillment/process`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          });

          if (!fulfillmentResponse.ok) {
            console.error(
              `[PAYPAL_CAPTURE] Fulfillment process failed: ${fulfillmentResponse.status} ${fulfillmentResponse.statusText}`
            );
          }
        } catch (fulfillmentError) {
          console.error("[PAYPAL_CAPTURE] Fulfillment process error:", fulfillmentError);
        }
      }

      return NextResponse.json({
        success: true,
        captureId: captureResult.id,
        status: captureResult.status,
      });
    }

    return NextResponse.json(
      { error: "Payment not completed", status: captureResult.status },
      { status: 400 }
    );
  } catch (error) {
    console.error("[PAYPAL_CAPTURE_ORDER]", error);
    return NextResponse.json(
      { error: "Failed to capture PayPal order" },
      { status: 500 }
    );
  }
}
