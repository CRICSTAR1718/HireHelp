import api from "./index"

// ─── Requisitions ─────────────────────────────────────────────────────────────
export const getRequisitions = () => api.get('/requisitions').then(r => r.data)
export const getRequisition = (id: string) => api.get(`/requisitions/${id}`).then(r => r.data)
export const createRequisition = (data: any) => api.post('/requisitions', data).then(r => r.data)
export const updateRequisition = (id: string, data: any) => api.put(`/requisitions/${id}`, data).then(r => r.data)
export const submitRequisition = (id: string) => api.post(`/requisitions/${id}/submit`).then(r => r.data)
export const approveRequisition = (id: string) => api.post(`/requisitions/${id}/approve`).then(r => r.data)
export const rejectRequisition = (id: string, data: any) => api.post(`/requisitions/${id}/reject`, data).then(r => r.data)
export const requestChanges = (id: string, data: any) => api.post(`/requisitions/${id}/request-changes`, data).then(r => r.data)
export const publishRequisition = (id: string) => api.post(`/requisitions/${id}/publish`).then(r => r.data)
export const deleteRequisition = (id: string) => api.delete(`/requisitions/${id}`).then(r => r.data)

export default api
