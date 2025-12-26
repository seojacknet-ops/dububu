import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: "DuBuBu.com - Where Love Meets Cute 🐻🐼",
    template: "%s | DuBuBu",
  },
  description: "Discover the cutest Bubu & Dudu merchandise for couples. Plushies, apparel, accessories, and matching sets. Free shipping on orders over $50!",
  keywords: ["bubu dudu", "couple gifts", "matching couples", "kawaii", "plushies", "cute merchandise"],
  authors: [{ name: "DuBuBu" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dububu.com",
    siteName: "DuBuBu",
    title: "DuBuBu.com - Where Love Meets Cute",
    description: "The cutest Bubu & Dudu merchandise for couples.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DuBuBu.com - Where Love Meets Cute",
    description: "The cutest Bubu & Dudu merchandise for couples.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${nunito.variable} antialiased`}
      >
        <AnnouncementBar />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
