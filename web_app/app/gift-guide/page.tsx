import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Gift Guide",
    description: "Find the perfect Bubu & Dudu gift for your special someone. Curated gift ideas for Valentine's Day, anniversaries, and birthdays.",
};

const giftCategories = [
    { name: "For Your Partner", emoji: "💕", href: "/shop?tag=couple" },
    { name: "Anniversary Gifts", emoji: "💍", href: "/shop?tag=gift" },
    { name: "Valentine's Day", emoji: "❤️", href: "/shop?tag=love" },
    { name: "Birthday Gifts", emoji: "🎂", href: "/shop?tag=gift" },
    { name: "Under $25", emoji: "💰", href: "/shop?price=under25" },
    { name: "Matching Sets", emoji: "👫", href: "/shop?tag=matching" },
];

export default function GiftGuidePage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold font-heading text-brand-brown mb-4">Gift Guide</h1>
            <p className="text-lg text-gray-600 mb-12">Find the perfect gift for your special someone 🎁</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {giftCategories.map((category) => (
                    <Link 
                        key={category.name}
                        href={category.href}
                        className="bg-white rounded-2xl p-8 text-center shadow-sm border border-brand-brown/10 hover:shadow-md hover:-translate-y-1 transition-all"
                    >
                        <span className="text-4xl mb-4 block">{category.emoji}</span>
                        <h3 className="font-bold text-brand-brown">{category.name}</h3>
                    </Link>
                ))}
            </div>
            
            <div className="mt-16 bg-brand-soft-pink rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-brand-brown mb-4">Not sure what to get?</h2>
                <p className="text-gray-600 mb-6">Our best sellers are always a hit!</p>
                <Link 
                    href="/shop?tag=bestseller"
                    className="inline-block bg-brand-pink text-white px-8 py-3 rounded-full font-bold hover:bg-brand-blush transition-colors"
                >
                    Shop Best Sellers
                </Link>
            </div>
        </div>
    );
}
