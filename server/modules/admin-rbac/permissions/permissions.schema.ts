import { z } from "zod";

export const permissionParamsSchema = z.object({
  id: z.string().uuid("Invalid permission ID"),
});

export type PermissionParamsInput = z.infer<typeof permissionParamsSchema>;

export const createPermissionSchema = z.object({
  name: z.string().trim().min(2).max(150),
  resource: z.string().trim().min(1).max(200),
  action: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).nullable().optional(),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;

export const updatePermissionSchema = z
  .object({
    name: z.string().trim().min(2).max(150).optional(),
    resource: z.string().trim().min(1).max(200).optional(),
    action: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
