import { db } from '../../../database'
import { pipeline_stages, pipeline_entries, applications } from '../../../database/schema'
import { eq, and, asc } from 'drizzle-orm'

const DEFAULT_STAGES = [
  { name: 'Applied',     position: 1 },
  { name: 'Screening',   position: 2 },
  { name: 'Interview',   position: 3 },
  { name: 'Offer',       position: 4 },
  { name: 'Hired',       position: 5 },
]

export async function ensurePipelineStages(requisitionId: string) {
  const existing = await db
    .select()
    .from(pipeline_stages)
    .where(eq(pipeline_stages.requisition_id, requisitionId))
    .orderBy(asc(pipeline_stages.position))

  if (existing.length > 0) return existing

  const inserted = await db.insert(pipeline_stages)
    .values(DEFAULT_STAGES.map(s => ({ ...s, requisition_id: requisitionId })))
    .returning()

  return inserted.sort((a, b) => a.position - b.position)
}

export async function getStages(requisitionId: string) {
  return db
    .select()
    .from(pipeline_stages)
    .where(eq(pipeline_stages.requisition_id, requisitionId))
    .orderBy(asc(pipeline_stages.position))
}

export async function getEntries(requisitionId: string) {
  return db
    .select()
    .from(pipeline_entries)
    .where(eq(pipeline_entries.requisition_id, requisitionId))
    .orderBy(asc(pipeline_entries.created_at))
}

export async function findEntry(entryId: string) {
  const [entry] = await db
    .select()
    .from(pipeline_entries)
    .where(eq(pipeline_entries.id, entryId))
  return entry ?? null
}

export async function createEntry(data: {
  requisition_id: string
  application_id: string
  stage_id: string
  candidate_id: string
}) {
  const [entry] = await db.insert(pipeline_entries).values(data).returning()
  return entry
}

export async function moveEntry(entryId: string, stageId: string) {
  const [entry] = await db
    .update(pipeline_entries)
    .set({ stage_id: stageId, moved_at: new Date() })
    .where(eq(pipeline_entries.id, entryId))
    .returning()
  return entry
}

export async function setEntryStatus(
  entryId: string,
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected' | 'hired',
  notes?: string
) {
  const [entry] = await db
    .update(pipeline_entries)
    .set({
      status,
      recruiter_notes: notes ?? undefined,
      moved_at: new Date()
    } as any)
    .where(eq(pipeline_entries.id, entryId))
    .returning()

  // Mirror status to applications table
  await db.update(applications)
    .set({ status })
    .where(eq(applications.id, entry.application_id))

  return entry
}

export async function updateNotes(entryId: string, notes: string) {
  const [entry] = await db
    .update(pipeline_entries)
    .set({ recruiter_notes: notes } as any)
    .where(eq(pipeline_entries.id, entryId))
    .returning()
  return entry
}

export async function getEntriesByApplication(applicationId: string) {
  return db
    .select()
    .from(pipeline_entries)
    .where(eq(pipeline_entries.application_id, applicationId))
}

export async function findStageById(stageId: string, requisitionId: string) {
  const [stage] = await db
    .select()
    .from(pipeline_stages)
    .where(and(
      eq(pipeline_stages.id, stageId),
      eq(pipeline_stages.requisition_id, requisitionId)
    ))
  return stage ?? null
}
