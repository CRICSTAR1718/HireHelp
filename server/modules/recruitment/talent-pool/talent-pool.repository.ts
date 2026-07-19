import { db } from '../../../database'
import { talent_pool, notification_history } from '../../../database/schema/recruitment.schema'
import { eq, and, desc } from 'drizzle-orm'

function toNumericField(value?: number | string) {
  if (value === undefined) return undefined
  return typeof value === 'number' ? value.toString() : value
}

export async function addToTalentPool(data: {
  candidate_id: string
  resume_id?: number
  previous_job_id: string
  application_id: string
  interview_feedback?: string
  interview_score?: number | string
  ai_score?: number | string
  rejection_reason?: string
}) {
  const [entry] = await db.insert(talent_pool).values({
    ...data,
    interview_score: toNumericField(data.interview_score),
    ai_score: toNumericField(data.ai_score),
    added_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }).returning()
  return entry
}

export async function getTalentPoolCandidates() {
  return db.select().from(talent_pool).where(eq(talent_pool.status, 'active')).orderBy(desc(talent_pool.added_at))
}

export async function getTalentPoolCandidateById(id: string) {
  const [candidate] = await db.select().from(talent_pool).where(eq(talent_pool.id, id)).limit(1)
  return candidate
}

export async function getTalentPoolCandidateByCandidateId(candidateId: string) {
  const [candidate] = await db.select()
    .from(talent_pool)
    .where(and(eq(talent_pool.candidate_id, candidateId), eq(talent_pool.status, 'active')))
    .limit(1)
  return candidate
}

export async function removeFromTalentPool(id: string) {
  const [updated] = await db.update(talent_pool)
    .set({ status: 'removed', updated_at: new Date() })
    .where(eq(talent_pool.id, id))
    .returning()
  return updated
}

export async function updateTalentPoolCandidate(id: string, data: Partial<{
  interview_feedback: string
  interview_score: number | string
  ai_score: number | string
  rejection_reason: string
}>) {
  const [updated] = await db.update(talent_pool)
    .set({
      ...data,
      interview_score: toNumericField(data.interview_score),
      ai_score: toNumericField(data.ai_score),
      updated_at: new Date()
    })
    .where(eq(talent_pool.id, id))
    .returning()
  return updated
}

export async function checkCandidateInTalentPool(candidateId: string) {
  const [entry] = await db.select()
    .from(talent_pool)
    .where(and(eq(talent_pool.candidate_id, candidateId), eq(talent_pool.status, 'active')))
    .limit(1)
  return entry || null
}

export async function getActiveTalentPoolCount() {
  const [result] = await db.select({ count: talent_pool.id }).from(talent_pool).where(eq(talent_pool.status, 'active'))
  return result?.count || 0
}

// Notification History Repository Functions
export async function createNotificationHistory(data: {
  candidate_id: string
  job_id: string
  email_status: string
}) {
  const [entry] = await db.insert(notification_history).values({
    ...data,
    sent_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }).returning()
  return entry
}

export async function getNotificationHistoryByJob(jobId: string) {
  return db.select()
    .from(notification_history)
    .where(eq(notification_history.job_id, jobId))
    .orderBy(desc(notification_history.sent_at))
}

export async function getNotificationHistoryByCandidate(candidateId: string) {
  return db.select()
    .from(notification_history)
    .where(eq(notification_history.candidate_id, candidateId))
    .orderBy(desc(notification_history.sent_at))
}

export async function updateNotificationTracking(id: string, data: {
  opened?: boolean
  opened_at?: Date
  clicked?: boolean
  clicked_at?: Date
  applied?: boolean
  applied_at?: Date
}) {
  const [updated] = await db.update(notification_history)
    .set({ ...data, updated_at: new Date() })
    .where(eq(notification_history.id, id))
    .returning()
  return updated
}
