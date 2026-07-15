export interface Approval {
  id: string;
  requisitionId: string;
  requesterId: string;
  requesterName: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  comments: string | null;
}

export interface ApprovalDecisionInput {
  comments?: string;
}
