import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the DuBuBu team. We'd love to hear from you about orders, questions, or collaborations.",
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold font-heading text-brand-brown mb-8">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-8">We'd love to hear from you! 💌</p>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-bold text-brand-brown mb-4">Get in Touch</h2>
                    <p className="text-gray-600 mb-4">
                        Have a question about your order? Want to collaborate? Just want to say hi?
                    </p>
                    <p className="text-gray-600">
                        <strong>Email:</strong> hello@dububu.com<br />
                        <strong>Instagram:</strong> @dububu.co<br />
                        <strong>Response Time:</strong> 24-48 hours
                    </p>
                </div>
                <div className="bg-brand-cream/50 p-6 rounded-2xl">
                    <p className="text-center text-gray-500">
                        Contact form coming soon! 🐻🐼
                    </p>
                </div>
            </div>
        </div>
    );
}
