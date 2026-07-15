import { eq } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { db } from "../../../database";
import { configuration } from "../../../database/schema";

// Drizzle-inferred types
export type Configuration = InferSelectModel<typeof configuration>;
export type NewConfiguration = InferInsertModel<typeof configuration>;

export const findAll = async (): Promise<Configuration[]> => {
  return db.select().from(configuration);
};

export const findByKey = async (key: string): Promise<Configuration | undefined> => {
  const results = await db
    .select()
    .from(configuration)
    .where(eq(configuration.key, key));
  return results[0];
};

export const upsertByKey = async (data: {
  key: string;
  value: string;
  description?: string | null;
  updatedBy?: string | null;
}): Promise<Configuration> => {
  const results = await db
    .insert(configuration)
    .values(data)
    .onConflictDoUpdate({
      target: configuration.key,
      set: {
        value: data.value,
        description: data.description,
        updatedBy: data.updatedBy,
        updatedAt: new Date(),
      },
    })
    .returning();
  return results[0];
};

export const deleteByKey = async (key: string): Promise<Configuration | undefined> => {
  const results = await db
    .delete(configuration)
    .where(eq(configuration.key, key))
    .returning();
  return results[0];
};
