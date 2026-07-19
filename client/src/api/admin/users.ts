import { apiClient } from "./client";
import type { ApiResponse } from "../../types/admin/api";
import type { CreateUserInput, UpdateUserInput, User } from "../../types/admin/users";

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get("/users");
  return (response.data as ApiResponse<User[]>).data;
};

export const getUsersByRoles = async (roleNames: string[]): Promise<User[]> => {
  const response = await apiClient.get("/users/by-roles", {
    params: { roleIds: roleNames.join(',') }
  });
  return (response.data as ApiResponse<User[]>).data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return (response.data as ApiResponse<User>).data;
};

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const response = await apiClient.post("/users", input);
  return (response.data as ApiResponse<User>).data;
};

export const updateUser = async (id: string, input: UpdateUserInput): Promise<User> => {
  const response = await apiClient.patch(`/users/${id}`, input);
  return (response.data as ApiResponse<User>).data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
