"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * LoginPage
 * Allows users to log in with email and password.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await login(email, password);
      router.push(next);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message || "Login failed")
          : "Login failed";
      setErr(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container py-10">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-sm">
          No account?{" "}
          <Link
            className="text-[var(--color-primary)] hover:underline"
            href={`/register?next=${encodeURIComponent(next)}`}
          >
            Create one
          </Link>
        </div>
      </div>
    </main>
  );
}
