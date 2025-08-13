"use client";

import { API_BASE_URL } from "./config";

/**
 * Get auth token from localStorage. Runs on client only.
 */
// PUBLIC_INTERFACE
export function getToken(): string | null {
  /** Returns the bearer token from localStorage if present, otherwise null. */
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Build headers for authenticated requests.
 */
// PUBLIC_INTERFACE
export function authHeaders(extra?: HeadersInit): HeadersInit {
  /** Builds standard JSON headers with Authorization if a token exists. */
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra || {}),
  };
}

/**
 * Perform a public (non-authenticated) GET to the API base.
 */
// PUBLIC_INTERFACE
export function getPublic(path: string, init?: RequestInit) {
  /** Fetches without Authorization header from the API base URL. */
  return fetch(safeJoin(API_BASE_URL, path), {
    ...(init || {}),
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

/**
 * Perform an authenticated request to the API.
 */
// PUBLIC_INTERFACE
export async function apiFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  /** Fetches with Authorization header if available. Throws on 401 to allow caller to handle logout. */
  const res = await fetch(safeJoin(API_BASE_URL, path), {
    ...init,
    headers: authHeaders(init?.headers),
    cache: "no-store",
  });

  if (res.status === 401) {
    // Give callers a chance to react
  }

  return res;
}

/**
 * Join base URL with path safely.
 */
function safeJoin(base: string, path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base.replace(/\/$/, "")}${path}`;
}
