import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

// Mock data for best sellers
const bestSellers = [
    {
        id: "1",
        name: "Classic Bubu & Dudu Plush Set",
        slug: "classic-plush-set",
        price: 34.99,
        image: "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
        category: "plushies",
    },
    {
        id: "2",
        name: "Matching Couple Hoodies",
        slug: "matching-hoodies",
        price: 59.99,
        image: "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
        category: "apparel",
    },
    {
        id: "3",
        name: "Love Story Mug Set",
        slug: "love-story-mugs",
        price: 24.99,
        image: "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp",
        category: "home",
    },
    {
        id: "4",
        name: "Cute Panda Keychain",
        slug: "panda-keychain",
        price: 12.99,
        image: "https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp",
        category: "accessories",
    },
];

export function BestSellers() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div>
                        <h2 className="mb-2 font-heading text-3xl font-bold text-brand-brown">Best Sellers</h2>
                        <p className="text-gray-600">Everyone's favorites! ⭐</p>
                    </div>
                    <Link href="/shop">
                        <Button variant="outline">View All Products</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {bestSellers.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
