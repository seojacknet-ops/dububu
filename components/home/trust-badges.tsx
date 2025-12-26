import { Truck, RotateCcw, ShieldCheck, Heart } from 'lucide-react';

const badges = [
    {
        icon: Truck,
        title: 'Free Worldwide Shipping',
        description: 'On all orders over $50'
    },
    {
        icon: RotateCcw,
        title: '30-Day Returns',
        description: 'Hassle-free exchanges'
    },
    {
        icon: ShieldCheck,
        title: 'Secure Checkout',
        description: '100% protected payments'
    },
    {
        icon: Heart,
        title: 'Made with Love',
        description: 'Quality guaranteed'
    }
];

export function TrustBadges() {
    return (
        <section className="border-y border-brand-brown/10 bg-brand-cream/30 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {badges.map((badge) => (
                        <div key={badge.title} className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-pink shadow-sm">
                                <badge.icon className="h-8 w-8" />
                            </div>
                            <h3 className="mb-1 font-heading font-bold text-brand-brown">{badge.title}</h3>
                            <p className="text-sm text-gray-500">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
