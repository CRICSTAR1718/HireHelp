import { z } from 'zod'

export const MoveEntrySchema = z.object({
  stage_id: z.string().uuid('stage_id must be a valid UUID')
})

export const ShortlistSchema = z.object({
  recruiter_notes: z.string().optional()
})

export const RejectEntrySchema = z.object({
  recruiter_notes: z.string().optional()
})

export const UpdateNotesSchema = z.object({
  recruiter_notes: z.string()
})
