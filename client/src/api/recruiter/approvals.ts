import api from "./requisitions"

export const getApprovals = (reqId: string) => api.get(`/requisitions/${reqId}/approvals`).then((r: any) => r.data)
export const createApproval = (reqId: string, data: any) => api.post(`/requisitions/${reqId}/approvals`, data).then((r: any) => r.data)
export const decideApproval = (reqId: string, id: string, status: string) =>
  api.patch(`/requisitions/${reqId}/approvals/${id}`, { status }).then((r: any) => r.data)
