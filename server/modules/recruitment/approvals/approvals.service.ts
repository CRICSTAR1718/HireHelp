import * as repo from './approvals.repository'

// ─── Requisition Approvals ──────────────────────────────────────────────────────

export async function getApprovals(requisitionId: string) {
  return repo.findApprovals(requisitionId)
}

export async function createApproval(requisitionId: string, approverId: string, approverRole: string) {
  return repo.insertApproval(requisitionId, approverId, approverRole)
}

export async function decideApproval(approvalId: string, status: 'approved' | 'rejected') {
  const updated = await repo.updateApproval(approvalId, status)
  if (!updated) throw Object.assign(new Error('Approval not found'), { statusCode: 404 })
  return updated
}

// ─── Rulebooks ─────────────────────────────────────────────────────────────────

export async function getRulebooks(requisitionId: string) {
  return repo.findRulebooks(requisitionId)
}

export async function createRulebook(requisitionId: string, definedBy: string, criteria: any[]) {
  const total = criteria.reduce((sum, c) => sum + Number(c.weight_pct), 0)
  if (Math.abs(total - 100) > 0.001) {
    throw Object.assign(new Error(`Criteria weights must sum to 100. Current total: ${total}`), { statusCode: 400 })
  }

  const rulebook = await repo.insertRulebook(requisitionId, definedBy)
  const insertedCriteria = await repo.insertCriteria(rulebook.id, criteria)

  return { ...rulebook, criteria: insertedCriteria }
}

export async function deleteRulebook(rulebookId: string) {
  const deleted = await repo.deleteRulebook(rulebookId)
  if (!deleted) throw Object.assign(new Error('Rulebook not found'), { statusCode: 404 })
  return { message: 'Rulebook deleted (criteria cascade deleted)' }
}
