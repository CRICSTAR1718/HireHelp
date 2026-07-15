import { z } from 'zod';

export const createAssignmentSchema = z.object({
  interviewId: z.string(),
  interviewerId: z.number(),
  candidateId: z.string(),
  role: z.string(),
});

export const updateAssignmentSchema = z.object({
  status: z.string(),
  completedAt: z.date().optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
