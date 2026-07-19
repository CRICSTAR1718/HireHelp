import { z } from 'zod';

export const createAssignmentSchema = z.object({
  interviewId: z.string(),
  interviewerId: z.number(),
  candidateId: z.string(),
  role: z.string(),
  requisitionId: z.string().optional(),
});

export const updateAssignmentSchema = z.object({
  status: z.string().optional(),
  completedAt: z.coerce.date().optional(),
  cancellationReason: z.string().optional(),
  feedback: z.string().optional(),
});

// Used by POST /interviews/assignments/assign-and-schedule -- the "Flow 1"
// endpoint: HR picks an interviewer + a slot for an already-shortlisted
// candidate, and in one call we create the assignment, the schedule, the
// Google Calendar event/Meet link, and the candidate email.
export const assignAndScheduleSchema = z.object({
  interviewerId: z.number(),
  candidateId: z.string(),
  role: z.string(),
  requisitionId: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  location: z.string().optional(),
  candidateEmail: z.string().email(),
  candidateName: z.string(),
  interviewerEmail: z.string().email(),
  interviewerName: z.string(),
  jobTitle: z.string().optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type AssignAndScheduleInput = z.infer<typeof assignAndScheduleSchema>;
