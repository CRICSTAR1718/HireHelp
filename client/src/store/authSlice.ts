import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

let storedUser: SessionUser | null = null;
try {
  storedUser = storedUserRaw ? (JSON.parse(storedUserRaw) as SessionUser) : null;
} catch {
  storedUser = null;
  if (typeof window !== "undefined") localStorage.removeItem("hirehelp_user");
}

const initialState: AuthState = {
  user: storedUser,
  token: null,
  isAuthenticated: Boolean(storedUser), // If we have a persisted user, assume authenticated
  loading: false, // No /me check on boot anymore
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
      localStorage.removeItem("hirehelp_user");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, sessionResolved, logout } = authSlice.actions;
export default authSlice.reducer;
