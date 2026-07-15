import * as repo from './feedback.repository'

export async function getFeedbackForApplication(applicationId: string) {
  const feedback = await repo.findByApplication(applicationId)
  
  if (feedback.length === 0) {
    return { records: [], summary: null }
  }

  // Calculate summary
  let totalScore = 0
  let count = 0
  let hires = 0
  let noHires = 0

  for (const f of feedback) {
    if (f.overall_rating) {
      totalScore += parseFloat(f.overall_rating)
      count++
    }
    if (f.recommendation === 'hire' || f.recommendation === 'strong_hire') hires++
    if (f.recommendation === 'no_hire' || f.recommendation === 'strong_no_hire') noHires++
  }

  const summary = {
    average_rating: count > 0 ? (totalScore / count).toFixed(1) : null,
    total_interviews: feedback.length,
    hires,
    no_hires: noHires
  }

  return { records: feedback, summary }
}

export async function aggregateFeedback(payload: any) {
  // Normally called from the Kafka consumer, but can also be called via HTTP for testing
  return repo.upsert({
    application_id: payload.applicationId,
    requisition_id: payload.requisitionId,
    interview_round: payload.interviewRound,
    interviewer_id: payload.interviewerId,
    overall_rating: payload.overallRating,
    recommendation: payload.recommendation,
    raw_feedback: payload.details
  })
}
