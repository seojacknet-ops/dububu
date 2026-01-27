import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe, formatAmountFromStripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email/templates';
import type Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[STRIPE_WEBHOOK_ERROR] Invalid signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[STRIPE_WEBHOOK] Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[STRIPE_WEBHOOK] Payment failed:', paymentIntent.id);
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[STRIPE_WEBHOOK_HANDLER_ERROR]', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { orderNumber, userId, items: itemsJson } = session.metadata || {};

  if (!orderNumber) {
    console.error('[STRIPE_WEBHOOK] Missing orderNumber in metadata');
    return;
  }

  // Check if order already exists in Firestore
  const existingOrder = await db.order.findUnique({
    where: { orderNumber },
  });

  if (existingOrder) {
    console.log('[STRIPE_WEBHOOK] Order already exists:', orderNumber);
    return;
  }

  // Parse items from metadata
  let items: { productId: string; variantId?: string; quantity: number }[] = [];
  try {
    items = JSON.parse(itemsJson || '[]');
  } catch (e) {
    console.error('[STRIPE_WEBHOOK] Failed to parse items:', e);
  }

  // Get shipping address
  const shippingDetails = session.shipping_details;
  const customerDetails = session.customer_details;

  const shippingAddress = shippingDetails?.address
    ? {
        firstName: shippingDetails.name?.split(' ')[0] || '',
        lastName: shippingDetails.name?.split(' ').slice(1).join(' ') || '',
        address1: shippingDetails.address.line1 || '',
        address2: shippingDetails.address.line2 || '',
        city: shippingDetails.address.city || '',
        state: shippingDetails.address.state || '',
        zipCode: shippingDetails.address.postal_code || '',
        country: shippingDetails.address.country || '',
      }
    : {
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      };

  // Calculate totals
  const subtotal = formatAmountFromStripe(session.amount_subtotal || 0);
  const total = formatAmountFromStripe(session.amount_total || 0);
  const shippingCost = total - subtotal;

  // Fetch product details for order items from Firestore
  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      const variant = item.variantId && product?.variants
        ? product.variants.find((v) => v.id === item.variantId)
        : null;

      return {
        productId: item.productId,
        variantId: item.variantId || undefined,
        name: product?.name || 'Unknown Product',
        sku: variant?.sku || product?.sku || undefined,
        price: variant?.price || product?.price || 0,
        quantity: item.quantity,
      };
    })
  );

  // Create order in Firestore
  const order = await db.order.create({
    data: {
      orderNumber,
      userId: userId || undefined,
      email: customerDetails?.email || session.customer_email || '',
      phone: customerDetails?.phone || undefined,
      shippingAddress,
      billingAddress: session.customer_details?.address ? {
        line1: session.customer_details.address.line1 || undefined,
        line2: session.customer_details.address.line2 || undefined,
        city: session.customer_details.address.city || undefined,
        state: session.customer_details.address.state || undefined,
        postal_code: session.customer_details.address.postal_code || undefined,
        country: session.customer_details.address.country || undefined,
      } : undefined,
      items: {
        create: orderItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
        }))
      },
      subtotal,
      shippingCost: shippingCost > 0 ? shippingCost : 0,
      tax: 0,
      discount: 0,
      total,
      currency: 'USD',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'UNFULFILLED',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
    },
  });

  console.log('[STRIPE_WEBHOOK] Order created:', order.orderNumber);

  // Send order confirmation email
  try {
    const emailResult = await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      email: order.email,
      customerName: shippingAddress.firstName || undefined,
      items: orderItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        sku: item.sku,
        variantId: item.variantId,
      })),
      subtotal,
      shippingCost: shippingCost > 0 ? shippingCost : 0,
      tax: 0,
      discount: 0,
      total,
      shippingAddress,
    });

    if (emailResult.success) {
      console.log('[STRIPE_WEBHOOK] Order confirmation email sent:', emailResult.messageId);
    } else {
      console.error('[STRIPE_WEBHOOK] Failed to send order confirmation email:', emailResult.error);
    }
  } catch (emailError) {
    // Log but don't fail the webhook - order was created successfully
    console.error('[STRIPE_WEBHOOK] Error sending order confirmation email:', emailError);
  }

  // TODO: Trigger fulfillment automation (Printful/CJDropshipping)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Find order by payment intent ID in Firestore
  const order = await db.order.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (order) {
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'FAILED',
        status: 'CANCELLED',
      },
    });
  }
}
