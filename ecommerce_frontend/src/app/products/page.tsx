"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getPublic } from "@/lib/api";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Input from "@/components/Input";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * ProductsPage
 * Displays product grid with search and simple price filters.
 */
export default function ProductsPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const q = params.get("q") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const category = params.get("category") || "";

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (q) qs.set("q", q);
      if (category) qs.set("category", category);
      if (minPrice) qs.set("minPrice", minPrice);
      if (maxPrice) qs.set("maxPrice", maxPrice);
      const res = await getPublic(`/v1/products?${qs.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : (data.items ?? []));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, minPrice, maxPrice, category]);

  const [qInput, setQInput] = useState(q);
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (qInput) next.set("q", qInput);
    if (minInput) next.set("minPrice", minInput);
    if (maxInput) next.set("maxPrice", maxInput);
    if (category) next.set("category", category);
    router.push(`/products?${next.toString()}`);
  }

  const grid = useMemo(() => {
    if (loading) return <div className="text-muted">Loading...</div>;
    if (products.length === 0) return <div className="text-muted">No products found.</div>;
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id ?? p._id} product={p} />
        ))}
      </div>
    );
  }, [products, loading]);

  return (
    <main className="container py-8">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Products</h1>

      <form onSubmit={applyFilters} className="card p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Search..."
          value={qInput}
          onChange={(e) => setQInput(e.currentTarget.value)}
        />
        <Input
          placeholder="Min price"
          type="number"
          min="0"
          step="0.01"
          value={minInput}
          onChange={(e) => setMinInput(e.currentTarget.value)}
        />
        <Input
          placeholder="Max price"
          type="number"
          min="0"
          step="0.01"
          value={maxInput}
          onChange={(e) => setMaxInput(e.currentTarget.value)}
        />
        <button className="btn btn-primary">Apply</button>
      </form>

      {grid}
    </main>
  );
}
