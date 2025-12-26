import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how DuBuBu collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold font-heading text-brand-brown mb-8">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: December 2025</p>
            
            <div className="prose prose-gray max-w-none">
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-brand-brown mb-4">Information We Collect</h2>
                    <p className="text-gray-600 mb-4">
                        We collect information you provide directly, such as your name, email address, shipping address, and payment information when you make a purchase.
                    </p>
                </section>
                
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-brand-brown mb-4">How We Use Your Information</h2>
                    <p className="text-gray-600 mb-4">
                        We use your information to process orders, communicate with you about your purchases, and improve our services.
                    </p>
                </section>
                
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-brand-brown mb-4">Data Protection</h2>
                    <p className="text-gray-600 mb-4">
                        We implement industry-standard security measures to protect your personal information. Payment processing is handled securely through Stripe.
                    </p>
                </section>
                
                <section>
                    <h2 className="text-xl font-bold text-brand-brown mb-4">Contact Us</h2>
                    <p className="text-gray-600">
                        If you have questions about this privacy policy, please contact us at hello@dububu.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
