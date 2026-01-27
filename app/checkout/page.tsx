'use client';

// Force dynamic rendering to avoid build-time auth issues
export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2, Lock, CreditCard, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState, useTransition, Suspense } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const items = useCartStore((state) => state.items);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const [mounted, setMounted] = useState(false);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<CheckoutInput>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            email: '',
            sameAsBilling: true,
            shipping: {
                firstName: '',
                lastName: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'United States',
                phone: '',
            },
        },
    });

    useEffect(() => {
        useCartStore.persist.rehydrate();
        setMounted(true);
    }, []);

    useEffect(() => {
        // Show canceled message
        if (searchParams.get('canceled') === 'true') {
            toast.error('Checkout was canceled. Your cart is still saved.');
        }
    }, [searchParams]);

    const onSubmit = async (data: CheckoutInput) => {
        if (items.length === 0) {
            toast.error('Your cart is empty!');
            return;
        }

        startTransition(async () => {
            try {
                // Create payment intent via our API
                const response = await fetch('/api/stripe/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: getSubtotal() + (getSubtotal() >= 50 ? 0 : 5.99),
                        metadata: {
                            email: data.email,
                            items: JSON.stringify(items.map(item => ({
                                productId: item.productId,
                                name: item.name,
                                quantity: item.quantity,
                            }))),
                        },
                    }),
                });

                const result = await response.json();

                if (result.clientSecret) {
                    // Redirect to our payment page with the client secret
                    router.push(`/checkout/payment?secret=${result.clientSecret}&email=${encodeURIComponent(data.email)}`);
                } else {
                    toast.error(result.error || 'Failed to create payment session');
                }
            } catch {
                toast.error('Failed to create checkout session');
            }
        });
    };

    const cartSubtotal = mounted ? getSubtotal() : 0;
    const shipping = cartSubtotal >= 50 ? 0 : 5.99;
    const total = cartSubtotal + shipping;

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-pink" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2">

                {/* Left Column: Form */}
                <div className="px-4 py-8 lg:py-12 lg:pr-12">
                    <div className="mb-8">
                        <Link href="/" className="font-heading text-2xl font-black text-brand-brown">
                            DuBuBu<span className="text-brand-pink">.</span>
                        </Link>

                        <nav className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            <Link href="/shop" className="hover:text-brand-brown">Cart</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="font-medium text-gray-900">Information</span>
                            <ChevronRight className="h-3 w-3" />
                            <span>Payment</span>
                        </nav>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-lg font-medium text-gray-900 mb-4">Your cart is empty</p>
                            <Link href="/shop">
                                <Button>Continue Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Contact Section */}
                            <section>
                                <h2 className="mb-4 text-lg font-medium text-gray-900">Contact</h2>
                                <div>
                                    <Input
                                        type="email"
                                        placeholder="Email for order updates"
                                        {...register('email')}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        You&apos;ll enter your shipping address on the next page (Stripe checkout)
                                    </p>
                                </div>
                            </section>

                            {/* Stripe Checkout Info */}
                            <section className="bg-brand-soft-pink rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-brand-pink mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-brand-brown">Secure Checkout</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            You&apos;ll be redirected to Stripe&apos;s secure checkout page to complete your payment.
                                            Your payment information is never stored on our servers.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Methods Info */}
                            <section>
                                <h2 className="mb-4 text-lg font-medium text-gray-900">Accepted Payment Methods</h2>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                                        <CreditCard className="w-5 h-5 text-gray-600" />
                                        <span className="text-sm">Credit/Debit Cards</span>
                                    </div>
                                    <div className="bg-gray-50 px-3 py-2 rounded">
                                        <span className="text-sm font-medium">Apple Pay</span>
                                    </div>
                                    <div className="bg-gray-50 px-3 py-2 rounded">
                                        <span className="text-sm font-medium">Google Pay</span>
                                    </div>
                                </div>
                            </section>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                                <Link href="/shop" className="text-sm text-brand-brown hover:underline order-2 sm:order-1">
                                    ← Return to shop
                                </Link>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full sm:w-auto px-8 order-1 sm:order-2"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Redirecting to payment...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Proceed to Payment
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="bg-gray-50 px-4 py-8 lg:py-12 lg:pl-12 border-t lg:border-t-0 lg:border-l border-gray-200">
                    <div className="sticky top-24 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200 bg-white">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                        {item.variantName && (
                                            <p className="text-sm text-gray-500">{item.variantName}</p>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-200 pt-6 space-y-2">
                            <div className="flex justify-between text-sm">
                                <p className="text-gray-500">Subtotal</p>
                                <p className="font-medium text-gray-900">{formatPrice(cartSubtotal)}</p>
                            </div>
                            <div className="flex justify-between text-sm">
                                <p className="text-gray-500">Shipping</p>
                                <p className="font-medium text-gray-900">
                                    {shipping === 0 ? (
                                        <span className="text-green-600">Free</span>
                                    ) : (
                                        formatPrice(shipping)
                                    )}
                                </p>
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-gray-500">
                                    Add {formatPrice(50 - cartSubtotal)} more for free shipping!
                                </p>
                            )}
                        </div>

                        <div className="flex justify-between border-t border-gray-200 pt-6">
                            <p className="text-lg font-medium text-gray-900">Total</p>
                            <p className="text-xl font-medium text-gray-900">{formatPrice(total)}</p>
                        </div>

                        {/* Trust badges */}
                        <div className="pt-4 space-y-2 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <span>Secure checkout powered by Stripe</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Your payment info is never stored</span>
                            </div>
                            <p className="mt-2">🚚 Free shipping on orders over $50</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-pink" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
