import { z } from "zod";

export const healthResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  service: z.string(),
  version: z.string(),
  timestamp: z.string()
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

