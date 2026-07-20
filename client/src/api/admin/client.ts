import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { TOKEN_KEY, REFRESH_KEY } from "../shared/client";
import type { ApiErrorResponse, ApiResponse } from "../../types/admin/api";
import type { RefreshTokenResult } from "../../types/admin/auth";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

// baseURL is /api/admin, not /api — every admin-rbac route (users, roles,
// permissions, departments, audit, configuration, approvals, auth) is
// mounted under that prefix in server/routes.ts. Every call in this
// module's sibling files (users.ts, roles.ts, etc.) uses paths relative to
// that, e.g. "/users" -> /api/admin/users.
export const apiClient = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || "/api"}/admin`, headers: { "Content-Type": "application/json" }, withCredentials: true });
// Token reads/writes here use the SAME localStorage keys as the shared
// Redux auth slice (store/authSlice.ts), because login for every staff role
// (admin/hr/interviewer) goes through the one shared StaffLoginPage, not
// through this module's own auth flow. Using a separate key here meant this
// client always saw itself as logged out even right after a successful
// login — that's the root cause behind "logged in as admin but nothing
// else works": every admin/*.ts data call authenticated with no token,
// hit 401, and silently rendered as empty pages.
const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_KEY),
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

let onAuthenticationFailure: (() => void) | undefined;
let onTokensUpdated: ((accessToken: string) => void) | undefined;
let refreshRequest: Promise<RefreshTokenResult> | undefined;

export const configureAuthenticationFailureHandler = (handler: (() => void) | undefined): void => { onAuthenticationFailure = handler; };
export const configureTokenUpdateHandler = (handler: ((accessToken: string) => void) | undefined): void => { onTokensUpdated = handler; };

const redirectTo = (path: "/403" | "/404"): void => { if (window.location.pathname !== path) window.location.assign(path); };

const refreshAccessToken = async (): Promise<RefreshTokenResult> => {
  // Cookie-based refresh - no token in body needed
  if (!refreshRequest) {
    refreshRequest = apiClient.post("/auth/refresh", {}, { skipAuthRefresh: true })
      .then((response) => (response.data as ApiResponse<RefreshTokenResult>).data)
      .finally(() => { refreshRequest = undefined; });
  }
  return refreshRequest;
};

// Authorization header no longer needed - cookies sent automatically with withCredentials: true

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const request = error.config as AxiosRequestConfig | undefined;
    if (status === 401 && request && !request.skipAuthRefresh && !request._retry) {
      request._retry = true;
      try {
        const tokens = await refreshAccessToken();
        // Tokens are now in cookies, no localStorage update needed
        onTokensUpdated?.(tokens.accessToken);
        return apiClient(request);
      } catch {
        tokenStorage.clear();
        onAuthenticationFailure?.();
        if (window.location.pathname !== "/login") window.location.assign("/login");
      }
    }
    if (status === 403) {
      console.error("403:", error.config?.url, error.response?.data);
      
    }
    if (status === 404) {
      console.error("404:", error.config?.url, error.response?.data);
      redirectTo("/404");
    }
    else if (status === 409) toast.error(error.response?.data.error ?? error.response?.data.message ?? "The request conflicts with the current data.");
    else if (status === 500) toast.error("Something went wrong on the server. Please try again.");
    return Promise.reject(error);
  },
);