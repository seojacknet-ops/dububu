import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const convex = getConvexClient();
    const event = await req.json();
    const { type, data } = event;

    console.log(`[PRINTFUL_WEBHOOK] Received event: ${type}`);

    // Log event for tracking
    await convex.mutation(api.printfulEvents.create, {
      eventType: type,
      printfulOrderId: data.order?.id?.toString() || "",
      data: event,
    });

    switch (type) {
      case "package_shipped": {
        const { order, shipment } = data;

        // Find order by external_id (our order number)
        const dbOrder = await convex.query(api.orders.getByOrderNumber, {
          orderNumber: order.external_id,
        });

        if (dbOrder) {
          // Update each Printful item's tracking
          for (let i = 0; i < dbOrder.items.length; i++) {
            if (dbOrder.items[i].fulfillmentType === "printful") {
              await convex.mutation(api.orders.updateFulfillmentStatus, {
                orderId: dbOrder._id,
                itemIndex: i,
                fulfillmentStatus: "shipped",
                trackingNumber: shipment.tracking_number,
                trackingUrl: shipment.tracking_url,
              });
            }
          }

          // TODO: Send shipping notification email
          console.log(`[PRINTFUL_WEBHOOK] Updated shipping for order ${order.external_id}`);
        }
        break;
      }

      case "order_created": {
        console.log(`[PRINTFUL_WEBHOOK] Order created: ${data.order?.id}`);
        break;
      }

      case "order_updated": {
        const { order } = data;

        const dbOrder = await convex.query(api.orders.getByOrderNumber, {
          orderNumber: order.external_id,
        });

        if (dbOrder && order.status === "fulfilled") {
          // Mark Printful items as delivered
          for (let i = 0; i < dbOrder.items.length; i++) {
            if (dbOrder.items[i].fulfillmentType === "printful") {
              await convex.mutation(api.orders.updateFulfillmentStatus, {
                orderId: dbOrder._id,
                itemIndex: i,
                fulfillmentStatus: "delivered",
              });
            }
          }
        }
        break;
      }

      case "order_canceled":
      case "order_failed": {
        const { order, reason } = data;

        const dbOrder = await convex.query(api.orders.getByOrderNumber, {
          orderNumber: order.external_id,
        });

        if (dbOrder) {
          // Mark Printful items as failed
          for (let i = 0; i < dbOrder.items.length; i++) {
            if (dbOrder.items[i].fulfillmentType === "printful") {
              await convex.mutation(api.orders.updateFulfillmentStatus, {
                orderId: dbOrder._id,
                itemIndex: i,
                fulfillmentStatus: "failed",
              });
            }
          }

          // Add internal note
          await convex.mutation(api.orders.addInternalNote, {
            orderId: dbOrder._id,
            note: `Printful ${type}: ${reason || "No reason provided"}`,
          });

          console.log(`[PRINTFUL_WEBHOOK] Order ${type}: ${order.external_id} - ${reason}`);
        }
        break;
      }

      case "product_synced":
      case "product_updated":
      case "product_deleted": {
        console.log(`[PRINTFUL_WEBHOOK] Product event: ${type}`);
        // Handle product sync events if needed
        break;
      }

      default:
        console.log(`[PRINTFUL_WEBHOOK] Unhandled event type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PRINTFUL_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
