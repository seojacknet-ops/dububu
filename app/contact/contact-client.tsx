'use client';

import { useState, useTransition } from 'react';
import { submitContactForm } from '@/features/contact/actions/submit-form';

export default function ContactClient() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (formData: FormData) => {
    setError('');
    startTransition(async () => {
      const result = await submitContactForm(formData);
      if (result.success) {
        setSubmitted(true);
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">💕</div>
        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
        <p className="text-gray-600">
          Bubu & Dudu received your message. We'll respond within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <h1 className="text-3xl font-bold mb-8 text-brand-brown">Contact Us</h1>
      <form action={handleSubmit} className="space-y-4 rounded-2xl border border-brand-brown/10 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            name="name"
            type="text"
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            name="subject"
            className="w-full border rounded-lg px-4 py-2"
            defaultValue="general"
          >
            <option value="general">General Inquiry</option>
            <option value="order">Order Question</option>
            <option value="return">Returns & Refunds</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand-pink text-white py-3 rounded-lg font-semibold hover:bg-brand-blush transition disabled:opacity-50"
        >
          {isPending ? 'Sending...' : 'Send Message'}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      <div className="mt-12 text-center text-gray-600">
        <p>Or email us directly:</p>
        <a href="mailto:hello@dububu.com" className="text-brand-pink font-semibold">
          hello@dububu.com
        </a>
        <p className="mt-4">Follow us: @dububu.co</p>
      </div>
    </div>
  );
}
