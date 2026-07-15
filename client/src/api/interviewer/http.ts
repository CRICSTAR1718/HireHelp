import { TOKEN_KEY } from "../shared/client";

// This module's 4 api files (assignment/calendar/feedback/schedule) each
// hardcoded their own API_BASE_URL (defaulting to the old standalone
// service's own dev port, http://localhost:3000) and called fetch() with no
// Authorization header at all. Both are fixed here in one place:
//   - base URL now points at the actual mounted prefix, /api/interviews
//   - every call gets a Bearer token from the same localStorage key the
//     shared staff login (StaffLoginPage) writes to
export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(`/api/interviews${path}`, { ...init, headers });
}
