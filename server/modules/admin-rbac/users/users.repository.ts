import { eq } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { db } from "../../../database";
import { users } from "../../../database/schema";

// Drizzle-inferred types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const findAll = async (): Promise<User[]> => {
  return db.select().from(users);
};

export const findById = async (id: string): Promise<User | undefined> => {
  const results = await db.select().from(users).where(eq(users.id, id));
  return results[0];
};

export const findByEmail = async (email: string): Promise<User | undefined> => {
  const results = await db.select().from(users).where(eq(users.email, email));
  return results[0];
};

export const create = async (data: NewUser): Promise<User> => {
  const results = await db.insert(users).values(data).returning();
  return results[0];
};

export const update = async (
  id: string,
  data: Partial<Omit<NewUser, "id">>
): Promise<User | undefined> => {
  const results = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return results[0];
};

// Soft-delete: sets isActive = false
export const deleteById = async (id: string): Promise<User | undefined> => {
  const results = await db
    .update(users)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return results[0];
};

export const updateLastLogin = async (id: string): Promise<User | undefined> => {
  const results = await db
    .update(users)
    .set({ lastLogin: new Date(), updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return results[0];
};
