import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Twitter, Lock, Truck, RefreshCw, ShieldCheck } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-brand-cream border-t border-brand-brown/10">
            {/* Trust Badges Section */}
            <div className="border-b border-brand-brown/10">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-brand-soft-pink flex items-center justify-center">
                                <Truck className="w-6 h-6 text-brand-pink" />
                            </div>
                            <div>
                                <p className="font-semibold text-brand-brown text-sm">Free Shipping</p>
                                <p className="text-xs text-gray-500">On orders over $50</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-brand-soft-pink flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-brand-pink" />
                            </div>
                            <div>
                                <p className="font-semibold text-brand-brown text-sm">Easy Returns</p>
                                <p className="text-xs text-gray-500">30-day return policy</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-brand-soft-pink flex items-center justify-center">
                                <Lock className="w-6 h-6 text-brand-pink" />
                            </div>
                            <div>
                                <p className="font-semibold text-brand-brown text-sm">Secure Checkout</p>
                                <p className="text-xs text-gray-500">Powered by Stripe</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-brand-soft-pink flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-brand-pink" />
                            </div>
                            <div>
                                <p className="font-semibold text-brand-brown text-sm">Quality Guaranteed</p>
                                <p className="text-xs text-gray-500">Premium materials</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white text-gray-600 hover:bg-brand-pink hover:text-white"
                                aria-label="Follow us on Instagram"
                            >
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white text-gray-600 hover:bg-brand-pink hover:text-white"
                                aria-label="Follow us on Facebook"
                            >
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white text-gray-600 hover:bg-brand-pink hover:text-white"
                                aria-label="Follow us on Twitter"
                            >
                                <Twitter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Column 2: Shop */}
                    <div>
                        <h3 className="mb-4 font-bold text-brand-brown">Shop</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/collections/plushies" className="hover:text-brand-pink transition-colors">Plushies</Link></li>
                            <li><Link href="/collections/apparel" className="hover:text-brand-pink transition-colors">Apparel</Link></li>
                            <li><Link href="/collections/accessories" className="hover:text-brand-pink transition-colors">Accessories</Link></li>
                            <li><Link href="/collections/gift-sets" className="hover:text-brand-pink transition-colors">Gift Sets</Link></li>
                            <li><Link href="/collections/matching-sets" className="hover:text-brand-pink transition-colors">Matching Sets</Link></li>
                            <li><Link href="/shop" className="hover:text-brand-pink transition-colors">View All</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Help */}
                    <div>
                        <h3 className="mb-4 font-bold text-brand-brown">Help</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/shipping" className="hover:text-brand-pink transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-brand-pink transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-pink transition-colors">Contact Us</Link></li>
                            <li><Link href="/track-order" className="hover:text-brand-pink transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="mb-4 font-bold text-brand-brown">Stay in the Loop</h3>
                        <p className="mb-4 text-xs text-gray-600">
                            Join the DuBuBu family for 10% off your first order!
                        </p>
                        <form className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white"
                                aria-label="Email for newsletter"
                            />
                            <Button type="submit" className="w-full bg-brand-pink hover:bg-brand-blush">
                                Subscribe
                            </Button>
                        </form>
                    </div>

                </div>

                {/* Payment Methods */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-brand-brown/10 pt-8">
                    <span className="text-xs text-gray-500 mr-2">We accept:</span>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700">Visa</div>
                        <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700">Mastercard</div>
                        <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700">Amex</div>
                        <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700">Apple Pay</div>
                        <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-700">Google Pay</div>
                    </div>
                </div>

                {/* Fan-Made Disclaimer */}
                <div className="mt-8 border-t border-brand-brown/10 pt-8">
                    <div className="bg-brand-soft-pink/50 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-600">
                            <strong className="text-brand-brown">Fan-Made Merchandise:</strong> DuBuBu is an independent fan-made merchandise store.
                            We are not affiliated with, endorsed by, or officially connected to the original Bubu & Dudu creators.
                            All products are created by fans, for fans.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 flex flex-col items-center justify-between border-t border-brand-brown/10 pt-8 text-xs text-gray-500 md:flex-row">
                    <p>&copy; {new Date().getFullYear()} DuBuBu.com. All rights reserved.</p>
                    <div className="mt-4 flex gap-6 md:mt-0">
                        <Link href="/privacy" className="hover:text-brand-brown transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-brand-brown transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
