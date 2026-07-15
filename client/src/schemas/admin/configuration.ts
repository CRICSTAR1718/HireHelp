import { z } from "zod";

export const updateConfigurationSchema = z.object({
  key: z.string().min(1, "Configuration key is required"),
  value: z.string().min(1, "Configuration value is required"),
});

export type UpdateConfigurationInput = z.infer<typeof updateConfigurationSchema>;
