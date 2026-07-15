import api from './index'

export const createForm = async (reqId: string) => {
  const res = await api.post(`/requisitions/${reqId}/form`)
  return res.data
}

export const getForm = async (reqId: string) => {
  const res = await api.get(`/requisitions/${reqId}/form`)
  return res.data
}

export const addField = async (reqId: string, data: any) => {
  const res = await api.post(`/requisitions/${reqId}/form/fields`, data)
  return res.data
}

export const updateField = async (reqId: string, fid: string, data: any) => {
  const res = await api.patch(`/requisitions/${reqId}/form/fields/${fid}`, data)
  return res.data
}

export const deleteField = async (reqId: string, fid: string) => {
  const res = await api.delete(`/requisitions/${reqId}/form/fields/${fid}`)
  return res.data
}

export const reorderFields = async (reqId: string, order: string[]) => {
  const res = await api.patch(`/requisitions/${reqId}/form/fields/reorder`, { order })
  return res.data
}

export const publishForm = async (reqId: string) => {
  const res = await api.patch(`/requisitions/${reqId}/form/publish`)
  return res.data
}

export const getQuestionTemplates = async (category?: string) => {
  const res = await api.get('/forms/templates', { params: { category } })
  return res.data
}

export const saveQuestionTemplate = async (data: any) => {
  const res = await api.post('/forms/templates', data)
  return res.data
}
