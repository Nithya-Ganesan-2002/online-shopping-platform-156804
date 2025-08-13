"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/types";

/**
 * PUBLIC_INTERFACE
 * OrderPage
 * Client-rendered order details using ?id= query parameter.
 */
export default function OrderPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) {
        setOrder(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await apiFetch(`/v1/orders/${id}`, { method: "GET" });
        const data = await res.json();
        setOrder(data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (!id) {
    return (
      <main className="container py-8">
        <div className="text-muted">Missing order id.</div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container py-8">
        <div className="text-muted">Loading...</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="container py-8">
        <div className="text-muted">Order not found.</div>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">
        Order #{order.id ?? order._id}
      </h1>
      <div className="card p-4">
        <div className="text-sm text-muted mb-2">
          Status: <strong>{order.status || "processing"}</strong>
        </div>
        <div className="text-sm text-muted mb-4">
          Placed on: {new Date(order.createdAt || Date.now()).toLocaleString()}
        </div>
        <div className="text-sm">Items:</div>
        <ul className="mt-2 space-y-2">
          {(order.items || []).map((it, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <div className="text-sm">{it.product?.name || it.productId}</div>
              <div className="text-sm">x{it.quantity}</div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
