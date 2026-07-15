import { apiClient } from "./client";
import type { ApiMessageResponse, ApiResponse } from "../../types/admin/api";
import type { AuthUser, ChangePasswordInput, LoginInput, LoginResult, RefreshTokenResult } from "../../types/admin/auth";

export const loginRequest = async (input: LoginInput): Promise<LoginResult> => {
  const response = await apiClient.post("/auth/login", input, { skipAuthRefresh: true });
  return (response.data as ApiResponse<LoginResult>).data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiClient.get("/auth/me");
  return (response.data as ApiResponse<AuthUser>).data;
};

export const refreshTokenRequest = async (refreshToken: string): Promise<RefreshTokenResult> => {
  const response = await apiClient.post("/auth/refresh", { refreshToken }, { skipAuthRefresh: true });
  return (response.data as ApiResponse<RefreshTokenResult>).data;
};

export const logoutRequest = async (refreshToken: string): Promise<void> => {
  await apiClient.post("/auth/logout", { refreshToken });
};

export const changePasswordRequest = async (input: ChangePasswordInput): Promise<string> => {
  const response = await apiClient.post("/auth/change-password", input);
  return (response.data as ApiMessageResponse).message;
};