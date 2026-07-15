import { TOKEN_KEY, REFRESH_KEY } from "../shared/client";

// Every function here was broken before this fix: BASE resolved to
// `undefined` (VITE_API_URL is intentionally unset — see .env.example, the
// app runs through Vite's proxy at /api), none of the paths had the
// /admin prefix the backend actually mounts staff auth under, and they
// all relied on a `token` cookie that /admin/auth/login never sets (it
// returns tokens as JSON, same as every staff login response).
//
// login/register/getMe/logout below are currently unused dead code (the
// active login flow is api/shared/auth.ts + StaffLoginPage; Navbar's
// sign-out uses the shared Redux useAuth hook) but are fixed for
// correctness rather than left as broken traps for later.
//
// refreshToken() IS on the live path — index.ts's response interceptor
// calls it on any 401, and was silently failing every time, which is why
// a token nearing/past its 1h expiry (env JWT_EXPIRES_IN) surfaced as a
// flat "401 Unauthorized" on things like creating a requisition instead
// of transparently refreshing and retrying.
const BASE = "/api/admin/auth";

export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Login failed");
  return data;
};

export const logout = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  await fetch(`${BASE}/logout`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const refreshToken = async () => {
  const storedRefreshToken = localStorage.getItem(REFRESH_KEY);
  if (!storedRefreshToken) throw new Error("No refresh token available");

  const res = await fetch(`${BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: storedRefreshToken }),
  });
  if (!res.ok) throw new Error("Refresh failed");

  const body = await res.json();
  const { accessToken, refreshToken: newRefreshToken } = body.data;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, newRefreshToken);
  return body.data;
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${BASE}/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data ?? body;
  } catch {
    return null;
  }
};

export const register = async (email: string, password: string, full_name: string, role: string) => {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Registration failed");
  return data;
};
