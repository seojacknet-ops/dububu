import { Metadata } from "next";
import { Suspense } from "react";
import { getFilteredProducts, ProductFilters as ProductFiltersType } from "@/features/products/queries";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductFilters, SortDropdown } from "@/features/products/components/product-filters";
import { MobileFilterDrawer } from "@/features/products/components/mobile-filter-drawer";

export const metadata: Metadata = {
    title: "Shop All Products",
    description: "Browse our complete collection of Bubu & Dudu merchandise. Plushies, apparel, accessories, and matching sets for couples.",
    openGraph: {
        title: "Shop All Products | DuBuBu",
        description: "Browse our complete collection of cute Bubu & Dudu merchandise for couples.",
    },
};

interface ShopPageProps {
    searchParams: Promise<{
        category?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
        q?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;

    const filters: ProductFiltersType = {
        category: params.category,
        minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
        sort: params.sort as ProductFiltersType['sort'],
        search: params.q,
    };

    const products = await getFilteredProducts(filters);
    const searchQuery = params.q;

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-8">
                {searchQuery ? (
                    <div className="text-center">
                        <h1 className="mb-2 font-heading text-3xl font-bold text-brand-brown">
                            Search Results
                        </h1>
                        <p className="text-gray-600">
                            {products.length} result{products.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className="mb-2 font-heading text-4xl font-bold text-brand-brown">
                            Shop All Products
                        </h1>
                        <p className="text-gray-600">Browse our complete collection of cuteness.</p>
                    </div>
                )}
            </div>

            {/* Mobile Filter Bar */}
            <div className="flex items-center justify-between gap-4 mb-6 lg:hidden">
                <Suspense fallback={<div className="h-10 w-24 bg-gray-100 rounded animate-pulse" />}>
                    <MobileFilterDrawer />
                </Suspense>
                <Suspense fallback={<div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />}>
                    <SortDropdown />
                </Suspense>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Sidebar Filters - Desktop */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24">
                        <Suspense fallback={<div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>}>
                            <ProductFilters showCategoryFilter={true} />
                        </Suspense>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    {/* Desktop Sort */}
                    <div className="hidden lg:flex items-center justify-between mb-6">
                        <p className="text-sm text-gray-600">
                            Showing {products.length} product{products.length !== 1 ? 's' : ''}
                        </p>
                        <Suspense fallback={<div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />}>
                            <SortDropdown />
                        </Suspense>
                    </div>

                    <ProductGrid
                        products={products}
                        emptyMessage={
                            searchQuery
                                ? `No products found for "${searchQuery}". Try a different search term.`
                                : "No products found. Try adjusting your filters."
                        }
                    />
                </div>
            </div>
        </div>
    );
}
