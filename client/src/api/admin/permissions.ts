import { apiClient } from "./client";
import type { ApiResponse } from "../../types/admin/api";
import type { CreatePermissionInput, Permission, UpdatePermissionInput } from "../../types/admin/permissions";

export const getPermissions = async (): Promise<Permission[]> => {
  const response = await apiClient.get("/permissions");
  return (response.data as ApiResponse<Permission[]>).data;
};

export const getPermission = async (id: string): Promise<Permission> => {
  const response = await apiClient.get(`/permissions/${id}`);
  return (response.data as ApiResponse<Permission>).data;
};

export const createPermission = async (input: CreatePermissionInput): Promise<Permission> => {
  const response = await apiClient.post("/permissions", input);
  return (response.data as ApiResponse<Permission>).data;
};

export const updatePermission = async (id: string, input: UpdatePermissionInput): Promise<Permission> => {
  const response = await apiClient.patch(`/permissions/${id}`, input);
  return (response.data as ApiResponse<Permission>).data;
};

export const deletePermission = async (id: string): Promise<void> => {
  await apiClient.delete(`/permissions/${id}`);
};
