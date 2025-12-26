import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-brand-cream border-t border-brand-brown/10">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">

                    {/* Column 1: Brand & Bio */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="mb-4 inline-block">
                            <span className="font-heading text-2xl font-black text-brand-brown">
                                DuBuBu<span className="text-brand-pink">.</span>
                            </span>
                        </Link>
                        <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-600">
                            Your daily dose of adorable. Celebrating the love story of Bubu & Dudu with the cutest merchandise for you and your special someone.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white text-gray-600 hover:bg-brand-pink hover:text-white">
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white text-gray-600 hover:bg-brand-pink hover:text-white">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white text-gray-600 hover:bg-brand-pink hover:text-white">
                                <Twitter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Column 2: Shop */}
                    <div>
                        <h3 className="mb-4 font-bold text-brand-brown">Shop</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/shop/plushies" className="hover:text-brand-pink">Plushies</Link></li>
                            <li><Link href="/shop/apparel" className="hover:text-brand-pink">Apparel</Link></li>
                            <li><Link href="/shop/accessories" className="hover:text-brand-pink">Accessories</Link></li>
                            <li><Link href="/shop/gift-sets" className="hover:text-brand-pink">Gift Sets</Link></li>
                            <li><Link href="/shop" className="hover:text-brand-pink">View All</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Help */}
                    <div>
                        <h3 className="mb-4 font-bold text-brand-brown">Help</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/shipping" className="hover:text-brand-pink">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-brand-pink">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-pink">Contact Us</Link></li>
                            <li><Link href="/track-order" className="hover:text-brand-pink">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="mb-4 font-bold text-brand-brown">Stay in the Loop</h3>
                        <p className="mb-4 text-xs text-gray-600">
                            Join the DuBuBu family for 10% off your first order! 💌
                        </p>
                        <form className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white"
                            />
                            <Button type="submit" className="w-full bg-brand-pink hover:bg-brand-blush">
                                Subscribe
                            </Button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col items-center justify-between border-t border-brand-brown/10 pt-8 text-xs text-gray-500 md:flex-row">
                    <p>© {new Date().getFullYear()} DuBuBu.com. All rights reserved.</p>
                    <div className="mt-4 flex gap-6 md:mt-0">
                        <Link href="/privacy" className="hover:text-brand-brown">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-brand-brown">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
