import { z } from "zod";

export const createPermissionSchema = z.object({
  name: z.string().min(1, "Permission name is required").max(100, "Permission name must be less than 100 characters"),
  resource: z.string().min(1, "Resource is required").max(100, "Resource must be less than 100 characters"),
  action: z.string().min(1, "Action is required").max(100, "Action must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

export const updatePermissionSchema = z.object({
  name: z.string().min(1, "Permission name is required").max(100, "Permission name must be less than 100 characters").optional(),
  resource: z.string().min(1, "Resource is required").max(100, "Resource must be less than 100 characters").optional(),
  action: z.string().min(1, "Action is required").max(100, "Action must be less than 100 characters").optional(),
  description: z.string().max(500, "Description must be less than 500 characters").nullable().optional(),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
