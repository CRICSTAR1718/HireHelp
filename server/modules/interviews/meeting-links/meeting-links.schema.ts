import { z } from 'zod';

export const createMeetingLinkSchema = z.object({
  scheduleId: z.number(),
  platform: z.string(),
  link: z.string().url(),
  expiresAt: z.date().optional(),
});

export type CreateMeetingLinkInput = z.infer<typeof createMeetingLinkSchema>;
