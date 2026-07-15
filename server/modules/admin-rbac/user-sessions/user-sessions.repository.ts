import { eq, and, gt } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { db } from "../../../database";
import { userSessions } from "../../../database/schema";

export type UserSession = InferSelectModel<typeof userSessions>;
export type NewUserSession = InferInsertModel<typeof userSessions>;

export const findById = async (id: string): Promise<UserSession | undefined> => {
  const results = await db.select().from(userSessions).where(eq(userSessions.id, id));
  return results[0];
};

export const findByRefreshTokenHash = async (
  refreshTokenHash: string
): Promise<UserSession | undefined> => {
  const results = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.refreshTokenHash, refreshTokenHash));
  return results[0];
};

export const findActiveByUserId = async (userId: string): Promise<UserSession[]> => {
  return db
    .select()
    .from(userSessions)
    .where(
      and(
        eq(userSessions.userId, userId),
        eq(userSessions.isRevoked, false),
        gt(userSessions.expiresAt, new Date())
      )
    );
};

export const create = async (data: NewUserSession): Promise<UserSession> => {
  const results = await db.insert(userSessions).values(data).returning();
  return results[0];
};

export const update = async (
  id: string,
  data: Partial<Omit<NewUserSession, "id">>
): Promise<UserSession | undefined> => {
  const results = await db
    .update(userSessions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(userSessions.id, id))
    .returning();
  return results[0];
};

export const revoke = async (
  id: string,
  reason: string = "logout"
): Promise<UserSession | undefined> => {
  const results = await db
    .update(userSessions)
    .set({
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(userSessions.id, id))
    .returning();
  return results[0];
};

export const revokeAllByUserId = async (
  userId: string,
  reason: string = "security"
): Promise<UserSession[]> => {
  const results = await db
    .update(userSessions)
    .set({
      isRevoked: true,
      revokedAt: new Date(),
      revokedReason: reason,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userSessions.userId, userId),
        eq(userSessions.isRevoked, false)
      )
    )
    .returning();
  return results;
};

export const deleteExpired = async (): Promise<void> => {
  await db
    .delete(userSessions)
    .where(
      and(
        eq(userSessions.isRevoked, true),
        gt(userSessions.expiresAt, new Date())
      )
    );
};
