import { NextRequest, NextResponse } from "next/server";
import { resend, EMAIL_FROM } from "@/lib/resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@dububu.com";

export async function POST(req: NextRequest) {
  try {
    const { subject, orderNumber, items, shippingAddress, email } = await req.json();

    const itemsList = items
      .map(
        (item: { name: string; variant: string; quantity: number; sku: string }) =>
          `- ${item.name} (${item.variant}) x${item.quantity} [SKU: ${item.sku}]`
      )
      .join("\n");

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: subject || `New Order Requires Attention: ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #f59e0b;">Action Required: AliExpress Order</h1>

          <div style="background: #fffbeb; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 16px 0;">
            <p style="margin: 0; font-weight: 600;">Order #${orderNumber}</p>
            <p style="margin: 4px 0 0 0; color: #6b7280;">Requires manual fulfillment via AliExpress</p>
          </div>

          <h2 style="color: #1f2937;">Items to Order</h2>
          <pre style="background: #f3f4f6; padding: 16px; border-radius: 8px; overflow-x: auto;">${itemsList}</pre>

          <h2 style="color: #1f2937;">Shipping Address</h2>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
            <p style="margin: 0;">
              ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
              ${shippingAddress.address1}<br>
              ${shippingAddress.address2 ? `${shippingAddress.address2}<br>` : ''}
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
              ${shippingAddress.country}<br>
              Phone: ${shippingAddress.phone}
            </p>
          </div>

          <h2 style="color: #1f2937;">Customer Email</h2>
          <p><a href="mailto:${email}">${email}</a></p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

          <h2 style="color: #1f2937;">Next Steps</h2>
          <ol style="color: #6b7280;">
            <li>Log into AliExpress/CJ Dropshipping</li>
            <li>Place the order with the items and shipping address above</li>
            <li>Once shipped, update the order with tracking information in the admin dashboard</li>
          </ol>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
            This is an automated notification from DuBuBu.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("[ADMIN_NOTIFICATION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to send admin notification" },
      { status: 500 }
    );
  }
}
