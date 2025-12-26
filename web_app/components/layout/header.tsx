'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navigation = [
    { name: "Shop All", href: "/shop" },
    { name: "Plushies", href: "/shop/plushies" },
    { name: "Apparel", href: "/shop/apparel" },
    { name: "Accessories", href: "/shop/accessories" },
    { name: "Gift Guide", href: "/gift-guide" },
];

const mobileNavigation = [
    { name: "Home", href: "/" },
    ...navigation,
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
];

export function Header() {
    const pathname = usePathname();
    // Use total quantity instead of array length to show correct count
    const cartItemsCount = useCartStore((state) => 
        state.items.reduce((total, item) => total + item.quantity, 0)
    );
    const openCart = useCartStore((state) => state.openCart);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Rehydrate cart store from localStorage on mount
        useCartStore.persist.rehydrate();
        setMounted(true);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-brand-brown/10 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Mobile Menu Trigger */}
                    <div className="flex lg:hidden">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="-ml-2"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open navigation menu"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </div>

                    {/* Logo */}
                    <div className="flex lg:flex-1">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-heading text-2xl font-black tracking-tight text-brand-brown">
                                DuBuBu<span className="text-brand-pink">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex lg:gap-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-semibold transition-colors hover:text-brand-pink",
                                    pathname === item.href
                                        ? "text-brand-pink"
                                        : "text-gray-900"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons / Actions */}
                    <div className="flex flex-1 items-center justify-end gap-x-4">
                        <Button variant="ghost" size="icon" className="text-gray-900 hover:text-brand-pink">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>

                        <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-900 hover:text-brand-pink">
                            <Heart className="h-5 w-5" />
                            <span className="sr-only">Wishlist</span>
                        </Button>

                        <Button
                            onClick={openCart}
                            variant="ghost"
                            size="icon"
                            className="relative text-gray-900 hover:text-brand-pink"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {mounted && cartItemsCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[10px] font-bold text-white">
                                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                                </span>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 z-50 bg-black lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col bg-white shadow-xl lg:hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b px-4 py-4">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                    <span className="font-heading text-xl font-black text-brand-brown">
                                        DuBuBu<span className="text-brand-pink">.</span>
                                    </span>
                                </Link>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label="Close navigation menu"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 overflow-y-auto px-4 py-6">
                                <ul className="space-y-1">
                                    {mobileNavigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={cn(
                                                    "block rounded-lg px-3 py-3 text-base font-medium transition-colors",
                                                    pathname === item.href
                                                        ? "bg-brand-soft-pink text-brand-pink"
                                                        : "text-gray-900 hover:bg-brand-cream"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Footer Actions */}
                            <div className="border-t px-4 py-6">
                                <div className="flex items-center gap-4">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 gap-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Heart className="h-4 w-4" />
                                        Wishlist
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 gap-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Search className="h-4 w-4" />
                                        Search
                                    </Button>
                                </div>
                                <p className="mt-4 text-center text-xs text-gray-500">
                                    🐻🐼 Where Love Meets Cute
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
