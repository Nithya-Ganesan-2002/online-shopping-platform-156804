"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * Input
 * A simple styled input with label and error.
 */
export default function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <label className="block w-full">
      {label && <div className="mb-1 text-sm">{label}</div>}
      <input {...props} className={`input ${props.className || ""}`} />
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </label>
  );
}
