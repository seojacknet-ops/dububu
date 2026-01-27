import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { printful } from "@/lib/vendors/printful";

interface OrderItem {
  productId: string;
  variantId: string;
  variantSku: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  costPrice: number;
  image: string;
  fulfillmentType: "aliexpress" | "printful" | "manual";
  fulfillmentStatus?: string;
  fulfillmentOrderId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing order ID" },
        { status: 400 }
      );
    }

    const convex = getConvexClient();
    const order = await convex.query(api.orders.get, {
      orderId: orderId as Id<"orders">,
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Group items by fulfillment type
    const printfulItems = (order.items as OrderItem[]).filter(
      (item: OrderItem) => item.fulfillmentType === "printful"
    );
    const aliexpressItems = (order.items as OrderItem[]).filter(
      (item: OrderItem) => item.fulfillmentType === "aliexpress"
    );
    const manualItems = (order.items as OrderItem[]).filter(
      (item: OrderItem) => item.fulfillmentType === "manual"
    );

    const results = {
      printful: { success: false, orderId: null as string | null, error: null as string | null },
      aliexpress: { success: false, notified: false },
      manual: { count: manualItems.length },
    };

    // Process Printful items
    if (printfulItems.length > 0) {
      try {
        const printfulOrder = {
          recipient: {
            name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            address1: order.shippingAddress.address1,
            address2: order.shippingAddress.address2,
            city: order.shippingAddress.city,
            state_code: order.shippingAddress.state,
            country_code: order.shippingAddress.country,
            zip: order.shippingAddress.postalCode,
            phone: order.shippingAddress.phone,
            email: order.email,
          },
          items: printfulItems.map((item: OrderItem) => ({
            sync_variant_id: parseInt(item.variantSku.replace("PF-", "")),
            quantity: item.quantity,
            retail_price: item.price.toFixed(2),
          })),
          gift: order.isGift && order.giftMessage
            ? { message: order.giftMessage }
            : undefined,
          packing_slip: {
            email: order.email,
            message: "Thank you for your order from DuBuBu! 🐻🐼",
          },
        };

        // Create order in Printful (auto-confirm for production)
        const result = await printful.createOrder(printfulOrder, true);

        results.printful.success = true;
        results.printful.orderId = result.result.id.toString();

        // Update fulfillment status for Printful items
        for (let i = 0; i < order.items.length; i++) {
          if (order.items[i].fulfillmentType === "printful") {
            await convex.mutation(api.orders.updateFulfillmentStatus, {
              orderId: order._id,
              itemIndex: i,
              fulfillmentStatus: "submitted",
              fulfillmentOrderId: result.result.id.toString(),
            });
          }
        }

        console.log(`[FULFILLMENT] Printful order created: ${result.result.id}`);
      } catch (error) {
        console.error("[FULFILLMENT_PRINTFUL_ERROR]", error);
        results.printful.error = error instanceof Error ? error.message : "Unknown error";

        // Mark Printful items as failed
        for (let i = 0; i < order.items.length; i++) {
          if (order.items[i].fulfillmentType === "printful") {
            await convex.mutation(api.orders.updateFulfillmentStatus, {
              orderId: order._id,
              itemIndex: i,
              fulfillmentStatus: "failed",
            });
          }
        }
      }
    }

    // Process AliExpress items (manual notification for now)
    if (aliexpressItems.length > 0) {
      try {
        // Send admin notification email
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.dububu.com";
        const emailResponse = await fetch(`${baseUrl}/api/email/admin-notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `New AliExpress Order: ${order.orderNumber}`,
            orderNumber: order.orderNumber,
            items: aliexpressItems.map((item: OrderItem) => ({
              name: item.productName,
              variant: item.variantName,
              quantity: item.quantity,
              sku: item.variantSku,
            })),
            shippingAddress: order.shippingAddress,
            email: order.email,
          }),
        });

        if (!emailResponse.ok) {
          throw new Error(
            `Failed to send admin notification: ${emailResponse.status} ${emailResponse.statusText}`
          );
        }

        results.aliexpress.success = true;
        results.aliexpress.notified = true;

        // Mark AliExpress items as submitted (awaiting manual processing)
        for (let i = 0; i < order.items.length; i++) {
          if (order.items[i].fulfillmentType === "aliexpress") {
            await convex.mutation(api.orders.updateFulfillmentStatus, {
              orderId: order._id,
              itemIndex: i,
              fulfillmentStatus: "submitted",
            });
          }
        }

        console.log(`[FULFILLMENT] AliExpress notification sent for order ${order.orderNumber}`);
      } catch (error) {
        console.error("[FULFILLMENT_ALIEXPRESS_ERROR]", error);
      }
    }

    // Handle manual items (just log)
    if (manualItems.length > 0) {
      console.log(`[FULFILLMENT] ${manualItems.length} manual items in order ${order.orderNumber}`);

      // Mark manual items as submitted
      for (let i = 0; i < order.items.length; i++) {
        if (order.items[i].fulfillmentType === "manual") {
          await convex.mutation(api.orders.updateFulfillmentStatus, {
            orderId: order._id,
            itemIndex: i,
            fulfillmentStatus: "submitted",
          });
        }
      }
    }

    // Update order status to processing
    await convex.mutation(api.orders.updateStatus, {
      orderId: order._id,
      status: "processing",
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("[FULFILLMENT_PROCESS_ERROR]", error);
    return NextResponse.json(
      { error: "Fulfillment processing failed" },
      { status: 500 }
    );
  }
}
