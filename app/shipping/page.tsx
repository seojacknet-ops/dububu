import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping & Returns",
    description: "Learn about DuBuBu shipping options, delivery times, and our hassle-free 30-day return policy.",
};

export default function ShippingPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold font-heading text-brand-brown mb-8">Shipping & Returns</h1>
            
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-brand-brown mb-4">🚚 Shipping Information</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-brown/10 space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-900">Free Shipping</h3>
                        <p className="text-gray-600">Enjoy free worldwide shipping on all orders over $50!</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Standard Shipping (US)</h3>
                        <p className="text-gray-600">5-10 business days - $5.99</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">International Shipping</h3>
                        <p className="text-gray-600">10-21 business days - Varies by location</p>
                    </div>
                </div>
            </section>
            
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-brand-brown mb-4">🔄 Returns Policy</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-brown/10 space-y-4">
                    <p className="text-gray-600">
                        We want you to love your purchase! If you're not completely satisfied, we offer hassle-free returns within 30 days of delivery.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Items must be unused and in original packaging</li>
                        <li>Return shipping is the customer's responsibility</li>
                        <li>Refunds are processed within 5-7 business days</li>
                        <li>Custom or personalized items cannot be returned</li>
                    </ul>
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold text-brand-brown mb-4">📦 Order Tracking</h2>
                <p className="text-gray-600">
                    Once your order ships, you'll receive an email with tracking information. You can track your package directly through the carrier's website.
                </p>
            </section>
        </div>
    );
}
