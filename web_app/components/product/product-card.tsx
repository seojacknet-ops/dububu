'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GIFS } from '@/lib/constants/gifs';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        compareAtPrice?: number;
        image: string;
        category: string;
        inStock?: boolean;
    };
}

// Helper specific to this component for mapping categories
function getCategoryGif(category: string): string {
    // Simple mapping based on known categories
    const key = category.toLowerCase();

    if (key.includes('plush')) return GIFS.hug[0];
    if (key.includes('pajama') || key.includes('sleep')) return GIFS.sleep[0];
    if (key.includes('couple') || key.includes('love')) return GIFS.love[0];

    return GIFS.cute[0];
}

export function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const categoryGif = getCategoryGif(product.category);
    const inStock = product.inStock !== false;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!inStock) return;
        
        setIsAdding(true);
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        });
        
        toast.success('Added to cart! 🛒', {
            description: product.name,
        });
        
        setTimeout(() => setIsAdding(false), 1000);
    };

    return (
        <Link
            href={`/shop/products/${product.slug}`}
            className="group block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-soft-pink">
                <Image
                    src={isHovered ? categoryGif : product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={isHovered} // Unoptimized for GIFs
                />
                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className={`absolute bottom-4 right-4 translate-y-12 rounded-full p-3 shadow-lg transition-all duration-300 group-hover:translate-y-0 ${
                        isAdding 
                            ? 'bg-green-500 text-white' 
                            : inStock 
                                ? 'bg-white hover:bg-brand-pink hover:text-white' 
                                : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    {isAdding ? (
                        <Check className="h-5 w-5" />
                    ) : (
                        <ShoppingCart className="h-5 w-5" />
                    )}
                    <span className="sr-only">{inStock ? 'Add to cart' : 'Out of stock'}</span>
                </button>
                {!inStock && (
                    <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        Sold Out
                    </div>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <div className="absolute top-4 right-4 bg-brand-pink text-white text-xs px-2 py-1 rounded">
                        Sale
                    </div>
                )}
            </div>
            <div className="mt-4">
                <h3 className="font-heading text-lg font-medium text-brand-brown group-hover:text-brand-pink">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-brand-blush">{formatPrice(product.price)}</p>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <p className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
