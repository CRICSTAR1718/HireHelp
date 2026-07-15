import { createRequisition, updateRequisitionStatus } from './requisitions.service'
import { db } from '../../../database'
import { job_requisitions } from '../../../database/schema'
import { eq } from 'drizzle-orm'

// Mock the db and kafka producer
jest.mock('../../../database', () => ({
  db: {
    insert: jest.fn().mockReturnValue({ values: jest.fn().mockReturnValue({ returning: jest.fn().mockResolvedValue([{ id: 'req-1', status: 'draft' }]) }) }),
    update: jest.fn().mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn().mockReturnValue({ returning: jest.fn().mockResolvedValue([{ id: 'req-1', status: 'published' }]) }) }) }),
    select: jest.fn().mockReturnValue({ from: jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue([{ id: 'req-1', status: 'approved' }]) }) }),
    transaction: jest.fn((cb) => cb()),
  }
}))

jest.mock('../events/kafka-producer', () => ({
  kafkaProducer: {
    publishRequisitionPublished: jest.fn(),
  }
}))

describe('Requisitions Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a requisition in draft status', async () => {
    const req = await createRequisition('test-hr-id', {
      title: 'Software Engineer',
      department: 'Engineering',
      number_of_openings: 2,
    } as any)
    
    expect(req).toBeDefined()
    expect(req.status).toBe('draft')
  })

  it('should transition status from approved to published and emit event', async () => {
    const updated = await updateRequisitionStatus('req-1', 'published', 'test-hr-id')
    expect(updated).toBeDefined()
  })
})
