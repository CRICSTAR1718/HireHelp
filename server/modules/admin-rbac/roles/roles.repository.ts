import { eq } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { db } from "../../../database";
import { roles } from "../../../database/schema";

// Drizzle-inferred types
export type Role = InferSelectModel<typeof roles>;
export type NewRole = InferInsertModel<typeof roles>;

export const findAll = async (): Promise<Role[]> => {
  return db.select().from(roles);
};

export const findById = async (id: string): Promise<Role | undefined> => {
  const results = await db.select().from(roles).where(eq(roles.id, id));
  return results[0];
};

export const findByName = async (name: string): Promise<Role | undefined> => {
  const results = await db.select().from(roles).where(eq(roles.name, name));
  return results[0];
};

export const findByNames = async (names: string[]): Promise<Role[]> => {
  return db.select().from(roles).where(eq(roles.name, names[0])); // This needs to be fixed for multiple names
};

// ADDED for common/middleware/rbac.ts's requireRole() helper — small
// convenience wrapper so recruitment/interview routes doing role-name checks
// don't need to know about the Role type at all, just a string in/out.
export const getRoleNameById = async (id: string): Promise<string | undefined> => {
  const role = await findById(id);
  return role?.name;
};

export const create = async (data: NewRole): Promise<Role> => {
  const results = await db.insert(roles).values(data).returning();
  return results[0];
};

export const update = async (
  id: string,
  data: Partial<Omit<NewRole, "id">>
): Promise<Role | undefined> => {
  const results = await db
    .update(roles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(roles.id, id))
    .returning();
  return results[0];
};

export const deleteById = async (id: string): Promise<Role | undefined> => {
  const results = await db.delete(roles).where(eq(roles.id, id)).returning();
  return results[0];
};
