import { eq } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { db } from "../../../database";
import { approvals } from "../../../database/schema";

// Drizzle-inferred types
export type Approval = InferSelectModel<typeof approvals>;
export type NewApproval = InferInsertModel<typeof approvals>;

export const findAll = async (): Promise<Approval[]> => {
  return db.select().from(approvals);
};

export const findById = async (id: string): Promise<Approval | undefined> => {
  const results = await db.select().from(approvals).where(eq(approvals.id, id));
  return results[0];
};

export const findByRequisitionId = async (requisitionId: string): Promise<Approval | undefined> => {
  const results = await db
    .select()
    .from(approvals)
    .where(eq(approvals.requisitionId, requisitionId));
  return results[0];
};

export const create = async (data: NewApproval): Promise<Approval> => {
  const results = await db.insert(approvals).values(data).returning();
  return results[0];
};

export const updateStatus = async (
  id: string,
  status: string,
  updateData: { approvedBy?: string[]; rejectedBy?: string; rejectionReason?: string | null }
): Promise<Approval | undefined> => {
  const results = await db
    .update(approvals)
    .set({
      status,
      approvedBy: updateData.approvedBy ?? [],
      rejectedBy: updateData.rejectedBy,
      rejectionReason: updateData.rejectionReason,
      updatedAt: new Date(),
    })
    .where(eq(approvals.id, id))
    .returning();
  return results[0];
};

export const updateApprovalCount = async (
  id: string,
  currentApprovalCount: string,
  approvedBy: string[]
): Promise<Approval | undefined> => {
  const results = await db
    .update(approvals)
    .set({
      currentApprovalCount,
      approvedBy,
      updatedAt: new Date(),
    })
    .where(eq(approvals.id, id))
    .returning();
  return results[0];
};
