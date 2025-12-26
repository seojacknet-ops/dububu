import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock data getter
// In a real app, this would fetch from an API or DB
async function getProduct(slug: string) {
    const products = [
        {
            id: "1",
            name: "Classic Bubu & Dudu Plush Set",
            slug: "classic-plush-set",
            price: 34.99,
            description: "The original Bubu & Dudu plushie set that started it all! These high-quality, ultra-soft plushies are perfect for cuddling. Bubu (the bear) and Dudu (the panda) are inseparable, just like you and your partner. Makes the perfect gift for anniversaries, Valentine's Day, or just because.",
            image: "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
            images: [
                "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
                "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp",
                "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp"
            ],
            category: "plushies",
        },
        {
            id: "2",
            name: "Matching Couple Hoodies",
            slug: "matching-hoodies",
            price: 59.99,
            description: "Stay warm and cozy together with these adorable matching hoodies. Featuring Bubu on one and Dudu on the other, they complete each other when you stand next to your partner. Made from premium cotton blend for maximum comfort.",
            image: "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
            images: [
                "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
                "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp"
            ],
            category: "apparel",
        }
    ];

    return products.find(p => p.slug === slug);
}

// Since we are using static export or similar simple setups, we need to handle async params correctly in Next.js 15+
// But for standard Next.js 14 App Router, basic async component works.

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        // In a real app we'd trigger notFound()
        // but for the demo we might just show a "Product not found"
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="mb-4 text-3xl font-bold">Product Not Found</h1>
                <Link href="/shop"><Button>Back to Shop</Button></Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/shop" className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-brand-brown">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
            </Link>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <ProductGallery images={product.images} productName={product.name} />
                <ProductInfo product={product} />
            </div>
        </div>
    );
}
