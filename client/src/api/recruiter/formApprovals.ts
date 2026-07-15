import api from './index'


export const getPendingApprovals = async () => {
  const res = await api.get('/form-approvals/pending')
  return res.data
}

export const approveForm = async (approvalId: string) => {
  const res = await api.post(`/form-approvals/${approvalId}/approve`)
  return res.data
}

export const rejectForm = async (approvalId: string) => {
  const res = await api.post(`/form-approvals/${approvalId}/reject`)
  return res.data
}

export const requestFormChanges = async (approvalId: string, remarks: string) => {
  const res = await api.post(`/form-approvals/${approvalId}/request-changes`, { remarks })
  return res.data
}

export const getFormApprovalStatus = async (formId: string) => {
  const res = await api.get(`/form-approvals/form/${formId}`)
  return res.data
}
