import { AppError } from "../../../common/middleware/error-handler";
import {
  create,
  deleteById,
  findAll,
  findById,
  findByName,
  update,
  type Role,
} from "./roles.repository";
import {
  findById as findPermissionById,
  findPermissionsByRoleId,
  assignPermissionToRole,
  removePermissionFromRole,
  type Permission,
} from "../permissions/permissions.repository";
import type { CreateRoleInput, UpdateRoleInput } from "./roles.schema";

export type RoleData = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PermissionData = {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
};

const toRoleResponse = (role: Role): RoleData => ({
  id: role.id,
  name: role.name,
  description: role.description,
  createdAt: role.createdAt.toISOString(),
  updatedAt: role.updatedAt.toISOString(),
});

const toPermissionResponse = (permission: Permission): PermissionData => ({
  id: permission.id,
  name: permission.name,
  resource: permission.resource,
  action: permission.action,
  description: permission.description,
});

const ensureNameAvailable = async (name: string, currentId?: string): Promise<void> => {
  const existing = await findByName(name);
  if (existing && existing.id !== currentId) {
    throw new AppError("Role name already in use", 409);
  }
};

export const listRoles = async (): Promise<RoleData[]> => {
  const roles = await findAll();
  return roles.map(toRoleResponse);
};

export const getRoleById = async (id: string): Promise<RoleData> => {
  const role = await findById(id);
  if (!role) {
    throw new AppError("Role not found", 404);
  }
  return toRoleResponse(role);
};

export const createRole = async (input: CreateRoleInput): Promise<RoleData> => {
  await ensureNameAvailable(input.name);

  const role = await create({
    name: input.name,
    description: input.description ?? null,
  });

  return toRoleResponse(role);
};

export const updateRole = async (id: string, input: UpdateRoleInput): Promise<RoleData> => {
  const role = await findById(id);
  if (!role) {
    throw new AppError("Role not found", 404);
  }

  if (input.name !== undefined && input.name.toLowerCase() !== role.name.toLowerCase()) {
    await ensureNameAvailable(input.name, id);
  }

  const updatedRole = await update(id, {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
  });

  if (!updatedRole) {
    throw new AppError("Role not found", 404);
  }

  return toRoleResponse(updatedRole);
};

// Deliberately does NOT allow deleting admin/hr/interviewer — those are
// referenced directly by name in requireRole() calls across recruitment and
// interview routes. Deleting them would silently break auth on those routes
// rather than erroring, which is a worse failure mode than a 409 here.
const PROTECTED_ROLE_NAMES = ["admin", "hr", "interviewer"];

export const deleteRole = async (id: string): Promise<{ message: string }> => {
  const role = await findById(id);
  if (!role) {
    throw new AppError("Role not found", 404);
  }

  if (PROTECTED_ROLE_NAMES.includes(role.name)) {
    throw new AppError(
      `Cannot delete built-in role "${role.name}" — it's referenced directly by route guards`,
      409
    );
  }

  await deleteById(id);
  return { message: "Role deleted successfully" };
};

export const listRolePermissions = async (roleId: string): Promise<PermissionData[]> => {
  const role = await findById(roleId);
  if (!role) {
    throw new AppError("Role not found", 404);
  }

  const permissions = await findPermissionsByRoleId(roleId);
  return permissions.map(toPermissionResponse);
};

export const assignPermission = async (
  roleId: string,
  permissionId: string
): Promise<{ message: string }> => {
  const role = await findById(roleId);
  if (!role) {
    throw new AppError("Role not found", 404);
  }

  const permission = await findPermissionById(permissionId);
  if (!permission) {
    throw new AppError("Permission not found", 404);
  }

  await assignPermissionToRole({ roleId, permissionId });
  return { message: "Permission assigned to role" };
};

export const revokePermission = async (
  roleId: string,
  permissionId: string
): Promise<{ message: string }> => {
  const role = await findById(roleId);
  if (!role) {
    throw new AppError("Role not found", 404);
  }

  await removePermissionFromRole(roleId, permissionId);
  return { message: "Permission revoked from role" };
};
