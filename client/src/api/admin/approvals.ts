import { apiClient } from "./client";
import type { ApiResponse } from "../../types/admin/api";
import type { Approval, ApprovalDecisionInput } from "../../types/admin/approvals";

export const getApprovals = async (): Promise<Approval[]> => {
  const response = await apiClient.get("/approvals");
  return (response.data as ApiResponse<Approval[]>).data;
};

export const getApproval = async (id: string): Promise<Approval> => {
  const response = await apiClient.get(`/approvals/${id}`);
  return (response.data as ApiResponse<Approval>).data;
};

export const approveApproval = async (id: string, input?: ApprovalDecisionInput): Promise<Approval> => {
  const response = await apiClient.post(`/approvals/${id}/approve`, input || {});
  return (response.data as ApiResponse<Approval>).data;
};

export const rejectApproval = async (id: string, input?: ApprovalDecisionInput): Promise<Approval> => {
  const response = await apiClient.post(`/approvals/${id}/reject`, input || {});
  return (response.data as ApiResponse<Approval>).data;
};
