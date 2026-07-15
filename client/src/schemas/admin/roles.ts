import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(100, "Role name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(100, "Role name must be less than 100 characters").optional(),
  description: z.string().max(500, "Description must be less than 500 characters").nullable().optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
