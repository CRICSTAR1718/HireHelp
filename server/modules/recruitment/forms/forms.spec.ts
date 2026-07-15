import { createForm, getForm, publishForm, addField, updateField, deleteField, reorderFields } from './forms.service'
import { db } from '../../../database'

// Mock the db
jest.mock('../../../database', () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue([{ id: 'form-1', requisition_id: 'req-1', is_published: false }])
        })
      })
    }),
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 'form-1', requisition_id: 'req-1' }])
      })
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([{ id: 'form-1', is_published: true }])
        })
      })
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 'field-1' }])
      })
    })
  }
}))

describe('Forms Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a form for a requisition', async () => {
    const form = await createForm('req-1', 'user-1')
    expect(form).toBeDefined()
  })

  it('should get a form with fields', async () => {
    const form = await getForm('req-1')
    expect(form).toBeDefined()
  })

  it('should publish a form and create approval requests', async () => {
    const result = await publishForm('req-1')
    expect(result).toBeDefined()
    expect(result.message).toContain('Approval request')
  })

  it('should add a field to a form', async () => {
    const field = await addField('req-1', { label: 'Name', field_type: 'text' })
    expect(field).toBeDefined()
  })

  it('should update a field', async () => {
    const field = await updateField('field-1', { label: 'Full Name' })
    expect(field).toBeDefined()
  })

  it('should delete a field', async () => {
    const result = await deleteField('field-1')
    expect(result).toBeDefined()
  })

  it('should reorder fields', async () => {
    const result = await reorderFields('form-1', ['field-2', 'field-1'])
    expect(result).toBeDefined()
  })
})
