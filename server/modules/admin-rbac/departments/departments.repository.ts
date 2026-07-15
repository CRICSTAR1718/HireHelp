import { eq } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { db } from "../../../database";
import { departments } from "../../../database/schema";

// Drizzle-inferred types
export type Department = InferSelectModel<typeof departments>;
export type NewDepartment = InferInsertModel<typeof departments>;

export const findAll = async (): Promise<Department[]> => {
  return db.select().from(departments);
};

export const findById = async (id: string): Promise<Department | undefined> => {
  const results = await db.select().from(departments).where(eq(departments.id, id));
  return results[0];
};

export const findByParentId = async (parentId: string): Promise<Department[]> => {
  return db
    .select()
    .from(departments)
    .where(eq(departments.parentDepartmentId, parentId));
};

export const create = async (data: NewDepartment): Promise<Department> => {
  const results = await db.insert(departments).values(data).returning();
  return results[0];
};

export const update = async (
  id: string,
  data: Partial<Omit<NewDepartment, "id">>
): Promise<Department | undefined> => {
  const results = await db
    .update(departments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(departments.id, id))
    .returning();
  return results[0];
};

// Soft-delete: sets isActive = false
export const deleteById = async (id: string): Promise<Department | undefined> => {
  const results = await db
    .update(departments)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(departments.id, id))
    .returning();
  return results[0];
};
