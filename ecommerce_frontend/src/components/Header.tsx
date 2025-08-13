"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import { useRouter } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * Header
 * Top navigation bar with brand, search, and user/cart actions.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { toggleCart } = useUI();
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/products?${params.toString()}`);
  }

  const itemCount = items.reduce((a, b) => a + b.quantity, 0);

  return (
    <header className="header bg-white">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-[var(--color-primary)]" />
            <span className="font-semibold">ShopLite</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/products" className="text-sm text-muted hover:text-black">Products</Link>
            <Link href="/orders" className="text-sm text-muted hover:text-black">Orders</Link>
          </nav>
        </div>

        <form onSubmit={onSearch} className="flex-1 hidden md:block max-w-xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="input"
            aria-label="Search products"
          />
        </form>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleCart}
            className="relative btn btn-outline px-3 py-2"
            aria-label="Open cart"
            title="Cart"
          >
            <span className="i-heroicons-shopping-cart" aria-hidden="true">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-[var(--color-secondary)] rounded-full px-1.5 py-0.5">
                {itemCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm">Hi, {user.name || user.email}</span>
              <button onClick={logout} className="btn btn-outline">Logout</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">Login</Link>
              <Link href="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
