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
