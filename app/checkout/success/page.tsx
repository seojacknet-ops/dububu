'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { GIFS } from '@/lib/constants/gifs';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart();

    // You could fetch order details here using the session_id
    // For now, we'll show a generic success message
    if (sessionId) {
      setOrderDetails({
        orderNumber: 'Processing...',
        email: 'Check your email for confirmation',
      });
    }
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen bg-brand-soft-pink">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <Image
                src={GIFS.celebrate}
                alt="Bubu and Dudu celebrating"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-brand-brown mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Bubu & Dudu are doing a happy dance! Your order has been placed successfully.
          </p>

          {/* Order Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Package className="w-6 h-6 text-brand-pink" />
              <span className="text-lg font-semibold text-brand-brown">Order Confirmed</span>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Order Status</span>
                <span className="font-medium text-green-600">Confirmed</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Email Confirmation</span>
                <span className="font-medium text-brand-brown">Sent to your inbox</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-medium text-brand-brown">7-14 business days</span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-brand-brown mb-6">What happens next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-brand-brown">Order Confirmation Email</h3>
                  <p className="text-sm text-gray-600">Check your inbox for order details</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-brand-brown">Order Processing</h3>
                  <p className="text-sm text-gray-600">We&apos;ll prepare your cute goodies (1-3 days)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-brand-brown">Shipping Notification</h3>
                  <p className="text-sm text-gray-600">You&apos;ll receive a tracking link when shipped</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-brand-brown">Happy Unboxing!</h3>
                  <p className="text-sm text-gray-600">Share your joy with us @dububu.co</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/track-order">
              <Button variant="outline" size="lg">
                Track Your Order
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" className="gap-2">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Support */}
          <p className="mt-8 text-sm text-gray-600">
            Questions about your order?{' '}
            <Link href="/contact" className="text-brand-pink hover:underline">
              Contact us
            </Link>{' '}
            and we&apos;ll help you out!
          </p>
        </div>
      </div>
    </div>
  );
}
