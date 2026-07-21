export const API_BASE_URL = '/api';

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.json() as Promise<T>;
}
