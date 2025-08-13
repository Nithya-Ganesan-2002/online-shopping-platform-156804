import ProductCard from "@/components/ProductCard";
import { getPublic } from "@/lib/api";
import { Product } from "@/types";
import Link from "next/link";

/**
 * Home page displaying a minimal hero and featured products grid.
 */
export default async function Home() {
  let products: Product[] = [];
  try {
    const res = await getPublic("/v1/products?limit=8");
    const data = await res.json();
    // Support both plain array and paginated {items}
    products = Array.isArray(data) ? data : (data.items ?? []);
  } catch {
    // swallow error; show empty state
    products = [];
  }

  return (
    <main className="bg-white">
      <section className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Discover products you’ll love
            </h1>
            <p className="mt-3 text-muted">
              A minimal shopping experience built with a clean interface and
              delightful interactions.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/products" className="btn btn-primary">Shop now</Link>
              <Link href="/orders" className="btn btn-outline">My orders</Link>
            </div>
          </div>
          <div className="w-full h-48 md:h-56 rounded-xl bg-[rgba(26,115,232,0.08)] border border-[rgba(26,115,232,0.15)] flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm uppercase tracking-wider text-muted">Modern • Minimal • Responsive</div>
              <div className="mt-2 text-2xl font-medium text-[var(--color-primary)]">ShopLite</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-12 md:pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">Featured products</h2>
          <Link className="text-sm text-[var(--color-primary)] hover:underline" href="/products">Browse all</Link>
        </div>

        {products.length === 0 ? (
          <div className="text-muted">No featured products yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id ?? p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
