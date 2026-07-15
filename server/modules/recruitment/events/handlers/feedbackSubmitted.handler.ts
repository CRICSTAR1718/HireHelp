import { db } from '../../../../database'
import { feedback_aggregations } from '../../../../database/schema'

/**
 * FeedbackSubmitted event payload from interview-service:
 * { applicationId, requisitionId, interviewRound, interviewerId, overallRating, recommendation, details }
 */
export async function handleFeedbackSubmitted(payload: {
  applicationId: string
  requisitionId: string
  interviewRound?: string
  interviewerId?: string
  overallRating?: number
  recommendation?: string
  details?: Record<string, unknown>
}) {
  await db.insert(feedback_aggregations).values({
    application_id:  payload.applicationId,
    requisition_id:  payload.requisitionId,
    interview_round: payload.interviewRound ?? null,
    interviewer_id:  payload.interviewerId ? payload.interviewerId as any : null,
    overall_rating:  payload.overallRating != null ? String(payload.overallRating) as any : null,
    recommendation:  payload.recommendation ?? null,
    raw_feedback:    payload.details ?? null
  } as any)

  console.log(`[FeedbackSubmitted] Stored feedback for application ${payload.applicationId}`)
}
