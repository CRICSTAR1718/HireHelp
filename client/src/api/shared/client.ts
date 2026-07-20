import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

// Single shared axios instance for the whole merged app.
// Every domain's api/*.ts previously created its own axios instance —
// this is the one all of them should now import.
export const TOKEN_KEY = "hirehelp_access_token";
export const REFRESH_KEY = "hirehelp_refresh_token";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onAuthFailure: (() => void) | undefined;
export const setAuthFailureHandler = (fn: (() => void) | undefined) => {
  onAuthFailure = fn;
};

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      onAuthFailure?.();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
