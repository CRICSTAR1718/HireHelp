import { z } from 'zod';

export const applyJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  coverLetter: z.string().optional(),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;
