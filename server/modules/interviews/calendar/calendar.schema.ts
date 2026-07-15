import { z } from 'zod';

export const createCalendarIntegrationSchema = z.object({
  interviewerId: z.number(),
  provider: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  calendarId: z.string().optional(),
  syncEnabled: z.boolean().default(true),
});

export const updateCalendarIntegrationSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  calendarId: z.string().optional(),
  syncEnabled: z.boolean().optional(),
  lastSyncedAt: z.date().optional(),
});

export type CreateCalendarIntegrationInput = z.infer<typeof createCalendarIntegrationSchema>;
export type UpdateCalendarIntegrationInput = z.infer<typeof updateCalendarIntegrationSchema>;
