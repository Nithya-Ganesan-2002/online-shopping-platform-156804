"use client";

import React, { createContext, useContext, useState } from "react";

type UIContextType = {
  cartOpen: boolean;
  // PUBLIC_INTERFACE
  openCart: () => void;
  // PUBLIC_INTERFACE
  closeCart: () => void;
  // PUBLIC_INTERFACE
  toggleCart: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

/**
 * PUBLIC_INTERFACE
 * UIProvider
 * Provides UI state (like cart sidebar visibility) to the app.
 */
export default function UIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  const value: UIContextType = {
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    toggleCart: () => setCartOpen((s) => !s),
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useUI
 * Hook to access UI state and actions.
 */
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
