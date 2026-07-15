import { listApplications, getApplication, updateStatus } from './applications.service'
import { db } from '../../../database'

// Mock the db
jest.mock('../../../database', () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue([
            { id: 'app-1', candidate_id: 'cand-1', status: 'submitted', submitted_at: new Date() }
          ])
        })
      })
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          and: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([{ id: 'app-1', status: 'under_review' }])
          })
        })
      })
    })
  }
}))

describe('Applications Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should list applications for a requisition', async () => {
    const apps = await listApplications('req-1')
    expect(apps).toBeDefined()
    expect(Array.isArray(apps)).toBe(true)
  })

  it('should get a single application', async () => {
    const app = await getApplication('app-1', 'req-1')
    expect(app).toBeDefined()
  })

  it('should update application status', async () => {
    const updated = await updateStatus('app-1', 'req-1', 'under_review')
    expect(updated).toBeDefined()
    expect(updated.status).toBe('under_review')
  })
})
