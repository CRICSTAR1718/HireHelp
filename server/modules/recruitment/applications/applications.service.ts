import * as repo from './applications.repository'
import { aiEvaluationClient } from '../../../clients/ai-evaluation.client'
import { db } from '../../../database'
import { job_requisitions } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export async function listApplications(requisitionId: string) {
  return repo.findByRequisition(requisitionId)
}

export async function getApplication(applicationId: string, requisitionId: string) {
  const app = await repo.findOne(applicationId, requisitionId)
  if (!app) throw Object.assign(new Error('Application not found'), { statusCode: 404 })

  const responses = await repo.findResponses(applicationId)
  return { ...app, responses }
}

export async function updateStatus(applicationId: string, requisitionId: string, status: string) {
  const updated = await repo.updateStatus(applicationId, requisitionId, status as any)
  if (!updated) throw Object.assign(new Error('Application not found'), { statusCode: 404 })
  return updated
}

export async function submitApplication(candidateId: string, jobId: string, responses: Array<{
  field_id: string
  response_text?: string
  response_json?: any
  file_url?: string
}>, resumeId?: number) {
  console.log('[Application Service] Creating application:', {
    candidateId,
    jobId,
    resumeId,
    responsesCount: responses?.length
  })

  // Check if already applied
  const existing = await repo.findByCandidateAndJob(candidateId, jobId)
  if (existing) {
    throw Object.assign(new Error('You have already applied for this job'), { statusCode: 409 })
  }

  // Create application
  const application = await repo.createApplication({
    requisition_id: jobId,
    candidate_id: candidateId
  })

  console.log('[Application Service] Application created:', application.id)

  // Create field responses
  if (responses && responses.length > 0) {
    const fieldResponses = await repo.createFieldResponses(application.id, responses)
    console.log('[Application Service] Field responses created:', fieldResponses.length)
  }

  // Trigger AI evaluation asynchronously
  triggerAiEvaluation(application.id, jobId, candidateId).catch(error => {
    console.error('[Application Service] AI evaluation failed:', error)
  })

  return application
}

async function triggerAiEvaluation(
  applicationId: string,
  requisitionId: string,
  candidateId: string
) {
  try {
    // Update status to processing
    await repo.updateAiStatus(applicationId, requisitionId, 'processing')

    // Get job description
    const [requisition] = await db.select({
      id: job_requisitions.id,
      title: job_requisitions.title,
      about_role: job_requisitions.about_role,
      responsibilities: job_requisitions.responsibilities,
      required_skills: job_requisitions.required_skills,
      preferred_skills: job_requisitions.preferred_skills,
      experience_required: job_requisitions.experience_required,
      education_requirements: job_requisitions.education_requirements
    })
    .from(job_requisitions)
    .where(eq(job_requisitions.id, requisitionId))

    if (!requisition) throw Object.assign(new Error('Requisition not found'), { statusCode: 404 })

    // Build job description text
    const jobDescription = `
Title: ${requisition.title}
About the Role: ${requisition.about_role || ''}
Responsibilities: ${requisition.responsibilities || ''}
Required Skills: ${requisition.required_skills || ''}
Preferred Skills: ${requisition.preferred_skills || ''}
Experience Required: ${requisition.experience_required || ''}
Education Requirements: ${requisition.education_requirements || ''}
    `.trim()

    // Get resume URL from field responses
    const responses = await repo.findResponses(applicationId)
    const resumeResponse = responses.find(r => r.field_type === 'file')
    if (!resumeResponse || !resumeResponse.file_url) {
      throw Object.assign(new Error('Resume not found in application'), { statusCode: 400 })
    }

    // Call AI Evaluation Service
    const evaluationResult = await aiEvaluationClient.evaluateApplication({
      application_id: applicationId,
      candidate_id: candidateId,
      job_id: requisitionId,
      resume_url: resumeResponse.file_url,
      job_description: jobDescription
    })

    // Update application with AI results
    await repo.updateAiEvaluation(applicationId, requisitionId, {
      ai_score: evaluationResult.fitment_score,
      recommendation: evaluationResult.recommendation,
      strengths: evaluationResult.strengths,
      weaknesses: evaluationResult.weaknesses,
      matched_skills: evaluationResult.matched_skills,
      missing_skills: evaluationResult.missing_skills,
      ai_status: 'completed'
    })

    console.log('[Application Service] AI evaluation completed for application:', applicationId)
  } catch (error) {
    console.error(`[Application Service] AI evaluation failed for application ${applicationId}:`, error)
    await repo.updateAiStatus(applicationId, requisitionId, 'failed')
    throw error
  }
}

export async function recalculateFitment(applicationId: string, requisitionId: string) {
  const app = await repo.findOne(applicationId, requisitionId)
  if (!app) throw Object.assign(new Error('Application not found'), { statusCode: 404 })

  // Reuse the same trigger logic
  await triggerAiEvaluation(applicationId, requisitionId, app.candidate_id as string)

  return repo.findOne(applicationId, requisitionId)
}

export async function getCandidateApplications(candidateId: string) {
  return repo.findByCandidate(candidateId)
}

export async function checkApplicationStatus(candidateId: string, requisitionId: string) {
  const application = await repo.findByCandidateAndJob(candidateId, requisitionId)
  return application ? { applied: true, status: application.status } : { applied: false }
}
