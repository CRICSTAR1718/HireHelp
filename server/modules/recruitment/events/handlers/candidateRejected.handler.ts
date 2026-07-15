import { db } from '../../../../database'
import { applications, pipeline_entries } from '../../../../database/schema'
import { eq } from 'drizzle-orm'

/**
 * CandidateRejected event payload from ai-evaluation-service or another consumer:
 * { applicationId, candidateId, reason }
 */
export async function handleCandidateRejected(payload: {
  applicationId: string
  candidateId: string
  reason?: string
}) {
  const { applicationId } = payload

  await db.update(applications)
    .set({ status: 'rejected' })
    .where(eq(applications.id, applicationId))

  await db.update(pipeline_entries)
    .set({ status: 'rejected', recruiter_notes: payload.reason ?? null } as any)
    .where(eq(pipeline_entries.application_id, applicationId))

  console.log(`[CandidateRejected] Marked application ${applicationId} as rejected`)
}
