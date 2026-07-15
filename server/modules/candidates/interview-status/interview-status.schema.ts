import { z } from 'zod';

export const updateInterviewStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  notes: z.string().optional(),
});

export type UpdateInterviewStatusInput = z.infer<typeof updateInterviewStatusSchema>;
