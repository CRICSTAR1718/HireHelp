import { apiClient } from "./client";
import type { ApiResponse } from "../../types/admin/api";
import type { CreateDepartmentInput, Department, UpdateDepartmentInput } from "../../types/admin/departments";

export const getDepartments = async (): Promise<Department[]> => {
  const response = await apiClient.get("/departments");
  return (response.data as ApiResponse<Department[]>).data;
};

export const getDepartment = async (id: string): Promise<Department> => {
  const response = await apiClient.get(`/departments/${id}`);
  return (response.data as ApiResponse<Department>).data;
};

export const createDepartment = async (input: CreateDepartmentInput): Promise<Department> => {
  const response = await apiClient.post("/departments", input);
  return (response.data as ApiResponse<Department>).data;
};

export const updateDepartment = async (id: string, input: UpdateDepartmentInput): Promise<Department> => {
  const response = await apiClient.patch(`/departments/${id}`, input);
  return (response.data as ApiResponse<Department>).data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await apiClient.delete(`/departments/${id}`);
};
