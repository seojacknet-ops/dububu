"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalCheckoutProps {
  amount: number;
  orderId: string;
  onSuccess: (details: { paypalOrderId: string }) => void;
  onError: (error: string) => void;
}

export function PayPalCheckout({
  amount,
  orderId,
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
          height: 50,
        }}
        createOrder={async () => {
          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount,
              orderId,
            }),
          });

          const data = await response.json();

          if (data.error) {
            onError(data.error);
            throw new Error(data.error);
          }

          return data.id;
        }}
        onApprove={async (data) => {
          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paypalOrderId: data.orderID,
              orderId,
            }),
          });

          const result = await response.json();

          if (result.success) {
            onSuccess({ paypalOrderId: data.orderID });
          } else {
            onError(result.error || "Payment failed");
          }
        }}
        onError={(err) => {
          console.error("[PAYPAL_ERROR]", err);
          onError("PayPal checkout failed. Please try again.");
        }}
        onCancel={() => {
          onError("Payment cancelled");
        }}
      />
    </PayPalScriptProvider>
  );
}
