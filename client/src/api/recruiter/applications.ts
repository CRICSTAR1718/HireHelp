import api from './index'

export const getPublicJobs = async () => {
  const res = await api.get('/jobs')
  return res.data
}

export const getJobForm = async (jobId: string) => {
  const res = await api.get(`/jobs/${jobId}/form`)
  return res.data
}

export const submitApplication = async (jobId: string, responses: any) => {
  const res = await api.post(`/jobs/${jobId}/apply`, { responses })
  return res.data
}

export const getMyApplications = async () => {
  const res = await api.get('/candidate/applications')
  return res.data
}

export const getApplications = async (reqId?: string) => {
  const res = await api.get('/applications', {
    params: reqId ? { requisitionId: reqId } : undefined,
  })
  return res.data
}

export const getApplication = async (aid: string, reqId?: string) => {
  const res = await api.get(`/applications/${aid}`, {
    params: reqId ? { requisitionId: reqId } : undefined,
  })
  return res.data
}

export const updateApplicationStatus = async (aid: string, status: string, reqId?: string) => {
  const res = await api.patch(`/applications/${aid}/status`, { status }, {
    params: reqId ? { requisitionId: reqId } : undefined,
  })
  return res.data
}

export const getAiEvaluation = async (aid: string, reqId?: string) => {
  const res = await api.get(`/applications/${aid}/ai-evaluation`, {
    params: reqId ? { requisitionId: reqId } : undefined,
  })
  return res.data
}
