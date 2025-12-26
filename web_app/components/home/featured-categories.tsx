import Link from 'next/link';
import Image from 'next/image';

const categories = [
    {
        name: 'Plushies',
        href: '/shop/plushies',
        image: 'https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif',
        color: 'bg-brand-soft-pink'
    },
    {
        name: 'Apparel',
        href: '/shop/apparel',
        image: 'https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp',
        color: 'bg-brand-cream'
    },
    {
        name: 'Accessories',
        href: '/shop/accessories',
        image: 'https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp',
        color: 'bg-brand-mint/20'
    },
    {
        name: 'Matching Sets',
        href: '/shop/matching-sets',
        image: 'https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif',
        color: 'bg-brand-yellow/20'
    }
];

export function FeaturedCategories() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 font-heading text-3xl font-bold text-brand-brown md:text-4xl">Shop by Category</h2>
                    <p className="text-gray-600">Find exactly what you're looking for 🐻🐼</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
                        >
                            <div className={`aspect-[4/5] w-full ${category.color} relative`}>
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover p-8 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                                    unoptimized
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                                <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 text-center backdrop-blur-sm">
                                    <h3 className="font-heading text-xl font-bold text-brand-brown">{category.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
