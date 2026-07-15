import { eq, and, exists } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { db } from "../../../database";
import { permissions, rolePermissions } from "../../../database/schema";

// Drizzle-inferred types
export type Permission = InferSelectModel<typeof permissions>;
export type NewPermission = InferInsertModel<typeof permissions>;
export type RolePermission = InferSelectModel<typeof rolePermissions>;
export type NewRolePermission = InferInsertModel<typeof rolePermissions>;

// ── Permissions CRUD ──

export const findAll = async (): Promise<Permission[]> => {
  return db.select().from(permissions);
};

export const findById = async (id: string): Promise<Permission | undefined> => {
  const results = await db.select().from(permissions).where(eq(permissions.id, id));
  return results[0];
};

export const findByResourceAction = async (
  resource: string,
  action: string
): Promise<Permission | undefined> => {
  const results = await db
    .select()
    .from(permissions)
    .where(and(eq(permissions.resource, resource), eq(permissions.action, action)));
  return results[0];
};

export const create = async (data: NewPermission): Promise<Permission> => {
  const results = await db.insert(permissions).values(data).returning();
  return results[0];
};

export const update = async (
  id: string,
  data: Partial<Omit<NewPermission, "id">>
): Promise<Permission | undefined> => {
  const results = await db
    .update(permissions)
    .set(data)
    .where(eq(permissions.id, id))
    .returning();
  return results[0];
};

export const deleteById = async (id: string): Promise<Permission | undefined> => {
  const results = await db.delete(permissions).where(eq(permissions.id, id)).returning();
  return results[0];
};

// ── Role–Permission assignments ──

export const findPermissionsByRoleId = async (roleId: string): Promise<Permission[]> => {
  const results = await db
    .select({
      id: permissions.id,
      name: permissions.name,
      resource: permissions.resource,
      action: permissions.action,
      description: permissions.description,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));
  return results;
};

export const assignPermissionToRole = async (
  data: NewRolePermission
): Promise<RolePermission> => {
  const results = await db.insert(rolePermissions).values(data).returning();
  return results[0];
};

export const removePermissionFromRole = async (
  roleId: string,
  permissionId: string
): Promise<RolePermission | undefined> => {
  const results = await db
    .delete(rolePermissions)
    .where(
      and(
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      )
    )
    .returning();
  return results[0];
};

export const removeAllPermissionsFromRole = async (
  roleId: string
): Promise<RolePermission[]> => {
  return db
    .delete(rolePermissions)
    .where(eq(rolePermissions.roleId, roleId))
    .returning();
};

// ── Authorization ──

const parseCanonicalPermission = (
  permission: string
): { resource: string; action: string } | null => {
  const colonIndex = permission.indexOf(":");

  if (colonIndex <= 0 || colonIndex === permission.length - 1) {
    return null;
  }

  return {
    resource: permission.slice(0, colonIndex),
    action: permission.slice(colonIndex + 1),
  };
};

export const hasPermission = async (
  roleId: string,
  permission: string
): Promise<boolean> => {
  const parsed = parseCanonicalPermission(permission);

  if (!parsed) {
    return false;
  }

  const { resource, action } = parsed;

  const [row] = await db
    .select({ roleId: rolePermissions.roleId })
    .from(rolePermissions)
    .where(
      and(
        eq(rolePermissions.roleId, roleId),
        exists(
          db
            .select({ id: permissions.id })
            .from(permissions)
            .where(
              and(
                eq(permissions.id, rolePermissions.permissionId),
                eq(permissions.resource, resource),
                eq(permissions.action, action)
              )
            )
        )
      )
    )
    .limit(1);

  return row !== undefined;
};
