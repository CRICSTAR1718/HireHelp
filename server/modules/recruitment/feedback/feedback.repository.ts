import { db } from '../../../database'
import { feedback_aggregations, applications, users } from '../../../database/schema'
import { eq, and } from 'drizzle-orm'

export async function findByApplication(applicationId: string) {
  return db
    .select()
    .from(feedback_aggregations)
    .where(eq(feedback_aggregations.application_id, applicationId))
}

export async function upsert(data: {
  application_id: string
  requisition_id: string
  interview_round: string | null
  interviewer_id: string | null
  overall_rating: string | null
  recommendation: string | null
  raw_feedback: any
}) {
  const [row] = await db
    .insert(feedback_aggregations)
    .values(data as any)
    .returning()
  return row
}
