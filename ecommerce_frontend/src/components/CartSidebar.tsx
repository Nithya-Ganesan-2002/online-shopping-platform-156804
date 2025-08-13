"use client";

import React from "react";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * CartSidebar
 * Right-side drawer showing cart items and checkout action.
 */
export default function CartSidebar() {
  const { cartOpen, closeCart } = useUI();
  const { items, subtotal, updateItem, removeItem } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
        aria-hidden={!cartOpen}
      />
      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-[90%] sm:w-[420px] bg-white border-l transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderColor: "var(--color-border)" }}
        aria-hidden={!cartOpen}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="font-semibold">Your cart</h3>
          <button className="btn btn-outline" onClick={closeCart}>Close</button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-muted">Your cart is empty.</div>
          ) : (
            items.map((it) => (
              <div key={it.productId} className="flex gap-3">
                <div className="h-16 w-16 rounded-md bg-[rgba(0,0,0,0.05)]" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium line-clamp-1">
                        {it.product?.name || "Product"}
                      </div>
                      <div className="text-sm text-muted">
                        {formatCurrency(it.product?.price ?? 0)}
                      </div>
                    </div>
                    <button
                      className="text-sm text-[var(--color-primary)] hover:underline"
                      onClick={() => removeItem(it.productId)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="btn btn-outline px-2 py-1"
                      onClick={() => updateItem(it.productId, Math.max(1, (it.quantity ?? 1) - 1))}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div className="w-8 text-center text-sm">{it.quantity}</div>
                    <button
                      className="btn btn-outline px-2 py-1"
                      onClick={() => updateItem(it.productId, (it.quantity ?? 1) + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn btn-primary w-full" onClick={closeCart}>
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
