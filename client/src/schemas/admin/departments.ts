import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required").max(100, "Department name must be less than 100 characters"),
  code: z.string().min(1, "Department code is required").max(20, "Department code must be less than 20 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required").max(100, "Department name must be less than 100 characters").optional(),
  code: z.string().min(1, "Department code is required").max(20, "Department code must be less than 20 characters").optional(),
  description: z.string().max(500, "Description must be less than 500 characters").nullable().optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
