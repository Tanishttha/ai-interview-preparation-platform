import { getAuthHeader } from './firebase';

/**
 * Drop-in replacement for `fetch` that automatically attaches the current
 * user's identity (Firebase ID token, or the simulated-auth header in dev)
 * to every request. Use this for all calls to our own /api/* backend.
 */
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const authHeader = await getAuthHeader();
  const headers = new Headers(init.headers || {});
  Object.entries(authHeader).forEach(([key, value]) => headers.set(key, value));

  return fetch(input, { ...init, headers });
}
