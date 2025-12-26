'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Heart, Share2, Check } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        price: number;
        compareAtPrice?: number;
        description: string;
        image: string;
        inStock?: boolean;
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const inStock = product.inStock !== false;

    const handleAddToCart = () => {
        if (!inStock) return;
        
        setIsAdding(true);
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
        });
        
        toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart! 🛒`, {
            description: product.name,
        });
        
        setTimeout(() => setIsAdding(false), 1500);
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            });
        } catch {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-brand-brown md:text-4xl">{product.name}</h1>
                <div className="mt-2 flex items-center gap-3">
                    <p className="text-2xl font-semibold text-brand-pink">{formatPrice(product.price)}</p>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <>
                            <p className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
                            <span className="bg-brand-pink text-white text-xs px-2 py-1 rounded">
                                Save {Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                            </span>
                        </>
                    )}
                </div>
                {!inStock && (
                    <p className="mt-2 text-red-500 font-medium">Out of Stock</p>
                )}
            </div>

            <p className="text-gray-600 leading-relaxed">
                {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center rounded-full border border-gray-200">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-gray-500 hover:text-brand-brown"
                        disabled={!inStock}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-gray-500 hover:text-brand-brown"
                        disabled={!inStock}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <Button 
                    size="lg" 
                    className={`flex-1 rounded-full text-base gap-2 ${isAdding ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!inStock || isAdding}
                >
                    {isAdding ? (
                        <>
                            <Check className="h-5 w-5" />
                            Added!
                        </>
                    ) : inStock ? (
                        `Add to Cart - ${formatPrice(product.price * quantity)}`
                    ) : (
                        'Out of Stock'
                    )}
                </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Button variant="outline" className="flex-1 gap-2 border-gray-200 text-gray-600 hover:text-brand-pink">
                    <Heart className="h-4 w-4" /> Add to Wishlist
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-brand-brown"
                    onClick={handleShare}
                >
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>

            {/* Trust */}
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl bg-brand-cream/30 p-4 text-center text-sm">
                <div>
                    <p className="font-bold text-brand-brown">Free Shipping</p>
                    <p className="text-gray-500">On all orders over $50</p>
                </div>
                <div>
                    <p className="font-bold text-brand-brown">Secure Checkout</p>
                    <p className="text-gray-500">100% Protected</p>
                </div>
            </div>
        </div>
    );
}
