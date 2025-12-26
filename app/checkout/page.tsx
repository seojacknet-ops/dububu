'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
    const items = useCartStore((state) => state.items);
    const subtotal = useCartStore((state) => state.subtotal);
    const clearCart = useCartStore((state) => state.clearCart);
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
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

    const onSubmit = async (data: CheckoutInput) => {
        if (items.length === 0) {
            toast.error('Your cart is empty!');
            return;
        }

        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Checkout data:', data);
        toast.success('Order placed successfully! 🐻🐼', {
            description: 'You will receive a confirmation email shortly.',
        });
        
        clearCart();
        setIsSubmitting(false);
    };

    const cartSubtotal = mounted ? subtotal() : 0;
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
                            <span>Shipping</span>
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
                                        placeholder="Email" 
                                        {...register('email')}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>
                            </section>

                            {/* Shipping Section */}
                            <section>
                                <h2 className="mb-4 text-lg font-medium text-gray-900">Shipping Address</h2>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Input 
                                                placeholder="First name" 
                                                {...register('shipping.firstName')}
                                                className={errors.shipping?.firstName ? 'border-red-500' : ''}
                                            />
                                            {errors.shipping?.firstName && (
                                                <p className="mt-1 text-sm text-red-500">{errors.shipping.firstName.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Input 
                                                placeholder="Last name" 
                                                {...register('shipping.lastName')}
                                                className={errors.shipping?.lastName ? 'border-red-500' : ''}
                                            />
                                            {errors.shipping?.lastName && (
                                                <p className="mt-1 text-sm text-red-500">{errors.shipping.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Input 
                                            placeholder="Address" 
                                            {...register('shipping.address1')}
                                            className={errors.shipping?.address1 ? 'border-red-500' : ''}
                                        />
                                        {errors.shipping?.address1 && (
                                            <p className="mt-1 text-sm text-red-500">{errors.shipping.address1.message}</p>
                                        )}
                                    </div>
                                    
                                    <Input 
                                        placeholder="Apartment, suite, etc. (optional)" 
                                        {...register('shipping.address2')}
                                    />
                                    
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Input 
                                                placeholder="City" 
                                                {...register('shipping.city')}
                                                className={errors.shipping?.city ? 'border-red-500' : ''}
                                            />
                                            {errors.shipping?.city && (
                                                <p className="mt-1 text-sm text-red-500">{errors.shipping.city.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Input 
                                                placeholder="State" 
                                                {...register('shipping.state')}
                                                className={errors.shipping?.state ? 'border-red-500' : ''}
                                            />
                                            {errors.shipping?.state && (
                                                <p className="mt-1 text-sm text-red-500">{errors.shipping.state.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Input 
                                                placeholder="ZIP code" 
                                                {...register('shipping.zipCode')}
                                                className={errors.shipping?.zipCode ? 'border-red-500' : ''}
                                            />
                                            {errors.shipping?.zipCode && (
                                                <p className="mt-1 text-sm text-red-500">{errors.shipping.zipCode.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Input 
                                        placeholder="Phone (optional)" 
                                        type="tel"
                                        {...register('shipping.phone')}
                                    />
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Continue to Shipping'
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="bg-gray-50 px-4 py-8 lg:py-12 lg:pl-12 border-t lg:border-t-0 lg:border-l border-gray-200">
                    <div className="sticky top-24 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 lg:hidden">Order Summary</h2>
                        
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
                        <div className="pt-4 text-center text-xs text-gray-500">
                            <p>🔒 Secure checkout powered by Stripe</p>
                            <p className="mt-1">🚚 Free shipping on orders over $50</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
