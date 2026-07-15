import { getStatusLogs } from './logs.service'
import { db } from '../../../database'

// Mock the db
jest.mock('../../../database', () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue([
            { id: 'log-1', requisition_id: 'req-1', from_status: 'draft', to_status: 'submitted' }
          ])
        })
      })
    })
  }
}))

describe('Logs Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get status logs for a requisition', async () => {
    const logs = await getStatusLogs('req-1')
    expect(logs).toBeDefined()
    expect(Array.isArray(logs)).toBe(true)
  })
})
