import * as repo from './applications.repository'

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

  return application
}

export async function getCandidateApplications(candidateId: string) {
  return repo.findByCandidate(candidateId)
}

export async function checkApplicationStatus(candidateId: string, requisitionId: string) {
  const application = await repo.findByCandidateAndJob(candidateId, requisitionId)
  return application ? { applied: true, status: application.status } : { applied: false }
}
