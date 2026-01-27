import { NextRequest, NextResponse } from "next/server";
import { resend, EMAIL_FROM, EMAIL_REPLY_TO } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

export async function POST(req: NextRequest) {
  try {
    const { type, to, data } = await req.json();

    if (!to || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "order-confirmation": {
        result = await resend.emails.send({
          from: EMAIL_FROM,
          to,
          replyTo: EMAIL_REPLY_TO,
          subject: `Order Confirmed! #${data.orderNumber}`,
          react: OrderConfirmationEmail(data),
        });
        break;
      }

      case "shipping-update": {
        result = await resend.emails.send({
          from: EMAIL_FROM,
          to,
          replyTo: EMAIL_REPLY_TO,
          subject: `Your DuBuBu order has shipped! #${data.orderNumber}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #ec4899;">Your order is on its way!</h1>
              <p>Hey ${data.customerName},</p>
              <p>Great news! Your DuBuBu order #${data.orderNumber} has shipped!</p>
              ${data.trackingNumber ? `
                <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
                ${data.trackingUrl ? `<p><a href="${data.trackingUrl}" style="color: #ec4899;">Track your package</a></p>` : ''}
              ` : ''}
              <p>Thank you for shopping with us!</p>
              <p style="color: #9ca3af; font-size: 12px;">DuBuBu - Where Love Meets Cute</p>
            </div>
          `,
        });
        break;
      }

      case "welcome-discount": {
        result = await resend.emails.send({
          from: EMAIL_FROM,
          to,
          replyTo: EMAIL_REPLY_TO,
          subject: "Welcome to DuBuBu! Here's 10% off your first order",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
              <h1 style="color: #ec4899;">Welcome to the DuBuBu family!</h1>
              <p>Thanks for subscribing! Here's your exclusive discount:</p>
              <div style="background: #fdf2f8; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="margin: 0; color: #ec4899; font-size: 12px; font-weight: 600;">YOUR DISCOUNT CODE</p>
                <p style="margin: 8px 0 0 0; font-size: 32px; font-weight: bold; color: #1f2937;">${data.discountCode}</p>
              </div>
              <p style="color: #6b7280;">Use this code at checkout for 10% off your first order!</p>
              <a href="https://www.dububu.com/shop" style="display: inline-block; background: #ec4899; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Shop Now</a>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">DuBuBu - Where Love Meets Cute</p>
            </div>
          `,
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error("[EMAIL_SEND_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
