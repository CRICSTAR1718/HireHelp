import { z } from "zod";

const departmentNameSchema = z
  .string()
  .trim()
  .min(2, "Department name must be at least 2 characters")
  .max(200, "Department name must be at most 200 characters");

const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description must be at most 500 characters")
  .nullable()
  .optional();

const optionalUuidSchema = z.string().uuid("Invalid ID").nullable().optional();

export const departmentParamsSchema = z.object({
  id: z.string().uuid("Invalid department ID"),
});

export type DepartmentParamsInput = z.infer<typeof departmentParamsSchema>;

export const createDepartmentSchema = z.object({
  name: departmentNameSchema,
  description: descriptionSchema,
  parentDepartmentId: optionalUuidSchema,
  headUserId: optionalUuidSchema,
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = z
  .object({
    name: departmentNameSchema.optional(),
    description: descriptionSchema,
    parentDepartmentId: optionalUuidSchema,
    headUserId: optionalUuidSchema,
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;