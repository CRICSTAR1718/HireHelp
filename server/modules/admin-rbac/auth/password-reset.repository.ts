import { eq, and, gt } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import crypto from "crypto";

import { db } from "../../../database";
import { passwordResetTokens } from "../../../database/schema";

export type PasswordResetToken = InferSelectModel<typeof passwordResetTokens>;
export type NewPasswordResetToken = InferInsertModel<typeof passwordResetTokens>;

export const findById = async (id: string): Promise<PasswordResetToken | undefined> => {
  const results = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.id, id));
  return results[0];
};

export const findByTokenHash = async (
  tokenHash: string
): Promise<PasswordResetToken | undefined> => {
  const results = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.tokenHash, tokenHash));
  return results[0];
};

export const findValidByTokenHash = async (
  tokenHash: string
): Promise<PasswordResetToken | undefined> => {
  const results = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        eq(passwordResetTokens.isUsed, false),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    );
  return results[0];
};

export const create = async (data: NewPasswordResetToken): Promise<PasswordResetToken> => {
  const results = await db.insert(passwordResetTokens).values(data).returning();
  return results[0];
};

export const markAsUsed = async (id: string): Promise<PasswordResetToken | undefined> => {
  const results = await db
    .update(passwordResetTokens)
    .set({
      isUsed: true,
      usedAt: new Date(),
    })
    .where(eq(passwordResetTokens.id, id))
    .returning();
  return results[0];
};

export const invalidateByUserId = async (userId: string): Promise<PasswordResetToken[]> => {
  const results = await db
    .update(passwordResetTokens)
    .set({
      isUsed: true,
      usedAt: new Date(),
    })
    .where(
      and(
        eq(passwordResetTokens.userId, userId),
        eq(passwordResetTokens.isUsed, false)
      )
    )
    .returning();
  return results;
};

export const deleteExpired = async (): Promise<void> => {
  await db
    .delete(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.isUsed, true),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    );
};

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
