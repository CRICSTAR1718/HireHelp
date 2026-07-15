import { z } from 'zod'

export const CreateRequisitionSchema = z.object({
  title:                    z.string().min(1, 'Title is required').max(150),
  department:               z.string().max(100).optional(),
  team:                     z.string().max(100).optional(),
  location:                 z.string().max(100).optional(),
  employment_type:          z.string().max(50).optional(),
  work_mode:                z.string().max(50).optional(),
  number_of_openings:       z.coerce.number().int().min(1).default(1),
  about_role:               z.string().optional(),
  responsibilities:         z.string().optional(),
  required_skills:          z.string().optional(),
  preferred_skills:         z.string().optional(),
  experience_required:      z.string().max(100).optional(),
  education_requirements:   z.string().optional(),
  salary:                   z.string().max(100).optional(),
  benefits:                 z.string().optional(),
  hiring_manager_id:        z.string().uuid().optional(),
  recruiter_id:             z.string().uuid().optional(),
  hiring_priority:          z.enum(['critical', 'high', 'medium', 'low']).optional(),
  target_joining_date:      z.string().optional(),
  application_deadline:     z.string().optional(),
  internal_application_form: z.boolean().default(true),
  job_description_document: z.string().optional(),
  additional_documents:     z.any().optional(),
})

export const UpdateRequisitionSchema = CreateRequisitionSchema.partial()

export const TransitionReasonSchema = z.object({
  remarks: z.string().optional()
})

export const RejectSchema = z.object({
  rejection_reason: z.string().min(1, 'Rejection reason is required')
})

export const RequestChangesSchema = z.object({
  admin_remarks: z.string().min(1, 'Admin remarks are required')
})

export const CloseSchema = z.object({
  closed_reason: z.string().optional()
})

export const SubmitSchema = z.object({
  // No body needed for submit
}).optional()

export const UnderReviewSchema = z.object({
  // No body needed for under-review
}).optional()

export const ApproveSchema = z.object({
  // No body needed for approve
}).optional()

export const PublishSchema = z.object({
  // No body needed for publish
}).optional()
