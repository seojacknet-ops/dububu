import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Couples Corner Blog",
    description: "Relationship tips, cute stories, gift ideas, and more from the DuBuBu team.",
};

export default function BlogPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold font-heading text-brand-brown mb-4">Couples Corner</h1>
            <p className="text-lg text-gray-600 mb-12">Relationship tips, cute stories, and more 💕</p>
            
            <div className="bg-brand-soft-pink rounded-2xl p-12 text-center">
                <span className="text-6xl mb-4 block">🐻🐼</span>
                <h2 className="text-2xl font-bold text-brand-brown mb-4">Coming Soon!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    We're working on bringing you the cutest content about love, relationships, and all things Bubu & Dudu. Stay tuned!
                </p>
            </div>
        </div>
    );
}
