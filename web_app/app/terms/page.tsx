import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read the terms and conditions for using DuBuBu.com and purchasing our products.",
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold font-heading text-brand-brown mb-8">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: December 2025</p>
            
            <div className="prose prose-gray max-w-none">
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-brand-brown mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-600 mb-4">
                        By accessing and using DuBuBu.com, you accept and agree to be bound by these Terms of Service.
                    </p>
                </section>
                
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-brand-brown mb-4">2. Products and Pricing</h2>
                    <p className="text-gray-600 mb-4">
                        All prices are listed in USD. We reserve the right to modify prices at any time. Product availability is subject to change without notice.
                    </p>
                </section>
                
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-brand-brown mb-4">3. Orders and Payment</h2>
                    <p className="text-gray-600 mb-4">
                        By placing an order, you agree to provide accurate and complete information. We reserve the right to refuse or cancel orders at our discretion.
                    </p>
                </section>
                
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-brand-brown mb-4">4. Intellectual Property</h2>
                    <p className="text-gray-600 mb-4">
                        All content on this website is protected by intellectual property laws. Bubu & Dudu characters are created by Huang Xiao B.
                    </p>
                </section>
                
                <section>
                    <h2 className="text-xl font-bold text-brand-brown mb-4">5. Contact</h2>
                    <p className="text-gray-600">
                        For questions about these terms, contact us at hello@dububu.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
