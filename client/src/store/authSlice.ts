import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { REFRESH_KEY, TOKEN_KEY } from "@/api/shared/client";

export type Role = "candidate" | "recruiter" | "hr" | "admin" | "interviewer";

export interface SessionUser {
  id: string;
  email: string;
  full_name?: string;
  firstName?: string;
  lastName?: string;
  role: Role;
}

interface AuthState {
  user: SessionUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const storedUserRaw = typeof window !== "undefined" ? localStorage.getItem("hirehelp_user") : null;
const storedToken = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

let storedUser: SessionUser | null = null;
try {
  storedUser = storedUserRaw ? (JSON.parse(storedUserRaw) as SessionUser) : null;
} catch {
  storedUser = null;
  if (typeof window !== "undefined") localStorage.removeItem("hirehelp_user");
}

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  // true until the initial "who am I" check resolves, so route guards don't
  // flash a redirect to /login before a persisted session is confirmed.
  loading: Boolean(storedToken),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: SessionUser; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      if (action.payload.refreshToken) localStorage.setItem(REFRESH_KEY, action.payload.refreshToken);
      localStorage.setItem("hirehelp_user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    sessionResolved: (state) => {
      // called once on app boot after checking for a persisted session
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem("hirehelp_user");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, sessionResolved, logout } = authSlice.actions;
export default authSlice.reducer;
