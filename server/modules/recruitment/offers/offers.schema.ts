import { z } from 'zod'

export const CreateOfferSchema = z.object({
  requisition_id:  z.string().uuid(),
  application_id:  z.string().uuid(),
  candidate_id:    z.string().uuid(),
  title:           z.string().min(1),
  department:      z.string().optional(),
  salary_amount:   z.coerce.number().positive(),
  salary_currency: z.string().default('INR'),
  start_date:      z.string().datetime({ offset: true }),
  expires_at:      z.string().datetime({ offset: true }).optional()
})
