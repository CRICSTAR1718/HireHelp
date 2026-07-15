import { shortlistEntry, rejectEntry } from './pipeline.service'

jest.mock('./pipeline.repository', () => ({
  updateStage: jest.fn().mockResolvedValue({ id: 'entry-1', stage: 'shortlisted' }),
  saveStatusLog: jest.fn().mockResolvedValue(null)
}))

jest.mock('../events/kafka-producer', () => ({
  kafkaProducer: {
    publishCandidateShortlisted: jest.fn(),
  }
}))

describe('Pipeline Service', () => {
  it('should shortlist an entry', async () => {
    const updated = await shortlistEntry('req-1', 'entry-1', 'Good fit')
    expect(updated).toBeDefined()
  })

  it('should reject an entry', async () => {
    const updated = await rejectEntry('req-1', 'entry-1', 'Not a good fit')
    expect(updated).toBeDefined()
  })
})
