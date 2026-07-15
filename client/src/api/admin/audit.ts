import { apiClient } from "./client";
import type { ApiResponse } from "../../types/admin/api";
import type { AuditLog, AuditLogDetails } from "../../types/admin/audit";

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await apiClient.get("/audit");
  return (response.data as ApiResponse<AuditLog[]>).data;
};

export const getAuditLog = async (id: string): Promise<AuditLogDetails> => {
  const response = await apiClient.get(`/audit/${id}`);
  return (response.data as ApiResponse<AuditLogDetails>).data;
};
