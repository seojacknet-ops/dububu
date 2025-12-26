"use client";

import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { X, ShoppingBag } from "lucide-react";
import { CartItemRow } from "./cart-item";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer() {
    const isOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);
    const items = useCartStore((state) => state.items);
    const subtotal = useCartStore((state) => state.subtotal);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Rehydrate cart store from localStorage on mount
        useCartStore.persist.rehydrate();
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-50 bg-black"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl"
                    >
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                            <Button variant="ghost" size="icon" onClick={closeCart}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                                    <ShoppingBag className="h-16 w-16 text-gray-300" />
                                    <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                                    <p className="text-sm text-gray-500">
                                        Looks like you haven't added any cute items yet.
                                    </p>
                                    <Button onClick={closeCart} className="mt-4">
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                <div className="flow-root">
                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <li key={item.id}>
                                                <CartItemRow item={item} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>${subtotal().toFixed(2)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <div className="mt-6">
                                    <Link href="/checkout">
                                        <Button className="w-full" size="lg" onClick={closeCart}>
                                            Checkout
                                        </Button>
                                    </Link>
                                </div>
                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                    <p>
                                        or{" "}
                                        <button
                                            type="button"
                                            className="font-medium text-brand-pink hover:text-brand-blush"
                                            onClick={closeCart}
                                        >
                                            Continue Shopping
                                            <span aria-hidden="true"> &rarr;</span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
