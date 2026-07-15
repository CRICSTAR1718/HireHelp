import { z } from 'zod';

export const createFeedbackSchema = z.object({
  assignmentId: z.number(),
  interviewerId: z.number(),
  ratings: z.array(z.object({
    competency: z.string(),
    score: z.number(),
    comment: z.string().optional(),
  })),
  overallScore: z.number(),
  recommendation: z.string(),
  notes: z.string().optional(),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
