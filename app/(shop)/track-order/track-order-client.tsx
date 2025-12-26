'use client'

import { useState } from 'react';
import { trackOrder, type OrderSummary } from '@/features/orders/actions/track-order';

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<OrderSummary | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setResult(null);

    const res = await trackOrder({ orderNumber, email });

    if (res.success) {
      setResult(res.order);
    } else {
      setError(res.error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2 text-brand-brown">Track Your Order</h1>
      <p className="text-gray-600 mb-8">Enter your order number and email to see the latest status.</p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-brand-brown/10 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Order Number</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g., DBB-12345"
            className="w-full rounded-lg border px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-lg border px-4 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-pink py-3 font-semibold text-white transition hover:bg-brand-blush disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Checking...' : 'Track Order'}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}

      {result && (
        <div className="mt-8 rounded-2xl border border-brand-brown/10 bg-brand-cream/60 p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-brand-pink">Order</p>
              <h2 className="text-2xl font-bold text-brand-brown">{result.orderNumber}</h2>
              <p className="text-sm text-gray-600">Placed on {new Date(result.placedAt).toLocaleDateString()}</p>
            </div>
            <span className="inline-flex h-8 items-center rounded-full bg-white px-4 text-sm font-semibold text-brand-brown">
              Status: {result.status}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {result.items.map((item) => (
              <div key={`${result.orderNumber}-${item.name}`} className="flex justify-between rounded-lg bg-white px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-brand-brown">{item.name}</p>
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold text-brand-pink">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {result.trackingUrl && (
            <a
              href={result.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-brown px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-pink"
            >
              View Tracking Updates
            </a>
          )}

          {result.estimatedDelivery && (
            <p className="mt-3 text-sm text-gray-700">{result.estimatedDelivery}</p>
          )}
        </div>
      )}
    </div>
  );
}
