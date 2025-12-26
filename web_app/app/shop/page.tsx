import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop All Products",
    description: "Browse our complete collection of Bubu & Dudu merchandise. Plushies, apparel, accessories, and matching sets for couples.",
    openGraph: {
        title: "Shop All Products | DuBuBu",
        description: "Browse our complete collection of cute Bubu & Dudu merchandise for couples.",
    },
};

// Mock products (expanded)
const products = [
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
    {
        id: "5",
        name: "Panda Pajama Set",
        slug: "panda-pajamas",
        price: 45.99,
        image: "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp",
        category: "apparel",
    },
    {
        id: "6",
        name: "Heart Pillow",
        slug: "heart-pillow",
        price: 29.99,
        image: "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
        category: "home",
    },
];

export default function ShopPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <h1 className="mb-4 font-heading text-4xl font-bold text-brand-brown">Shop All Products</h1>
                <p className="text-gray-600">Browse our complete collection of cuteness.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar Filters */}
                <div className="hidden space-y-8 lg:block">
                    <div>
                        <h3 className="mb-4 font-bold text-brand-brown">Categories</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Button variant="link" className="h-auto p-0 text-brand-pink underline">All Products</Button></li>
                            <li><Button variant="link" className="h-auto p-0">Plushies</Button></li>
                            <li><Button variant="link" className="h-auto p-0">Apparel</Button></li>
                            <li><Button variant="link" className="h-auto p-0">Accessories</Button></li>
                            <li><Button variant="link" className="h-auto p-0">Home & Living</Button></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 font-bold text-brand-brown">Price Range</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Button variant="link" className="h-auto p-0">Under $25</Button></li>
                            <li><Button variant="link" className="h-auto p-0">$25 - $50</Button></li>
                            <li><Button variant="link" className="h-auto p-0">$50 - $100</Button></li>
                            <li><Button variant="link" className="h-auto p-0">Over $100</Button></li>
                        </ul>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
