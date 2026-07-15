import axios from 'axios'

const API_BASE = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
})

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

export const getApplications = async (reqId: string) => {
  const res = await api.get(`/requisitions/${reqId}/applications`)
  return res.data
}

export const getApplication = async (reqId: string, aid: string) => {
  const res = await api.get(`/requisitions/${reqId}/applications/${aid}`)
  return res.data
}

export const updateApplicationStatus = async (reqId: string, aid: string, status: string) => {
  const res = await api.patch(`/requisitions/${reqId}/applications/${aid}/status`, { status })
  return res.data
}
