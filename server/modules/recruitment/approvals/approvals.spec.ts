import { getApprovals, createApproval, decideApproval, getRulebooks, createRulebook, deleteRulebook } from './approvals.service'
import { db } from '../../../database'

// Mock the db
jest.mock('../../../database', () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue([
            { id: 'approval-1', requisition_id: 'req-1', status: 'pending' }
          ])
        })
      })
    }),
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 'approval-1', status: 'pending' }])
      })
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 'approval-1', status: 'approved' }])
        })
      })
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 'rulebook-1' }])
      })
    })
  }
}))

describe('Approvals Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get approvals for a requisition', async () => {
    const approvals = await getApprovals('req-1')
    expect(approvals).toBeDefined()
    expect(Array.isArray(approvals)).toBe(true)
  })

  it('should create an approval', async () => {
    const approval = await createApproval('req-1', 'user-1', 'admin')
    expect(approval).toBeDefined()
  })

  it('should decide approval status', async () => {
    const updated = await decideApproval('approval-1', 'approved')
    expect(updated).toBeDefined()
    expect(updated.status).toBe('approved')
  })

  it('should get rulebooks for a requisition', async () => {
    const rulebooks = await getRulebooks('req-1')
    expect(rulebooks).toBeDefined()
  })

  it('should create a rulebook with criteria', async () => {
    const rulebook = await createRulebook('req-1', 'user-1', [
      { name: 'Experience', weight_pct: 50 },
      { name: 'Skills', weight_pct: 50 }
    ])
    expect(rulebook).toBeDefined()
  })

  it('should delete a rulebook', async () => {
    const result = await deleteRulebook('rulebook-1')
    expect(result).toBeDefined()
    expect(result.message).toContain('deleted')
  })
})
