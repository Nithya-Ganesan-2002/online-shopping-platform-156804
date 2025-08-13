import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import CartSidebar from "@/components/CartSidebar";

export const metadata: Metadata = {
  title: "ShopLite",
  description: "Modern, minimalistic ecommerce experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <div id="app-root" className="flex-1">{children}</div>
          <Footer />
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
