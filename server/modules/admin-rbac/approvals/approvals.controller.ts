import type { Request, Response, NextFunction } from "express";

import { AppError } from "../../../common/middleware/error-handler";
import * as approvalsService from "./approvals.service";
import {
  approvalIdParamSchema,
  approvalDecisionSchema,
  type ApprovalResponse,
  type ListApprovalsResponse,
  type ApprovalDecisionResponse,
} from "./approvals.schema";

const parseApprovalIdParam = (params: Request["params"]): string => {
  const result = approvalIdParamSchema.safeParse(params);

  if (!result.success) {
    const message = result.error.errors.map((error) => error.message).join(", ");
    throw new AppError(message, 400);
  }

  return result.data.id;
};

export const listApprovals = async (
  _req: Request,
  res: Response<ListApprovalsResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const approvals = await approvalsService.listApprovals();
    res.status(200).json({ success: true, data: approvals });
  } catch (error) {
    next(error);
  }
};

export const getApprovalById = async (
  req: Request,
  res: Response<ApprovalResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseApprovalIdParam(req.params);
    const approval = await approvalsService.getApprovalById(id);
    res.status(200).json({ success: true, data: approval });
  } catch (error) {
    next(error);
  }
};

export const approveApproval = async (
  req: Request<{ id: string }, ApprovalDecisionResponse, unknown>,
  res: Response<ApprovalDecisionResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseApprovalIdParam(req.params);

    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    await approvalsService.approveApproval(id, req.user.userId);
    res.status(200).json({ success: true, message: "Approval approved successfully" });
  } catch (error) {
    next(error);
  }
};

export const rejectApproval = async (
  req: Request<{ id: string }, ApprovalDecisionResponse, { reason?: string }>,
  res: Response<ApprovalDecisionResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseApprovalIdParam(req.params);
    const result = approvalDecisionSchema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.errors.map((error) => error.message).join(", ");
      throw new AppError(message, 400);
    }

    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    await approvalsService.rejectApproval(id, req.user.userId, result.data.reason);
    res.status(200).json({ success: true, message: "Approval rejected successfully" });
  } catch (error) {
    next(error);
  }
};
