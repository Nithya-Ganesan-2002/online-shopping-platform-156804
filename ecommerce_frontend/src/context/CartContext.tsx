"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch, getToken } from "@/lib/api";
import type { CartItem, Product, Order } from "@/types";

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  // PUBLIC_INTERFACE
  addItem: (product: Product, quantity?: number) => Promise<void>;
  // PUBLIC_INTERFACE
  updateItem: (productId: string, quantity: number) => Promise<void>;
  // PUBLIC_INTERFACE
  removeItem: (productId: string) => Promise<void>;
  // PUBLIC_INTERFACE
  clear: () => Promise<void>;
  // PUBLIC_INTERFACE
  refresh: () => Promise<void>;
  // PUBLIC_INTERFACE
  checkout: (shippingAddress?: Order["shippingAddress"]) => Promise<unknown>;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_KEY = "guest_cart";

/**
 * Load guest cart from localStorage.
 */
function loadGuest(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save guest cart to localStorage.
 */
function saveGuest(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

/**
 * PUBLIC_INTERFACE
 * CartProvider
 * Provides cart state and actions; uses backend when authenticated, localStorage as guest fallback.
 */
export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const authed = !!getToken();

  const loadFromBackend = useCallback(async () => {
    const res = await apiFetch("/v1/cart", { method: "GET" });
    if (!res.ok) throw new Error("Failed to load cart");
    const data = await res.json();
    const backendItems: CartItem[] = data?.items || data || [];
    setItems(backendItems);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (authed) {
        await loadFromBackend();
      } else {
        setItems(loadGuest());
      }
    } finally {
      setLoading(false);
    }
  }, [authed, loadFromBackend]);

  useEffect(() => {
    load();
  }, [load]);

  const value: CartContextType = useMemo(() => {
    const subtotal = items.reduce((acc, it) => {
      const price = it.product?.price ?? 0;
      return acc + price * it.quantity;
    }, 0);

    return {
      items,
      loading,
      subtotal,
      async addItem(product: Product, quantity = 1) {
        if (authed) {
          const res = await apiFetch("/v1/cart/items", {
            method: "POST",
            body: JSON.stringify({
              productId: product.id ?? product._id,
              quantity,
            }),
          });
          if (!res.ok) throw new Error("Failed to add item");
          await loadFromBackend();
        } else {
          const list = [...items];
          const id = product.id ?? product._id!;
          const found = list.find((i) => i.productId === id);
          if (found) {
            found.quantity += quantity;
          } else {
            list.push({ productId: id, quantity, product });
          }
          setItems(list);
          saveGuest(list);
        }
      },
      async updateItem(productId: string, quantity: number) {
        if (authed) {
          const res = await apiFetch(`/v1/cart/items/${productId}`, {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
          });
          if (!res.ok) throw new Error("Failed to update item");
          await loadFromBackend();
        } else {
          const list = items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          );
          setItems(list);
          saveGuest(list);
        }
      },
      async removeItem(productId: string) {
        if (authed) {
          const res = await apiFetch(`/v1/cart/items/${productId}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to remove item");
          await loadFromBackend();
        } else {
          const list = items.filter((i) => i.productId !== productId);
          setItems(list);
          saveGuest(list);
        }
      },
      async clear() {
        if (authed) {
          await apiFetch("/v1/cart", { method: "DELETE" });
          await loadFromBackend();
        } else {
          setItems([]);
          saveGuest([]);
        }
      },
      async refresh() {
        await load();
      },
      async checkout(shippingAddress?: Order["shippingAddress"]) {
        const res = await apiFetch("/v1/orders/checkout", {
          method: "POST",
          body: JSON.stringify({ shippingAddress }),
        });
        const data = (await res.json().catch(() => ({}))) as unknown;
        if (!res.ok) {
          const msg =
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof (data as { message?: unknown }).message === "string"
              ? ((data as { message: string }).message as string)
              : "Checkout failed";
          throw new Error(msg);
        }
        await loadFromBackend().catch(() => {});
        return data;
      },
    };
  }, [items, loading, authed, loadFromBackend, load]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useCart
 * Hook to access the cart state and actions.
 */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
