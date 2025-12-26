import Image from 'next/image';
import Link from 'next/link';

const HERO_GIF = "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif";

export function HeroSection() {
    return (
        <section className="relative flex min-h-[600px] items-center overflow-hidden bg-brand-cream">
            {/* Background GIF Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={HERO_GIF}
                    alt="Bubu and Dudu cuddling"
                    fill
                    className="object-cover opacity-10"
                    unoptimized
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-transparent to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="mx-auto max-w-3xl">
                    <h1 className="mb-6 font-heading text-5xl font-black text-brand-brown md:text-7xl">
                        Where Every Day is a <span className="text-brand-pink">Love Story</span> 💕
                    </h1>
                    <p className="mb-10 text-xl text-gray-600 md:text-2xl">
                        Discover the cutest Bubu & Dudu merchandise for you and your special someone.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/shop"
                            className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-full bg-brand-pink px-8 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-blush hover:shadow-xl"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            href="/gift-guide"
                            className="inline-flex h-14 min-w-[200px] items-center justify-center rounded-full border-2 border-brand-brown bg-transparent px-8 text-lg font-bold text-brand-brown transition-all hover:bg-brand-brown hover:text-white"
                        >
                            Gift Guide
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
