import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Bubu & Dudu",
    description: "Learn the heartwarming story of Bubu the bear and Dudu the panda - the cutest couple on the internet. Created by artist Huang Xiao B.",
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold font-heading text-brand-brown mb-8">About Bubu & Dudu</h1>
            <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-600 mb-6">
                    The story of the cutest bear and panda couple that captured hearts around the world.
                </p>
                <h2 className="text-2xl font-bold text-brand-brown mt-8 mb-4">Meet the Characters</h2>
                <p className="text-gray-600 mb-4">
                    <strong>Bubu</strong> (布布) - The Bear 🐻 is playful, mischievous, and energetic. This brown teddy bear represents warmth, familiarity, and comfort.
                </p>
                <p className="text-gray-600 mb-4">
                    <strong>Dudu</strong> (一二 / Yier) - The Panda 🐼 is calm, gentle, patient, and wise. This white panda with classic black markings represents peace and gentle love.
                </p>
                <h2 className="text-2xl font-bold text-brand-brown mt-8 mb-4">The Origin Story</h2>
                <p className="text-gray-600 mb-4">
                    Created by Chinese artist <strong>Huang Xiao B (黄小B)</strong> in June 2018, Bubu and Dudu started as WeChat and Weibo sticker packs. Their heartwarming love stories and daily adventures quickly went viral across Instagram, TikTok, and YouTube.
                </p>
                <p className="text-gray-600">
                    Today, they represent couple goals, friendship, and everyday cute moments that millions of people around the world relate to.
                </p>
            </div>
        </div>
    );
}
