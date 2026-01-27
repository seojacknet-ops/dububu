"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckoutFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

function StripeCheckoutForm({ onSuccess, onError }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      onError(error.message || "Payment failed");
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 text-lg font-semibold rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
}

interface StripeCheckoutProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function StripeCheckout({
  clientSecret,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  if (!clientSecret) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading payment form...
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#ec4899",
            colorBackground: "#ffffff",
            colorText: "#1f2937",
            colorDanger: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            borderRadius: "12px",
          },
        },
      }}
    >
      <StripeCheckoutForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
