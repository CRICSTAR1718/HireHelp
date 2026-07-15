import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as approvalsApi from "../../../api/admin/approvals";
import type { ApprovalDecisionInput } from "../../../types/admin/approvals";

export const useApprovals = () => {
  return useQuery({
    queryKey: ["approvals"],
    queryFn: approvalsApi.getApprovals,
  });
};

export const useApproval = (id: string) => {
  return useQuery({
    queryKey: ["approvals", id],
    queryFn: () => approvalsApi.getApproval(id),
    enabled: !!id,
  });
};

export const useApproveApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input?: ApprovalDecisionInput }) =>
      approvalsApi.approveApproval(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["approvals", id] });
      toast.success("Approval approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve");
    },
  });
};

export const useRejectApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input?: ApprovalDecisionInput }) =>
      approvalsApi.rejectApproval(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["approvals", id] });
      toast.success("Approval rejected successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject");
    },
  });
};
