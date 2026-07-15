import { AppError } from "../../../common/middleware/error-handler";
import {
  create,
  deleteById,
  findAll,
  findById,
  update,
  type Permission,
} from "./permissions.repository";
import type { CreatePermissionInput, UpdatePermissionInput } from "./permissions.schema";

export type PermissionData = {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
};

const toPermissionResponse = (permission: Permission): PermissionData => ({
  id: permission.id,
  name: permission.name,
  resource: permission.resource,
  action: permission.action,
  description: permission.description,
});

const ensureNameAvailable = async (name: string, currentId?: string): Promise<void> => {
  const all = await findAll();
  const duplicate = all.find(
    (p) => p.id !== currentId && p.name.toLowerCase() === name.toLowerCase()
  );
  if (duplicate) {
    throw new AppError("Permission name already in use", 409);
  }
};

export const listPermissions = async (): Promise<PermissionData[]> => {
  const permissions = await findAll();
  return permissions.map(toPermissionResponse);
};

export const getPermissionById = async (id: string): Promise<PermissionData> => {
  const permission = await findById(id);
  if (!permission) {
    throw new AppError("Permission not found", 404);
  }
  return toPermissionResponse(permission);
};

export const createPermission = async (input: CreatePermissionInput): Promise<PermissionData> => {
  await ensureNameAvailable(input.name);

  const permission = await create({
    name: input.name,
    resource: input.resource,
    action: input.action,
    description: input.description ?? null,
  });

  return toPermissionResponse(permission);
};

export const updatePermission = async (
  id: string,
  input: UpdatePermissionInput
): Promise<PermissionData> => {
  const permission = await findById(id);
  if (!permission) {
    throw new AppError("Permission not found", 404);
  }

  if (input.name !== undefined && input.name.toLowerCase() !== permission.name.toLowerCase()) {
    await ensureNameAvailable(input.name, id);
  }

  const updated = await update(id, {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.resource !== undefined ? { resource: input.resource } : {}),
    ...(input.action !== undefined ? { action: input.action } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
  });

  if (!updated) {
    throw new AppError("Permission not found", 404);
  }

  return toPermissionResponse(updated);
};

export const deletePermission = async (id: string): Promise<{ message: string }> => {
  const permission = await findById(id);
  if (!permission) {
    throw new AppError("Permission not found", 404);
  }

  await deleteById(id);
  return { message: "Permission deleted successfully" };
};
