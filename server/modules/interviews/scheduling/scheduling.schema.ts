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
  googleEventId: z.string().optional(),
  invitationSent: z.boolean().optional(),
  calendarProvider: z.string().optional(),
  calendarOwnerType: z.string().optional(),
  calendarOwnerId: z.string().optional(),
});

// Combined schema for creating assignment + schedule in one call
export const createInterviewScheduleSchema = z.object({
  interviewerId: z.number(),
  candidateId: z.string(),
  role: z.string(),
  requisitionId: z.string().optional(),
  interviewId: z.string().optional(), // Optional interview ID
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  status: z.string().default('scheduled'),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type CreateInterviewScheduleInput = z.infer<typeof createInterviewScheduleSchema>;
