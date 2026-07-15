import { z } from 'zod'

// Assuming we need a schema for feedback endpoints
export const CreateFeedbackSchema = z.object({
  application_id: z.string().uuid(),
  requisition_id: z.string().uuid(),
  interview_round: z.string().min(1, 'Interview round is required'),
  overall_rating: z.number().int().min(1).max(5),
  recommendation: z.enum(['strong_hire', 'hire', 'no_hire', 'strong_no_hire']),
  details: z.any()
})
