import { db } from '../../../../database'
import { applications, requisition_status_logs } from '../../../../database/schema'
import { eq } from 'drizzle-orm'

export async function handleCandidateShortlisted(payload: any) {
  const { applicationId, requisitionId, aiScore, notes } = payload

  if (!applicationId || !requisitionId) {
    console.warn('[Kafka] handleCandidateShortlisted missing applicationId or requisitionId')
    return
  }

  // Update application status to shortlisted and save ai_score if available
  const updateData: any = { status: 'shortlisted' }
  if (aiScore !== undefined) updateData.ai_score = aiScore

  await db.update(applications)
    .set(updateData)
    .where(eq(applications.id, applicationId))

  // Log status change
  await db.insert(requisition_status_logs).values({
    requisition_id: requisitionId,
    changed_by: payload.changedByUserId ?? '00000000-0000-0000-0000-000000000000',
    // Cast to the Drizzle enum-literal type to satisfy TS.
    from_status: 'under_review' as any,
    to_status: 'submitted' as any,
    remarks: notes || 'Shortlisted by AI Evaluation Service'
  })




  console.log(`[Kafka] Candidate ${applicationId} shortlisted for req ${requisitionId}`)
}
