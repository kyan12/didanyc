import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DIDA NYC — Barber-Grade Men's Hair Care",
    template: "%s — DIDA NYC",
  },
  description:
    "Premium men's hair care built on barber-grade performance, a proprietary scent signature, and a clean finish. Shop shampoo, pomades, and styling products from DIDA NYC.",
  keywords: [
    "men's hair care",
    "barber pomade",
    "matte pomade",
    "men's grooming NYC",
    "DIDA NYC",
    "barber grade hair products",
  ],
  openGraph: {
    siteName: "DIDA NYC",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
