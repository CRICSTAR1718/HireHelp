import api from "./index"

export const getPipeline = async (reqId: string) => {
  const res = await api.get(`/pipeline/${reqId}`)
  return res.data
}

export const moveEntry = async (reqId: string, entryId: string, stageId: string) => {
  const res = await api.post(`/pipeline/${reqId}/entries/${entryId}/move`, { stage_id: stageId })
  return res.data
}

export const shortlistEntry = async (reqId: string, entryId: string, recruiterNotes?: string) => {
  const res = await api.post(`/pipeline/${reqId}/entries/${entryId}/shortlist`, { recruiter_notes: recruiterNotes })
  return res.data
}

export const rejectEntry = async (reqId: string, entryId: string, recruiterNotes?: string) => {
  const res = await api.post(`/pipeline/${reqId}/entries/${entryId}/reject`, { recruiter_notes: recruiterNotes })
  return res.data
}

export const updateNotes = async (reqId: string, entryId: string, recruiterNotes: string) => {
  const res = await api.put(`/pipeline/${reqId}/entries/${entryId}/notes`, { recruiter_notes: recruiterNotes })
  return res.data
}

export const getCandidateProfile = async (candidateId: string) => {
  const res = await api.get(`/pipeline/candidates/${candidateId}/profile`)
  return res.data
}

// Feedback (nested under pipeline API for simplicity here)
export const getFeedback = async (applicationId: string) => {
  const res = await api.get(`/pipeline/${applicationId}/feedback`)
  return res.data
}
