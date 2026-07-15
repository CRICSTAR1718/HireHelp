import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  phone: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
  departmentId: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  firstName: z.string().min(1, "First name is required").max(100, "First name must be less than 100 characters").optional(),
  lastName: z.string().min(1, "Last name is required").max(100, "Last name must be less than 100 characters").optional(),
  phone: z.string().nullable().optional(),
  roleId: z.string().min(1, "Role is required").optional(),
  departmentId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
