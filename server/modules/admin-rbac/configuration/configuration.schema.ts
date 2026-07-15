import { z } from "zod";

export const updateConfigurationSchema = z.object({
  key: z.string().trim().min(1, "Configuration key is required").max(200),
  value: z.string().min(1, "Configuration value is required"),
  description: z.string().trim().max(500).nullable().optional(),
});
export type UpdateConfigurationInput = z.infer<typeof updateConfigurationSchema>;