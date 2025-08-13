"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * CheckoutPage
 * Collects shipping address and triggers backend checkout.
 */
export default function CheckoutPage() {
  const { checkout, subtotal, items, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await checkout(address);
      setSuccess("Order placed successfully.");
      await clear().catch(() => {});
      setTimeout(() => router.push("/orders"), 800);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message || "Checkout failed")
          : "Checkout failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-8">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Checkout</h1>
      {!user && (
        <div className="mb-4 text-sm">
          You are checking out as a guest.{" "}
          <Link className="text-[var(--color-primary)] hover:underline" href={`/login?next=${encodeURIComponent("/checkout")}`}>
            Login
          </Link>{" "}
          for faster checkout.
        </div>
      )}
      {items.length === 0 ? (
        <div className="text-muted">Your cart is empty.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={onSubmit} className="card p-4 space-y-3">
            <Input label="Address line 1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.currentTarget.value })} required />
            <Input label="Address line 2" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.currentTarget.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.currentTarget.value })} required />
              <Input label="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.currentTarget.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Postal code" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.currentTarget.value })} required />
              <Input label="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.currentTarget.value })} required />
            </div>
            {err && <div className="text-sm text-red-600">{err}</div>}
            {success && <div className="text-sm text-green-700">{success}</div>}
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Processing..." : "Place order"}
            </button>
          </form>

          <div className="card p-4">
            <h2 className="font-semibold mb-3">Summary</h2>
            <div className="text-sm text-muted mb-1">{items.length} items</div>
            <div className="text-sm">
              Subtotal: <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="text-sm text-muted">Taxes and shipping calculated at checkout.</div>
          </div>
        </div>
      )}
    </main>
  );
}
