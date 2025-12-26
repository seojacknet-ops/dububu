'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

// Detect animated images by file extension
const isAnimatedImage = (url: string): boolean => {
    return /\.(gif|webp)$/i.test(url);
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                    src={images[selectedImage]}
                    alt={productName}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={isAnimatedImage(images[selectedImage])}
                />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((image, i) => (
                    <button
                        key={i}
                        className={cn(
                            "relative aspect-square h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2",
                            selectedImage === i ? "border-brand-brown" : "border-transparent"
                        )}
                        onClick={() => setSelectedImage(i)}
                    >
                        <Image
                            src={image}
                            alt={`${productName} view ${i + 1}`}
                            fill
                            className="object-cover"
                            unoptimized={isAnimatedImage(image)}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
