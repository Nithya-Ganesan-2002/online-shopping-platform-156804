import React from "react";

/**
 * PUBLIC_INTERFACE
 * Spinner
 * Small text-based loading indicator.
 */
export default function Spinner({ label = "Loading..." }: { label?: string }) {
  return <div className="text-muted">{label}</div>;
}
