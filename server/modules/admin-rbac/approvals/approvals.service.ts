import { AppError } from "../../../common/middleware/error-handler";
import {
  findAll,
  findById,
  updateStatus,
  updateApprovalCount,
  type Approval,
} from "./approvals.repository";
import type { ApprovalData } from "./approvals.schema";

const toApprovalResponse = (approval: Approval): ApprovalData => ({
  id: approval.id,
  requisitionId: approval.requisitionId,
  status: approval.status,
  requiredApprovalCount: approval.requiredApprovalCount,
  currentApprovalCount: approval.currentApprovalCount,
  approvedBy: (approval.approvedBy as string[]) || [],
  rejectedBy: approval.rejectedBy,
  rejectionReason: approval.rejectionReason,
  createdAt: approval.createdAt.toISOString(),
  updatedAt: approval.updatedAt.toISOString(),
});

export const listApprovals = async (): Promise<ApprovalData[]> => {
  const approvals = await findAll();
  return approvals.map(toApprovalResponse);
};

export const getApprovalById = async (id: string): Promise<ApprovalData> => {
  const approval = await findById(id);

  if (!approval) {
    throw new AppError("Approval not found", 404);
  }

  return toApprovalResponse(approval);
};

export const approveApproval = async (
  id: string,
  userId: string
): Promise<ApprovalData> => {
  const approval = await findById(id);

  if (!approval) {
    throw new AppError("Approval not found", 404);
  }

  if (approval.status !== "pending") {
    throw new AppError(
      `Cannot approve an approval with status: ${approval.status}`,
      409
    );
  }

  const currentApprovals = (approval.approvedBy as string[]) || [];
  const isAlreadyApproved = currentApprovals.includes(userId);

  if (isAlreadyApproved) {
    throw new AppError("User has already approved this approval", 409);
  }

  const newApprovals = [...currentApprovals, userId];
  const currentCount = parseInt(approval.currentApprovalCount, 10);
  const requiredCount = parseInt(approval.requiredApprovalCount, 10);
  const newCount = currentCount + 1;

  let newStatus = "pending";
  if (newCount >= requiredCount) {
    newStatus = "approved";
  }

  const updatedApproval = await updateApprovalCount(
    id,
    newCount.toString(),
    newApprovals
  );

  if (!updatedApproval) {
    throw new AppError("Approval not found", 404);
  }

  // If approval is now complete, update status
  if (newStatus === "approved") {
    const finalApproval = await updateStatus(id, "approved", {
      approvedBy: newApprovals,
    });

    if (!finalApproval) {
      throw new AppError("Approval not found", 404);
    }

    return toApprovalResponse(finalApproval);
  }

  return toApprovalResponse(updatedApproval);
};

export const rejectApproval = async (
  id: string,
  userId: string,
  reason?: string
): Promise<ApprovalData> => {
  const approval = await findById(id);

  if (!approval) {
    throw new AppError("Approval not found", 404);
  }

  if (approval.status !== "pending") {
    throw new AppError(
      `Cannot reject an approval with status: ${approval.status}`,
      409
    );
  }

  const updatedApproval = await updateStatus(id, "rejected", {
    rejectedBy: userId,
    rejectionReason: reason ?? null,
  });

  if (!updatedApproval) {
    throw new AppError("Approval not found", 404);
  }

  return toApprovalResponse(updatedApproval);
};
