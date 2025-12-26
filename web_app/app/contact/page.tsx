import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the DuBuBu team. We'd love to hear from you about orders, questions, or collaborations.",
};

export default function ContactPage() {
    return <ContactClient />;
}
