import { z } from 'zod'

export const CreateApprovalSchema = z.object({
  approver_role: z.string().optional()
})

export const DecideApprovalSchema = z.object({
  status: z.enum(['approved', 'rejected'])
})

export const CreateRulebookSchema = z.object({
  criteria: z.array(z.object({
    criterion_type: z.enum(['skills', 'experience', 'education', 'profile_fit']),
    weight_pct: z.union([z.number(), z.string()]).transform(val => Number(val))
  })).min(1, 'At least one criterion is required')
})
