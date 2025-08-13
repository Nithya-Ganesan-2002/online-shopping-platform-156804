import React from "react";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Footer
 * Minimal footer with brand and links.
 */
export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[var(--color-primary)]" />
          <span className="text-sm text-muted">© {new Date().getFullYear()} ShopLite</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link className="text-muted hover:text-black" href="/products">Products</Link>
          <Link className="text-muted hover:text-black" href="/orders">Orders</Link>
          <Link className="text-muted hover:text-black" href="/checkout">Checkout</Link>
        </div>
      </div>
    </footer>
  );
}
