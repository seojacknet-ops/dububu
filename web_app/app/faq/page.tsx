import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about DuBuBu shipping, returns, products, and more.",
};

const faqs = [
    {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 5-10 business days within the US. International shipping takes 10-21 business days depending on the destination."
    },
    {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free worldwide shipping on all orders over $50."
    },
    {
        question: "What is your return policy?",
        answer: "We offer hassle-free 30-day returns. If you're not completely satisfied, you can return unused items for a full refund."
    },
    {
        question: "Are these official Bubu & Dudu products?",
        answer: "Our products are fan-made merchandise inspired by the beloved characters. We are not officially affiliated with the original creator."
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes! We ship to most countries worldwide. Shipping costs and delivery times vary by location."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive an email with tracking information. You can also check your order status in your account."
    },
];

export default function FAQPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold font-heading text-brand-brown mb-8">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 mb-12">Find answers to common questions about shipping, returns, and more.</p>
            
            <div className="space-y-6 max-w-3xl">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-brand-brown/10">
                        <h3 className="font-bold text-brand-brown mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center">
                <p className="text-gray-600">Still have questions?</p>
                <a href="/contact" className="text-brand-pink hover:underline font-medium">Contact us →</a>
            </div>
        </div>
    );
}
