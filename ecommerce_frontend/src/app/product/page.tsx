"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPublic } from "@/lib/api";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import AddToCart from "@/components/AddToCart";

/**
 * PUBLIC_INTERFACE
 * ProductPage
 * Client-rendered product details using ?id= query parameter.
 */
export default function ProductPage() {
  const params = useSearchParams();
  const id = params.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) {
        setProduct(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getPublic(`/v1/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <main className="container py-8">
      {!id ? (
        <div className="text-muted">Missing product id.</div>
      ) : loading ? (
        <div className="text-muted">Loading...</div>
      ) : !product ? (
        <div className="text-muted">Product not found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full aspect-square rounded-xl bg-[rgba(0,0,0,0.05)]" />
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <div className="mt-1 text-muted">
              {product.brand || product.category}
            </div>
            <div className="mt-4 text-xl font-semibold">
              {formatCurrency(product.price ?? 0)}
            </div>
            <p className="mt-4 text-sm leading-6">
              {product.description || "No description."}
            </p>
            <div className="mt-6">
              <AddToCart product={product} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
