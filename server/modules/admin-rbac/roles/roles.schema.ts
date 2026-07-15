import { z } from "zod";

const roleNameSchema = z
  .string()
  .trim()
  .min(2, "Role name must be at least 2 characters")
  .max(100, "Role name must be at most 100 characters");

const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description must be at most 500 characters")
  .nullable()
  .optional();

export const roleParamsSchema = z.object({
  id: z.string().uuid("Invalid role ID"),
});

export type RoleParamsInput = z.infer<typeof roleParamsSchema>;

export const createRoleSchema = z.object({
  name: roleNameSchema,
  description: descriptionSchema,
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z
  .object({
    name: roleNameSchema.optional(),
    description: descriptionSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

// role <-> permission assignment
export const assignPermissionSchema = z.object({
  permissionId: z.string().uuid("Invalid permission ID"),
});

export type AssignPermissionInput = z.infer<typeof assignPermissionSchema>;
