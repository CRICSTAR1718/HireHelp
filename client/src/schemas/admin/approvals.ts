import { z } from "zod";

export const approvalDecisionSchema = z.object({
  comments: z.string().max(500, "Comments must be less than 500 characters").optional(),
});

export type ApprovalDecisionInput = z.infer<typeof approvalDecisionSchema>;
