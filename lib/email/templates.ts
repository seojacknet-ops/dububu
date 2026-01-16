import { sendEmail, emailAddresses, type SendEmailResult } from './smtp';

// ============================================
// Types
// ============================================

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  variantId?: string;
}

export interface OrderDetails {
  orderNumber: string;
  email: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ShippingDetails {
  orderNumber: string;
  email: string;
  customerName: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

// ============================================
// Order Confirmation Email
// ============================================

export async function sendOrderConfirmationEmail(order: OrderDetails): Promise<SendEmailResult> {
  const itemsList = order.items
    .map((item) => `  • ${item.name} x${item.quantity} - $${item.price.toFixed(2)}`)
    .join('\n');

  const addressLine = [
    `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    order.shippingAddress.address1,
    order.shippingAddress.address2,
    `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
    order.shippingAddress.country,
  ]
    .filter(Boolean)
    .join('\n  ');

  const text = `Hi ${order.customerName || order.shippingAddress.firstName || 'there'}! 🐻🐼

Thank you for your order! We're so excited to get your goodies to you!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORDER CONFIRMATION
Order #${order.orderNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ITEMS:
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY:
  Subtotal: $${order.subtotal.toFixed(2)}
  Shipping: ${order.shippingCost > 0 ? `$${order.shippingCost.toFixed(2)}` : 'FREE'}${order.discount > 0 ? `\n  Discount: -$${order.discount.toFixed(2)}` : ''}${order.tax > 0 ? `\n  Tax: $${order.tax.toFixed(2)}` : ''}
  ─────────
  Total: $${order.total.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SHIPPING TO:
  ${addressLine}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We'll send you another email with tracking info once your order ships!

Questions? Reply to this email or visit dububu.co/contact

Love,
Bubu & Dudu 🐻🐼

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
dububu.co | Cute couple gifts for every occasion`;

  return sendEmail({
    to: order.email,
    from: emailAddresses.orders,
    subject: `Order Confirmed! 🎉 #${order.orderNumber}`,
    text,
    replyTo: emailAddresses.support,
  });
}

// ============================================
// Contact Form Emails
// ============================================

export async function sendContactFormAdminNotification(data: ContactFormData): Promise<SendEmailResult> {
  const text = `New contact form submission:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FROM: ${data.name}
EMAIL: ${data.email}
SUBJECT: ${data.subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MESSAGE:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply directly to this email to respond to the customer.`;

  return sendEmail({
    to: emailAddresses.admin,
    from: emailAddresses.support,
    subject: `[Contact Form] ${data.subject} - ${data.name}`,
    text,
    replyTo: data.email,
  });
}

export async function sendContactFormAutoReply(data: ContactFormData): Promise<SendEmailResult> {
  const text = `Hi ${data.name}! 👋

Thank you for reaching out to us! We've received your message and will get back to you within 24-48 hours.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR MESSAGE:
Subject: ${data.subject}

${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the meantime, feel free to:
• Check out our FAQ: dububu.co/faq
• Browse our shop: dububu.co/shop
• Follow us on Instagram: @dububu.co

Love,
Bubu & Dudu 🐻🐼

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
dububu.co | Cute couple gifts for every occasion`;

  return sendEmail({
    to: data.email,
    from: emailAddresses.support,
    subject: 'We received your message! 💕',
    text,
  });
}

// ============================================
// Shipping Notification Email
// ============================================

export async function sendShippingNotificationEmail(details: ShippingDetails): Promise<SendEmailResult> {
  const trackingInfo = details.trackingUrl
    ? `Track your package: ${details.trackingUrl}`
    : `Tracking Number: ${details.trackingNumber}\nCarrier: ${details.carrier}`;

  const text = `Great news, ${details.customerName}! 🎉

Your order #${details.orderNumber} has shipped and is on its way to you!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SHIPPING DETAILS:
${trackingInfo}
${details.estimatedDelivery ? `\nEstimated Delivery: ${details.estimatedDelivery}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any questions about your delivery, feel free to reply to this email or contact us at dububu.co/contact

Love,
Bubu & Dudu 🐻🐼

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
dububu.co | Cute couple gifts for every occasion`;

  return sendEmail({
    to: details.email,
    from: emailAddresses.orders,
    subject: `Your order has shipped! 📦 #${details.orderNumber}`,
    text,
    replyTo: emailAddresses.support,
  });
}

// ============================================
// Helper to send both contact form emails
// ============================================

export async function sendContactFormEmails(data: ContactFormData): Promise<{ adminEmail: SendEmailResult; autoReply: SendEmailResult }> {
  const [adminEmail, autoReply] = await Promise.all([
    sendContactFormAdminNotification(data),
    sendContactFormAutoReply(data),
  ]);

  return { adminEmail, autoReply };
}
