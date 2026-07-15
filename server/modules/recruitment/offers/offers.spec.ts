import { createOffer } from './offers.service'

jest.mock('./offers.repository', () => ({
  insertOffer: jest.fn().mockResolvedValue({ id: 'offer-1', status: 'draft' }),
}))

jest.mock('../events/kafka-producer', () => ({
  kafkaProducer: {
    publishOfferGenerated: jest.fn(),
  }
}))

describe('Offers Service', () => {
  it('should create an offer', async () => {
    const offer = await createOffer({
      requisition_id: 'req-1',
      application_id: 'app-1',
      candidate_id: 'cand-1',
      title: 'Engineer',
      salary_amount: 100000,
      salary_currency: 'USD',
      start_date: new Date()
    } as any, 'user-1')
    expect(offer).toBeDefined()
  })
})
