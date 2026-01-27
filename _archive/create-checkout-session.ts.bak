'use server';

import { z } from 'zod';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import { auth } from '@/lib/auth';

const checkoutItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  image: z.string(),
});

const checkoutInputSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  email: z.string().email().optional(),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutInputSchema>;

export async function createCheckoutSession(input: CheckoutInput) {
  try {
    const validated = checkoutInputSchema.parse(input);
    const session = await auth();

    // Generate order number
    const orderNumber = `DBB-${nanoid(8).toUpperCase()}`;

    // Calculate totals
    const subtotal = validated.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shippingCost;

    // Create line items for Stripe
    const lineItems = validated.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: formatAmountForStripe(item.price),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if not free
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            images: [],
          },
          unit_amount: formatAmountForStripe(shippingCost),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: validated.email || session?.user?.email || undefined,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE'],
      },
      billing_address_collection: 'required',
      metadata: {
        orderNumber,
        userId: session?.user?.id || '',
        items: JSON.stringify(
          validated.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          }))
        ),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
      allow_promotion_codes: true,
    });

    return {
      success: true,
      sessionId: stripeSession.id,
      url: stripeSession.url,
    };
  } catch (error) {
    console.error('[CREATE_CHECKOUT_SESSION_ERROR]', error);
    return {
      success: false,
      error: 'Failed to create checkout session. Please try again.',
    };
  }
}
