import { db } from '../../../database'
import {
  requisition_approvals,
  screening_rulebooks,
  rulebook_criteria
} from '../../../database/schema'
import { eq } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

type CriterionType = InferSelectModel<typeof rulebook_criteria>['criterion_type']

// ─── Requisition Approvals ──────────────────────────────────────────────────────

export async function findApprovals(requisitionId: string) {
  return db.select()
    .from(requisition_approvals)
    .where(eq(requisition_approvals.requisition_id, requisitionId))
}

export async function insertApproval(requisitionId: string, approverId: string, role: string) {
  const [a] = await db.insert(requisition_approvals).values({
    requisition_id: requisitionId,
    approver_id: approverId,
    approver_role: role,
    status: 'pending'
  }).returning()
  return a
}

export async function updateApproval(approvalId: string, status: 'approved' | 'rejected') {
  const [a] = await db.update(requisition_approvals)
    .set({ status, decided_at: new Date() })
    .where(eq(requisition_approvals.id, approvalId))
    .returning()
  return a ?? null
}

// ─── Rulebooks ─────────────────────────────────────────────────────────────────

export async function findRulebooks(requisitionId: string) {
  const rulebooks = await db.select()
    .from(screening_rulebooks)
    .where(eq(screening_rulebooks.requisition_id, requisitionId))

  return Promise.all(rulebooks.map(async (rb) => {
    const criteria = await db.select()
      .from(rulebook_criteria)
      .where(eq(rulebook_criteria.rulebook_id, rb.id))
    return { ...rb, criteria }
  }))
}

export async function insertRulebook(requisitionId: string, definedBy: string) {
  const [rb] = await db.insert(screening_rulebooks).values({
    requisition_id: requisitionId,
    defined_by: definedBy
  }).returning()
  return rb
}

export async function insertCriteria(rulebookId: string, criteria: { criterion_type: CriterionType; weight_pct: number | string }[]) {
  return db.insert(rulebook_criteria).values(
    criteria.map(c => ({
      rulebook_id: rulebookId,
      criterion_type: c.criterion_type,
      weight_pct: c.weight_pct.toString()
    }))
  ).returning()
}

export async function deleteRulebook(rulebookId: string) {
  const [deleted] = await db.delete(screening_rulebooks)
    .where(eq(screening_rulebooks.id, rulebookId))
    .returning()
  return deleted ?? null
}
