import { eq, desc } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { db } from "../../../database";
import { auditLogs, users } from "../../../database/schema";

// Drizzle-inferred types
export type AuditLog = InferSelectModel<typeof auditLogs>;
export type NewAuditLog = InferInsertModel<typeof auditLogs>;

// Extended type with user information
export type AuditLogWithUser = AuditLog & {
  userName?: string | null;
  userEmail?: string | null;
};

// Append-only: insert only, no update or hard-delete

export const create = async (data: NewAuditLog): Promise<AuditLog> => {
  const results = await db.insert(auditLogs).values(data).returning();
  return results[0];
};


export const findAll = async (params: {
  limit: number;
  offset: number;
}): Promise<AuditLogWithUser[]> => {
  return db
    .select({
      id: auditLogs.id,
      userId: auditLogs.userId,
      action: auditLogs.action,
      resource: auditLogs.resource,
      metadata: auditLogs.metadata,
      ipAddress: auditLogs.ipAddress,
      createdAt: auditLogs.createdAt,
      userName: users.firstName,
      userEmail: users.email,
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(params.limit)
    .offset(params.offset);
};

export const findById = async (id: string): Promise<AuditLog | undefined> => {
  const results = await db.select().from(auditLogs).where(eq(auditLogs.id, id));
  return results[0];
};

export const findByUserId = async (
  userId: string,
  params: { limit: number; offset: number }
): Promise<AuditLog[]> => {
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.userId, userId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(params.limit)
    .offset(params.offset);
};

export const findByAction = async (
  action: string,
  params: { limit: number; offset: number }
): Promise<AuditLog[]> => {
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.action, action))
    .orderBy(desc(auditLogs.createdAt))
    .limit(params.limit)
    .offset(params.offset);
};

export const findByResource = async (
  resource: string,
  params: { limit: number; offset: number }
): Promise<AuditLog[]> => {
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.resource, resource))
    .orderBy(desc(auditLogs.createdAt))
    .limit(params.limit)
    .offset(params.offset);
};
