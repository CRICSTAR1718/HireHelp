import * as repo from './jobs.repository'

export async function listPublishedJobs() {
  return repo.getPublishedJobs()
}

export async function getJobDetails(id: string) {
  const job = await repo.getPublishedJobById(id)
  if (!job) throw Object.assign(new Error('Job not found or not published'), { statusCode: 404 })
  return job
}
