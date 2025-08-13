"use client";

import React from "react";
import AuthProvider from "@/context/AuthContext";
import CartProvider from "@/context/CartContext";
import UIProvider from "@/context/UIContext";

/**
 * PUBLIC_INTERFACE
 * Providers
 * Wraps the application with all necessary React Context providers.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <CartProvider>{children}</CartProvider>
      </UIProvider>
    </AuthProvider>
  );
}
