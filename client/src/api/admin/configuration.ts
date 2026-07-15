import { apiClient } from "./client";
import type { ApiResponse } from "../../types/admin/api";
import type { Configuration, UpdateConfigurationInput } from "../../types/admin/configuration";

export const getConfiguration = async (): Promise<Configuration[]> => {
  const response = await apiClient.get("/configuration");
  return (response.data as ApiResponse<Configuration[]>).data;
};

export const updateConfiguration = async (input: UpdateConfigurationInput): Promise<Configuration> => {
  const response = await apiClient.patch("/configuration", input);
  return (response.data as ApiResponse<Configuration>).data;
};
