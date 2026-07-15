import { db } from '../../../database'
import {
  applications,
  field_responses,
  form_fields,
  job_requisitions
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

export async function findByCandidate(candidateId: string) {
  return db.select({
    id: applications.id,
    requisition_id: applications.requisition_id,
    candidate_id: applications.candidate_id,
    status: applications.status,
    ai_score: applications.ai_score,
    submitted_at: applications.submitted_at,
    job_title: job_requisitions.title,
    department: job_requisitions.department,
    location: job_requisitions.location,
  })
  .from(applications)
  .innerJoin(job_requisitions, eq(applications.requisition_id, job_requisitions.id))
  .where(eq(applications.candidate_id, candidateId))
  .orderBy(asc(applications.submitted_at))
}

export async function findByCandidateAndJob(candidateId: string, requisitionId: string) {
  const [app] = await db.select({
    id: applications.id,
    requisition_id: applications.requisition_id,
    candidate_id: applications.candidate_id,
    status: applications.status,
    submitted_at: applications.submitted_at,
  })
  .from(applications)
  .where(and(
    eq(applications.candidate_id, candidateId),
    eq(applications.requisition_id, requisitionId)
  ))
  return app ?? null
}

export async function createApplication(data: {
  requisition_id: string
  candidate_id: string
}) {
  const [application] = await db.insert(applications).values({
    requisition_id: data.requisition_id,
    candidate_id: data.candidate_id,
    status: 'submitted',
    submitted_at: new Date()
  }).returning()
  return application
}

export async function createFieldResponses(applicationId: string, responses: Array<{
  field_id: string
  response_text?: string
  response_json?: any
  file_url?: string
}>) {
  if (responses.length === 0) return []
  
  return db.insert(field_responses).values(
    responses.map(r => ({
      application_id: applicationId,
      field_id: r.field_id,
      response_text: r.response_text,
      response_json: r.response_json,
      file_url: r.file_url
    }))
  ).returning()
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
