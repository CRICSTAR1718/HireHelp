import { apiClient } from "./client";
import type { ApiResponse } from "../../types/admin/api";
import type { CreateRoleInput, Role, UpdateRoleInput } from "../../types/admin/roles";
import type { Permission } from "../../types/admin/permissions";

export const getRoles = async (): Promise<Role[]> => {
  const response = await apiClient.get("/roles");
  return (response.data as ApiResponse<Role[]>).data;
};

export const getRole = async (id: string): Promise<Role> => {
  const response = await apiClient.get(`/roles/${id}`);
  return (response.data as ApiResponse<Role>).data;
};

export const createRole = async (input: CreateRoleInput): Promise<Role> => {
  const response = await apiClient.post("/roles", input);
  return (response.data as ApiResponse<Role>).data;
};

export const updateRole = async (id: string, input: UpdateRoleInput): Promise<Role> => {
  const response = await apiClient.patch(`/roles/${id}`, input);
  return (response.data as ApiResponse<Role>).data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await apiClient.delete(`/roles/${id}`);
};

export const getRolePermissions = async (roleId: string): Promise<Permission[]> => {
  const response = await apiClient.get(`/roles/${roleId}/permissions`);
  return (response.data as ApiResponse<Permission[]>).data;
};

export const setRolePermissions = async (roleId: string, permissionIds: string[]): Promise<void> => {
  await apiClient.put(`/roles/${roleId}/permissions`, { permissionIds });
};

export const removeRolePermission = async (roleId: string, permissionId: string): Promise<void> => {
  await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
};
