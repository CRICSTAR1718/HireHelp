import { db } from '../../../../database'
import { applications, pipeline_entries } from '../../../../database/schema'
import { eq } from 'drizzle-orm'

/**
 * ResumeScreened event payload from ai-evaluation-service:
 * { applicationId, candidateId, aiScore, requisitionId }
 */
export async function handleResumeScreened(payload: {
  applicationId: string
  candidateId: string
  aiScore: number
  requisitionId: string
}) {
  const { applicationId, aiScore } = payload

  // Update ai_score on applications table
  await db.update(applications)
    .set({ ai_score: String(aiScore) } as any)
    .where(eq(applications.id, applicationId))

  // Also update pipeline_entry if it exists
  await db.update(pipeline_entries)
    .set({ ai_score: String(aiScore) } as any)
    .where(eq(pipeline_entries.application_id, applicationId))

  console.log(`[ResumeScreened] Updated AI score for application ${applicationId}: ${aiScore}`)
}
