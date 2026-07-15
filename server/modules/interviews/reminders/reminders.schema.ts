import { z } from 'zod';

export const createReminderSchema = z.object({
  scheduleId: z.number(),
  recipientId: z.string(),
  recipientType: z.string(),
  scheduledFor: z.string().transform((str) => new Date(str)),
  status: z.string(),
});

export const updateReminderSchema = z.object({
  sentAt: z.date().optional(),
  status: z.string().optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
