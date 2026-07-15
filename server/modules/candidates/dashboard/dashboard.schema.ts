import { z } from 'zod';

export const dashboardStatsSchema = z.object({
  totalApplications: z.number(),
  activeApplications: z.number(),
  interviewsScheduled: z.number(),
  offersReceived: z.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
