const PAYPAL_API =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

export interface PayPalOrderItem {
  name: string;
  quantity: number;
  unit_amount: {
    currency_code: string;
    value: string;
  };
}

export interface PayPalCreateOrderOptions {
  amount: number;
  currency?: string;
  orderId?: string;
  items?: PayPalOrderItem[];
}

export async function createPayPalOrder(options: PayPalCreateOrderOptions) {
  const accessToken = await getAccessToken();
  const { amount, currency = "USD", orderId, items } = options;

  const orderPayload: Record<string, unknown> = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: orderId,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
          ...(items && {
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount.toFixed(2),
              },
            },
          }),
        },
        ...(items && { items }),
      },
    ],
    application_context: {
      brand_name: "DuBuBu",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    },
  };

  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[PAYPAL_CREATE_ORDER]", error);
    throw new Error("Failed to create PayPal order");
  }

  return response.json();
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("[PAYPAL_CAPTURE_ORDER]", error);
    throw new Error("Failed to capture PayPal order");
  }

  return response.json();
}

export async function getPayPalOrder(paypalOrderId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("[PAYPAL_GET_ORDER]", error);
    throw new Error("Failed to get PayPal order");
  }

  return response.json();
}
