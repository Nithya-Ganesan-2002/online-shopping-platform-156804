"use client";

import Link from "next/link";
import React from "react";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

/**
 * PUBLIC_INTERFACE
 * ProductCard
 * Displays a product with image, name, price and add-to-cart action.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const pid = product.id ?? product._id!;

  return (
    <div className="card p-3 flex flex-col">
      <Link href={`/product?id=${encodeURIComponent(pid)}`} className="block">
        <div className="aspect-square w-full rounded-md bg-[rgba(0,0,0,0.05)] flex items-center justify-center text-muted overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={640}
              height={640}
              className="h-full w-full object-cover rounded-md"
              unoptimized
            />
          ) : (
            <span className="text-xs">No image</span>
          )}
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted line-clamp-2">{product.description}</p>
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-semibold">{formatCurrency(product.price ?? 0)}</div>
        <button
          className="btn btn-primary"
          onClick={() => addItem(product, 1)}
          aria-label={`Add ${product.name} to cart`}
        >
          Add
        </button>
      </div>
    </div>
  );
}
