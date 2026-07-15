import { z } from 'zod';

export const createScheduleSchema = z.object({
  assignmentId: z.number(),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  status: z.string(),
});

export const updateScheduleSchema = z.object({
  startTime: z.string().transform((str) => new Date(str)).optional(),
  endTime: z.string().transform((str) => new Date(str)).optional(),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  status: z.string().optional(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
