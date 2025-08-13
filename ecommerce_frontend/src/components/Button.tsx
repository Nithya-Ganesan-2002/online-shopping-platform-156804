"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * Button
 * Minimal wrapper for a styled button.
 */
export default function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" }) {
  const base =
    variant === "primary"
      ? "btn btn-primary"
      : variant === "secondary"
      ? "btn btn-secondary"
      : "btn btn-outline";
  return <button {...props} className={`${base} ${className}`} />;
}
