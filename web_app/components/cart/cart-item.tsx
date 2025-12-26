"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem, useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface CartItemProps {
    item: CartItem;
}

export function CartItemRow({ item }: CartItemProps) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    return (
        <div className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <div className="relative h-full w-full">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="h-full w-full object-cover object-center"
                    />
                </div>
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    {item.variantName && (
                        <p className="mt-1 text-sm text-gray-500">{item.variantName}</p>
                    )}
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <div className="flex">
                        <button
                            type="button"
                            className="font-medium text-brand-pink hover:text-brand-blush"
                            onClick={() => removeItem(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
