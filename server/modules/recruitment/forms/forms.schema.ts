import { z } from 'zod'

const FIELD_TYPES = [
  'text', 'textarea', 'dropdown', 'file', 'checkbox',
  'date', 'number', 'url', 'multi_select', 'rating', 'yes_no'
] as const

export const AddFieldSchema = z.object({
  label:       z.string().min(1, 'Label is required'),
  field_type:  z.enum(FIELD_TYPES),
  is_required: z.boolean().optional(),
  placeholder: z.string().optional().nullable(),
  helper_text: z.string().optional().nullable(),
  max_rating:  z.coerce.number().int().min(1).max(10).optional(),
  options:     z.array(z.object({ label: z.string().min(1) })).optional()
})

export const UpdateFieldSchema = AddFieldSchema.partial()

export const ReorderSchema = z.object({
  order: z.array(z.object({
    id:       z.string().uuid(),
    position: z.coerce.number().int().min(1)
  }))
})

export const SaveTemplateSchema = z.object({
  label:       z.string().min(1, 'Label is required'),
  field_type:  z.enum(FIELD_TYPES),
  is_required: z.boolean().optional(),
  placeholder: z.string().optional().nullable(),
  helper_text: z.string().optional().nullable(),
  max_rating:  z.coerce.number().int().min(1).max(10).optional(),
  options:     z.any().optional()
})

export const FormApprovalRemarksSchema = z.object({
  remarks: z.string().min(1, 'Remarks are required')
})

export const PublishFormSchema = z.object({
  // No body needed for publish, but schema for consistency
}).optional()
