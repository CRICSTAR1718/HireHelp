import { db } from '../../../database'
import {
  applications,
  field_responses,
  form_fields
} from '../../../database/schema'
import { eq, and, asc } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

type ApplicationStatus = InferSelectModel<typeof applications>['status']

export async function findByRequisition(requisitionId: string) {
  return db.select({
    id:           applications.id,
    candidate_id: applications.candidate_id,
    status:       applications.status,
    ai_score:     applications.ai_score,
    submitted_at: applications.submitted_at
  })
  .from(applications)
  .where(eq(applications.requisition_id, requisitionId))
  .orderBy(asc(applications.submitted_at))
}

export async function findOne(applicationId: string, requisitionId: string) {
  const [app] = await db.select({
    id:           applications.id,
    candidate_id: applications.candidate_id,
    status:       applications.status,
    ai_score:     applications.ai_score,
    submitted_at: applications.submitted_at
  })
  .from(applications)
  .where(and(
    eq(applications.id, applicationId),
    eq(applications.requisition_id, requisitionId)
  ))
  return app ?? null
}

export async function findResponses(applicationId: string) {
  return db.select({
    response_text: field_responses.response_text,
    response_json: field_responses.response_json,
    file_url:      field_responses.file_url,
    label:         form_fields.label,
    field_type:    form_fields.field_type,
    position:      form_fields.position
  })
  .from(field_responses)
  .innerJoin(form_fields, eq(field_responses.field_id, form_fields.id))
  .where(eq(field_responses.application_id, applicationId))
  .orderBy(asc(form_fields.position))
}

export async function updateStatus(applicationId: string, requisitionId: string, status: ApplicationStatus) {
  const [updated] = await db.update(applications)
    .set({ status })
    .where(and(
      eq(applications.id, applicationId),
      eq(applications.requisition_id, requisitionId)
    ))
    .returning()
  return updated ?? null
}
