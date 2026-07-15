import { z } from "zod";

export const approvalIdParamSchema = z.object({
  id: z.string().uuid("Invalid approval ID"),
});

export type ApprovalIdParam = z.infer<typeof approvalIdParamSchema>;

export const createApprovalSchema = z.object({
  requisitionId: z.string().min(1, "Requisition ID is required"),
  requiredApprovalCount: z.string().default("1"),
});

export type CreateApprovalInput = z.infer<typeof createApprovalSchema>;

export const approvalDecisionSchema = z.object({
  reason: z.string().optional(),
});

export type ApprovalDecisionInput = z.infer<typeof approvalDecisionSchema>;

const approvalDataSchema = z.object({
  id: z.string(),
  requisitionId: z.string(),
  status: z.string(),
  requiredApprovalCount: z.string(),
  currentApprovalCount: z.string(),
  approvedBy: z.array(z.string()),
  rejectedBy: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ApprovalData = z.infer<typeof approvalDataSchema>;

export const listApprovalsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(approvalDataSchema),
});

export type ListApprovalsResponse = z.infer<typeof listApprovalsResponseSchema>;

export const approvalResponseSchema = z.object({
  success: z.boolean(),
  data: approvalDataSchema,
});

export type ApprovalResponse = z.infer<typeof approvalResponseSchema>;

export const approvalDecisionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type ApprovalDecisionResponse = z.infer<typeof approvalDecisionResponseSchema>;
