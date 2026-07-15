import { listPublishedJobs, getJobDetails } from './jobs.service'

jest.mock('./jobs.repository', () => ({
  getPublishedJobs: jest.fn().mockResolvedValue([{ id: 'job-1', title: 'Software Engineer', status: 'published' }]),
  getPublishedJobById: jest.fn().mockResolvedValue({ id: 'job-1', title: 'Software Engineer', status: 'published' })
}))

describe('Jobs Service', () => {
  it('should list published jobs', async () => {
    const jobs = await listPublishedJobs()
    expect(jobs).toHaveLength(1)
    expect(jobs[0].title).toBe('Software Engineer')
  })

  it('should get job details', async () => {
    const job = await getJobDetails('job-1')
    expect(job.title).toBe('Software Engineer')
  })
})
