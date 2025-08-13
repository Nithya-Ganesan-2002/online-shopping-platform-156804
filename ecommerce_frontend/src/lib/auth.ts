"use client";

import { apiFetch } from "./api";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

/**
 * Extract token from a backend response supporting different shapes.
 */
function extractToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const root = data as Record<string, unknown>;
  const nested = (root["data"] as Record<string, unknown> | undefined) ?? undefined;

  const candidates = [
    root["token"],
    root["accessToken"],
    root["jwt"],
    nested?.["token"],
    nested?.["accessToken"],
    nested?.["jwt"],
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }
  return null;
}

function extractMessage(data: unknown): string | null {
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message?: unknown }).message;
    return typeof m === "string" ? m : null;
  }
  return null;
}

/**
 * Persist token to localStorage.
 */
function persistToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

// PUBLIC_INTERFACE
export async function login(payload: LoginPayload) {
  /** Logs-in the user with email/password, stores JWT, and returns response JSON. */
  const res = await apiFetch("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(extractMessage(data) || "Login failed");
  }
  const token = extractToken(data);
  if (token) persistToken(token);
  return data;
}

// PUBLIC_INTERFACE
export async function register(payload: RegisterPayload) {
  /** Registers a new user; if token is returned it is persisted. */
  const res = await apiFetch("/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(extractMessage(data) || "Registration failed");
  }
  const token = extractToken(data);
  if (token) persistToken(token);
  return data;
}

// PUBLIC_INTERFACE
export async function me() {
  /** Fetches the current user profile using the stored token. */
  const res = await apiFetch("/v1/auth/me", { method: "GET" });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

// PUBLIC_INTERFACE
export function logout() {
  /** Clears the JWT from localStorage to log the user out. */
  persistToken(null);
}
