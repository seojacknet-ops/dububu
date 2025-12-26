import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { getAllProducts } from "@/features/products/queries";
import { ProductGrid } from "@/features/products/components/product-grid";

export const metadata: Metadata = {
    title: "Shop All Products",
    description: "Browse our complete collection of Bubu & Dudu merchandise. Plushies, apparel, accessories, and matching sets for couples.",
    openGraph: {
        title: "Shop All Products | DuBuBu",
        description: "Browse our complete collection of cute Bubu & Dudu merchandise for couples.",
    },
};

export default async function ShopPage() {
    const products = await getAllProducts();

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
                    <ProductGrid products={products} />
                </div>
            </div>
        </div>
    );
}
