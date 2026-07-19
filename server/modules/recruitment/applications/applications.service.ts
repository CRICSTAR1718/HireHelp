import * as repo from './applications.repository'
import { aiEvaluationClient } from '../../../clients/ai-evaluation.client'
import { sendOfferEmail, sendRejectionEmail } from '../../../common/utils/email.service'
import { env } from '../../../config/env'
import { db } from '../../../database'
import { job_requisitions } from '../../../database/schema'
import { candidates } from '../../../database/schema/candidate.schema'
import { eq } from 'drizzle-orm'

export async function listApplications(requisitionId?: string) {
  return repo.findAll(requisitionId)
}

export async function getApplication(applicationId: string, requisitionId?: string) {
  const app = await repo.findOne(applicationId, requisitionId)
  if (!app) throw Object.assign(new Error('Application not found'), { statusCode: 404 })

  const responses = await repo.findResponses(applicationId)
  return { ...app, responses }
}

export async function updateStatus(applicationId: string, status: string, requisitionId?: string) {
  console.log(`🚀 updateStatus called with applicationId: ${applicationId}, status: "${status}"`)
  const updated = await repo.updateStatus(applicationId, status as any, requisitionId)
  if (!updated) throw Object.assign(new Error('Application not found'), { statusCode: 404 })

  console.log(`✅ Status updated in database to: "${updated.status}"`)

  // Send email notifications based on status change
  try {
    // Get candidate details
    const [candidate] = await db.select({
      email: candidates.email,
      firstName: candidates.firstName,
      lastName: candidates.lastName
    })
    .from(candidates)
    .where(eq(candidates.uuid, updated.candidate_id as string))
    .limit(1)

    if (!candidate) {
      console.warn(`Candidate not found for application ${applicationId}`)
      return updated
    }

    // Get job requisition details
    const [requisition] = await db.select({
      title: job_requisitions.title
    })
    .from(job_requisitions)
    .where(eq(job_requisitions.id, updated.requisition_id as string))
    .limit(1)

    const candidateName = `${candidate.firstName} ${candidate.lastName}`
    const jobTitle = requisition?.title || 'Position'
    const loginUrl = `${env.CLIENT_ORIGIN}/login`
    console.log(`📨 Sending offer email to ${candidate.email}`)
    console.log(`📧 Email params:`, JSON.stringify({ to: candidate.email, candidateName, jobTitle, loginUrl }, null, 2))
    console.log(`🔍 Current status value: "${status}" (type: ${typeof status})`)
    console.log(`🔍 Status === 'Hired': ${status === 'Hired'}`)
    
    // Send offer email when status changes to "Hired"
    if (status === 'hired') {
      console.log(`🚀 About to call sendOfferEmail`)
      await sendOfferEmail({
        to: candidate.email,
        candidateName,
        jobTitle,
        loginUrl,
        // offerLetterUrl can be added later when offer letter generation is implemented
      })
      console.log(`✅ sendOfferEmail completed`)
    } else {
      console.log(`⏭️ Skipping offer email - status is "${status}" not "Hired"`)
    }

    // Send rejection email when status changes to "Rejected"
    if (status === 'rejected') {
      await sendRejectionEmail({
        to: candidate.email,
        candidateName,
        jobTitle,
        loginUrl,
      })
      console.log(`✅ Status update email sent to ${candidate.email}`)
    }
  } catch (error) {
    // Email failure is logged but does not prevent status update
    console.error('Failed to send status update email:', error)
  }

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
  triggerAiEvaluation(application.id, jobId, candidateId, resumeId).catch(error => {
    console.error('[Application Service] AI evaluation failed:', error)
  })

  return application
}

async function triggerAiEvaluation(
  applicationId: string,
  requisitionId: string,
  candidateId: string,
  resumeId?: number
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

    // Get resume URL from candidates.resumes table
    let resumeUrl: string
    if (resumeId) {
      const { resumes } = await import('../../../database/schema/candidate.schema')
      const [resume] = await db.select({
        s3_url: resumes.s3Url
      })
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1)

      if (!resume || !resume.s3_url) {
        throw Object.assign(new Error('Resume not found'), { statusCode: 404 })
      }
      resumeUrl = resume.s3_url
    } else {
      throw Object.assign(new Error('Resume ID not provided'), { statusCode: 400 })
    }

    // Call AI Evaluation Service
    const evaluationResult = await aiEvaluationClient.evaluateApplication({
      application_id: applicationId,
      candidate_id: candidateId,
      job_id: requisitionId,
      resume_url: resumeUrl,
      job_description: jobDescription,
      required_skills: requisition.required_skills ? requisition.required_skills.split(',').map(s => s.trim()) : [],
      required_experience_years: requisition.experience_required ? parseFloat(requisition.experience_required) : undefined
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

export async function recalculateFitment(applicationId: string, requisitionId?: string) {
  const app = await repo.findOne(applicationId, requisitionId)
  if (!app) throw Object.assign(new Error('Application not found'), { statusCode: 404 })

  // Get candidate's most recent resume ID
  const { resumes } = await import('../../../database/schema/candidate.schema')
  const { candidates } = await import('../../../database/schema/candidate.schema')
  
  const [candidate] = await db.select({
    id: candidates.id
  })
  .from(candidates)
  .where(eq(candidates.uuid, app.candidate_id as string))
  .limit(1)
  
  if (!candidate) throw Object.assign(new Error('Candidate not found'), { statusCode: 404 })
  
  const [resume] = await db.select({
    id: resumes.id
  })
  .from(resumes)
  .where(eq(resumes.candidateId, candidate.id))
  .orderBy(resumes.createdAt)
  .limit(1)
  
  // Reuse the same trigger logic
  await triggerAiEvaluation(applicationId, app.requisition_id as string, app.candidate_id as string, resume?.id)

  return repo.findOne(applicationId, requisitionId)
}

export async function getCandidateApplications(candidateId: string) {
  return repo.findByCandidate(candidateId)
}

export async function checkApplicationStatus(candidateId: string, requisitionId: string) {
  const application = await repo.findByCandidateAndJob(candidateId, requisitionId)
  return application ? { applied: true, status: application.status } : { applied: false }
}

export async function getShortlistedCandidates() {
  const applications = await repo.findByStatus('shortlisted')
  
  // The repository already joins with candidates, so we can map directly
  return applications.map((app: any) => ({
    id: app.id,
    firstName: app.candidate_first_name || 'Candidate',
    lastName: app.candidate_last_name || `#${app.candidate_id?.substring(0, 8)}`,
    email: app.candidate_email || 'candidate@example.com',
    phone: null,
    profile: {
      headline: null,
      location: null,
      summary: null
    }
  }))
}
