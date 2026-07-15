import api from "./requisitions"

export const getRulebooks = (reqId: string) => api.get(`/requisitions/${reqId}/rulebooks`).then((r: any) => r.data)
export const createRulebook = (reqId: string, data: any) => api.post(`/requisitions/${reqId}/rulebooks`, data).then((r: any) => r.data)
export const deleteRulebook = (reqId: string, id: string) => api.delete(`/requisitions/${reqId}/rulebooks/${id}`).then((r: any) => r.data)
