"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/types";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * OrdersPage
 * Shows a list of orders for the authenticated user.
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/v1/orders", { method: "GET" });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : (data.items ?? []));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="container py-8">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Order history</h1>
      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-muted">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const id = o.id ?? o._id!;
            return (
              <div key={id} className="card p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm">Order <strong>#{id}</strong></div>
                  <div className="text-sm text-muted">{o.status || "processing"} • {new Date(o.createdAt || Date.now()).toLocaleString()}</div>
                </div>
                <Link href={`/order?id=${encodeURIComponent(id)}`} className="btn btn-outline">View</Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
