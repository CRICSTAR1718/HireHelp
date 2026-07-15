import { z } from 'zod'

export const UpdateStatusSchema = z.object({
  status: z.enum(['submitted', 'under_review', 'shortlisted', 'rejected', 'hired'])
})
