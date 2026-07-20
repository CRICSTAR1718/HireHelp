// This module's 4 api files (assignment/calendar/feedback/schedule) each
// hardcoded their own API_BASE_URL (defaulting to the old standalone
// service's own dev port, http://localhost:3000) and called fetch() with no
// Authorization header at all. Both are fixed here in one place:
//   - base URL now points at the actual mounted prefix, /api/interviews
//   - credentials: 'include' sends httpOnly cookies automatically
export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(`${import.meta.env.VITE_API_URL || "/api"}/interviews${path}`, { ...init, headers, credentials: 'include' });
}
