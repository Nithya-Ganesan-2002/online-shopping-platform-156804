"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * RegisterPage
 * Allows users to create a new account.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await register(name, email, password);
      router.push(next);
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message || "Registration failed")
          : "Registration failed";
      setErr(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container py-10">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-xl font-semibold mb-4">Create your account</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            required
          />
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
            minLength={6}
            required
          />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? "Creating..." : "Sign up"}
          </button>
        </form>
        <div className="mt-4 text-sm">
          Already have an account?{" "}
          <Link
            className="text-[var(--color-primary)] hover:underline"
            href={`/login?next=${encodeURIComponent(next)}`}
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
