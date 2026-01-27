import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "USD", orderId, items } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const order = await createPayPalOrder({
      amount,
      currency,
      orderId,
      items,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[PAYPAL_CREATE_ORDER]", error);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
