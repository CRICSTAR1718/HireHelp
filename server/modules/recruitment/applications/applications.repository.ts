import { db } from '../../../database'
import {
  applications,
  candidates,
  field_responses,
  form_fields,
  job_requisitions
} from '../../../database/schema'
import { eq, and, asc, desc } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'

type ApplicationStatus = InferSelectModel<typeof applications>['status']

function baseApplicationSelect() {
  return {
    id: applications.id,
    requisition_id: applications.requisition_id,
    requisition_title: job_requisitions.title,
    department: job_requisitions.department,
    location: job_requisitions.location,
    candidate_id: applications.candidate_id,
    candidate_first_name: candidates.firstName,
    candidate_last_name: candidates.lastName,
    candidate_email: candidates.email,
    status: applications.status,
    ai_score: applications.ai_score,
    recommendation: applications.recommendation,
    strengths: applications.strengths,
    weaknesses: applications.weaknesses,
    matched_skills: applications.matched_skills,
    missing_skills: applications.missing_skills,
    ai_status: applications.ai_status,
    processed_at: applications.processed_at,
    submitted_at: applications.submitted_at
  }
}

export async function findAll(requisitionId?: string) {
  const query = db.select(baseApplicationSelect())
    .from(applications)
    .innerJoin(job_requisitions, eq(applications.requisition_id, job_requisitions.id))
    .leftJoin(candidates, eq(applications.candidate_id, candidates.uuid))
    .orderBy(desc(applications.submitted_at))

  if (requisitionId) {
    return query.where(eq(applications.requisition_id, requisitionId))
  }

  return query
}

export async function findByRequisition(requisitionId: string) {
  return findAll(requisitionId)
}

export async function findOne(applicationId: string, requisitionId?: string) {
  const query = db.select(baseApplicationSelect())
    .from(applications)
    .innerJoin(job_requisitions, eq(applications.requisition_id, job_requisitions.id))
    .leftJoin(candidates, eq(applications.candidate_id, candidates.uuid))

  const conditions = [eq(applications.id, applicationId)]
  if (requisitionId) {
    conditions.push(eq(applications.requisition_id, requisitionId))
  }

  const [app] = await query.where(and(...conditions))
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
    jobTitle: job_requisitions.title,
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

export async function findByStatus(status: string) {
  return db.select(baseApplicationSelect())
    .from(applications)
    .innerJoin(job_requisitions, eq(applications.requisition_id, job_requisitions.id))
    .leftJoin(candidates, eq(applications.candidate_id, candidates.uuid))
    .where(eq(applications.status, status as any))
    .orderBy(desc(applications.submitted_at))
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

export async function updateStatus(applicationId: string, status: ApplicationStatus, requisitionId?: string) {
  const conditions = [eq(applications.id, applicationId)]
  if (requisitionId) {
    conditions.push(eq(applications.requisition_id, requisitionId))
  }

  const [updated] = await db.update(applications)
    .set({ status })
    .where(and(...conditions))
    .returning()
  return updated ?? null
}

export async function updateAiEvaluation(
  applicationId: string,
  requisitionId: string,
  aiData: {
    ai_score: number
    recommendation: string
    strengths: string[]
    weaknesses: string[]
    matched_skills: string[]
    missing_skills: string[]
    ai_status: 'completed' | 'failed'
  }
) {
  const [updated] = await db.update(applications)
    .set({
      ai_score: aiData.ai_score.toString(),
      recommendation: aiData.recommendation,
      strengths: aiData.strengths,
      weaknesses: aiData.weaknesses,
      matched_skills: aiData.matched_skills,
      missing_skills: aiData.missing_skills,
      ai_status: aiData.ai_status,
      processed_at: new Date()
    })
    .where(and(
      eq(applications.id, applicationId),
      eq(applications.requisition_id, requisitionId)
    ))
    .returning()
  return updated ?? null
}

export async function updateAiStatus(
  applicationId: string,
  requisitionId: string,
  aiStatus: 'pending' | 'processing' | 'completed' | 'failed'
) {
  const [updated] = await db.update(applications)
    .set({ ai_status: aiStatus })
    .where(and(
      eq(applications.id, applicationId),
      eq(applications.requisition_id, requisitionId)
    ))
    .returning()
  return updated ?? null
}
