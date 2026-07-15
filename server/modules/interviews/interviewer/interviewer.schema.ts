import { z } from 'zod';

export const createInterviewerSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  expertise: z.array(z.string()),
  availability: z.array(z.object({
    day: z.string(),
    slots: z.array(z.string()),
  })).optional(),
});

export const updateInterviewerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  expertise: z.array(z.string()).optional(),
  availability: z.array(z.object({
    day: z.string(),
    slots: z.array(z.string()),
  })).optional(),
});

export type CreateInterviewerInput = z.infer<typeof createInterviewerSchema>;
export type UpdateInterviewerInput = z.infer<typeof updateInterviewerSchema>;
