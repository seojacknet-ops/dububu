'use server'

import { z } from 'zod';
import { OrderStatus } from '@/lib/types';

interface OrderSummaryItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderSummary {
  orderNumber: string;
  email: string;
  status: OrderStatus;
  items: OrderSummaryItem[];
  trackingUrl?: string;
  estimatedDelivery?: string;
  placedAt: string;
}

const orders: OrderSummary[] = [
  {
    orderNumber: 'DBB-12345',
    email: 'hello@dububu.com',
    status: 'shipped',
    trackingUrl: 'https://tracking.example.com/DBB-12345',
    estimatedDelivery: 'Arriving in 3-5 business days',
    placedAt: '2024-12-15',
    items: [
      { name: 'Classic Bubu & Dudu Plush Set', quantity: 1, price: 34.99 },
      { name: 'Bear Keychain', quantity: 1, price: 12.99 },
    ],
  },
  {
    orderNumber: 'DBB-88888',
    email: 'customer@example.com',
    status: 'processing',
    placedAt: '2024-12-18',
    items: [
      { name: 'Matching Date Night Bundle', quantity: 1, price: 89.99 },
    ],
  },
];

const schema = z.object({
  orderNumber: z.string().trim().min(3),
  email: z.string().email(),
});

export async function trackOrder(input: { orderNumber: string; email: string }) {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return { success: false as const, error: 'Please enter a valid order number and email.' };
  }

  const { orderNumber, email } = parsed.data;
  const match = orders.find(
    (order) =>
      order.orderNumber.toLowerCase() === orderNumber.toLowerCase() &&
      order.email.toLowerCase() === email.toLowerCase()
  );

  if (!match) {
    return { success: false as const, error: 'No order found for that number and email.' };
  }

  return { success: true as const, order: match };
}
