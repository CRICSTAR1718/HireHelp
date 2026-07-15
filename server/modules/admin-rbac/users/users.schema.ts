import { z } from "zod";

export const userParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export type UserParamsInput = z.infer<typeof userParamsSchema>;

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1).max(150),
  lastName: z.string().trim().min(1).max(150),
  email: z.string().trim().email("Invalid email").max(320),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  phone: z.string().trim().max(50).nullable().optional(),
  roleId: z.string().uuid("Invalid role ID"),
  departmentId: z.string().uuid("Invalid department ID").nullable().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    firstName: z.string().trim().min(1).max(150).optional(),
    lastName: z.string().trim().min(1).max(150).optional(),
    phone: z.string().trim().max(50).nullable().optional(),
    roleId: z.string().uuid("Invalid role ID").optional(),
    departmentId: z.string().uuid("Invalid department ID").nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Separate from updateUserSchema on purpose — password changes should go
// through a dedicated endpoint (and could later require re-auth/old-password
// confirmation), not slip through as a side effect of a general PATCH.
export const changeUserPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export type ChangeUserPasswordInput = z.infer<typeof changeUserPasswordSchema>;
