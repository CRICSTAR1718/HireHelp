import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

// Single shared axios instance for the whole merged app.
// Every domain's api/*.ts previously created its own axios instance —
// this is the one all of them should now import.
export const TOKEN_KEY = "hirehelp_access_token";
export const REFRESH_KEY = "hirehelp_refresh_token";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let onAuthFailure: (() => void) | undefined;
export const setAuthFailureHandler = (fn: (() => void) | undefined) => {
  onAuthFailure = fn;
};

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Cookie-based refresh - no token in body needed
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || "/api"}/admin/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.data.accessToken;

        onTokenRefreshed(newAccessToken);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
