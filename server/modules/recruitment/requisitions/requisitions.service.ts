import * as repo from './requisitions.repository'
import { publishEvent } from '../../../events/bus'
import { notifyTalentPool } from '../talent-pool/talent-pool.service'

type ReqStatus = 'draft' | 'submitted' | 'under_review' | 'needs_changes' | 'approved' | 'rejected' | 'published' | 'closed'

const ALLOWED_TRANSITIONS: Record<ReqStatus, ReqStatus[]> = {
  draft:         ['submitted'],
  submitted:     ['under_review', 'approved', 'needs_changes', 'rejected'],
  under_review:  ['approved', 'needs_changes', 'rejected'],
  needs_changes: ['submitted'],
  approved:      ['published'],
  rejected:      ['draft'],  // allow re-draft after rejection
  published:     ['closed'],
  closed:        []
}

function assertTransition(from: ReqStatus, to: ReqStatus) {
  if (!ALLOWED_TRANSITIONS[from]?.includes(to)) {
    throw Object.assign(
      new Error(`Cannot transition from '${from}' to '${to}'`),
      { statusCode: 400 }
    )
  }
}

export async function getAll() {
  return repo.findAll()
}

export async function getOne(id: string) {
  const req = await repo.findOne(id)
  if (!req) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  return req
}

export async function createRequisition(
  body: Parameters<typeof repo.create>[0],
  userId: string,
  userRole: string
) {
  const initialStatus: ReqStatus = userRole === 'admin' ? 'approved' : 'draft'
  const row = await repo.create({
    ...body,
    created_by: userId,
    status: initialStatus,
    published_at: userRole === 'admin' ? new Date() : null
  })

  if (userRole === 'admin') {
    await repo.logTransition(row.id, null, 'approved', userId, 'Auto-approved (created by admin)')
  }
  return row
}

export async function updateRequisition(id: string, body: Record<string, unknown>) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  if (current.status !== 'draft' && current.status !== 'needs_changes') {
    throw Object.assign(
      new Error('Can only edit draft or needs_changes requisitions'),
      { statusCode: 400 }
    )
  }
  return repo.update(id, body)
}

// Backwards-compatible helper used by tests.
// Transitions requisition workflow and records a status log.
export async function updateRequisitionStatus(id: string, toStatus: ReqStatus, changedBy: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })

  assertTransition(current.status as ReqStatus, toStatus)

  const row = await repo.transition(id, toStatus, changedBy)
  return row
}


export async function submit(id: string, userId: string, userRole: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  assertTransition(current.status as ReqStatus, 'submitted')

  if (userRole === 'hr') {
    const form = await repo.getFormForRequisition(id)
    if (!form) {
      throw Object.assign(
        new Error('Please create an application form before submitting the requisition'),
        { statusCode: 400 }
      )
    }
  }

  // Preserve an existing memo number on resubmission; only generate one
  // the first time a requisition moves into submitted.
  const memoNo = current.memo_no ?? await repo.generateMemoNo()

  const [row] = await Promise.all([
    repo.update(id, { status: 'submitted', memo_no: memoNo })
  ])
  await repo.logTransition(id, current.status as ReqStatus, 'submitted', userId)
  return row
}

export async function markUnderReview(id: string, userId: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  assertTransition(current.status as ReqStatus, 'under_review')
  const row = await repo.update(id, { status: 'under_review' })
  await repo.logTransition(id, current.status as ReqStatus, 'under_review', userId, 'Opened for review')
  return row
}

export async function approve(id: string, userId: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  assertTransition(current.status as ReqStatus, 'approved')
  // approve does NOT set published_at — that only happens on publish()
  const row = await repo.update(id, { status: 'approved' })
  await repo.logTransition(id, current.status as ReqStatus, 'approved', userId)

  // ADDED: this event was documented in admin-service's AGENTS.md
  // (publishes: RequisitionApproved) but never actually implemented anywhere
  // in either repo. recruitment-service is the canonical owner of approval
  // state (per team decision), so it — not admin — is the publisher here.
  // admin-rbac's audit-log handler subscribes to this purely for logging.
  await publishEvent('RequisitionApproved', {
    requisitionId: id,
    approvedBy: userId,
  })

  return row
}

export async function reject(id: string, userId: string, rejection_reason: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  assertTransition(current.status as ReqStatus, 'rejected')
  const row = await repo.update(id, { status: 'rejected', rejection_reason })
  await repo.logTransition(id, current.status as ReqStatus, 'rejected', userId, rejection_reason)

  // ADDED — same gap as RequisitionApproved above.
  await publishEvent('RequisitionRejected', {
    requisitionId: id,
    rejectedBy: userId,
    reason: rejection_reason,
  })

  return row
}

export async function requestChanges(id: string, userId: string, admin_remarks: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  assertTransition(current.status as ReqStatus, 'needs_changes')
  const row = await repo.update(id, { status: 'needs_changes', admin_remarks })
  await repo.logTransition(id, current.status as ReqStatus, 'needs_changes', userId, admin_remarks)
  return row
}

export async function publish(id: string, userId: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  assertTransition(current.status as ReqStatus, 'published')

  const form = await repo.getFormForRequisition(id)
  if (!form) {
    throw Object.assign(
      new Error('Application form must be created before publishing the job'),
      { statusCode: 400 }
    )
  }
  if (!form.is_published) {
    throw Object.assign(
      new Error('Application form must be approved and published before publishing the job'),
      { statusCode: 400 }
    )
  }

  const row = await repo.update(id, { status: 'published', published_at: new Date() })
  await repo.logTransition(id, 'approved', 'published', userId)

  // Emit Kafka event (no-op if broker not configured)
  await publishEvent('RequisitionPublished', {
    requisitionId: id,
    title: row.title,
    department: row.department,
    publishedAt: row.published_at
  })

  // Trigger Talent Pool notification workflow asynchronously
  notifyTalentPool(id).catch(error => {
    console.error('Failed to notify Talent Pool:', error)
    // Don't throw - notification failure should not prevent job publishing
  })

  return row
}

export async function close(id: string, userId: string, closed_reason?: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  assertTransition(current.status as ReqStatus, 'closed')
  const row = await repo.update(id, { status: 'closed', closed_reason: closed_reason ?? null, closed_at: new Date() })
  await repo.logTransition(id, current.status as ReqStatus, 'closed', userId, closed_reason)
  return row
}

export async function deleteRequisition(id: string) {
  const current = await repo.findStatus(id)
  if (!current) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  if (current.status !== 'draft') {
    throw Object.assign(new Error('Can only delete draft requisitions'), { statusCode: 400 })
  }
  const deleted = await repo.remove(id)
  if (!deleted) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })
  return { message: 'Requisition deleted successfully' }
}
