import apiClient from "./client";
import type { Role, SessionUser } from "@/store/authSlice";

export interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: Role;
    };
  };
}

// Staff authentication is provided by the admin/RBAC module in the monolith.
export async function staffLogin(input: LoginInput): Promise<{ user: SessionUser; token: string; refreshToken: string }> {
  const { data } = await apiClient.post<LoginResponse>("/admin/auth/login", input);
  return {
    token: data.data.accessToken,
    refreshToken: data.data.refreshToken,
    user: {
      id: data.data.user.id,
      email: data.data.user.email,
      full_name: `${data.data.user.firstName} ${data.data.user.lastName}`,
      firstName: data.data.user.firstName,
      lastName: data.data.user.lastName,
      role: data.data.user.role,
    },
  };
}

export async function getCurrentStaffUser(): Promise<SessionUser> {
  const { data } = await apiClient.get<{ success: boolean; data: SessionUser }>("/admin/auth/me");
  return data.data;
}

export async function staffForgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>("/admin/auth/forgot-password", { email });
  return data;
}

export async function staffResetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>("/admin/auth/reset-password", { token, newPassword });
  return data;
}