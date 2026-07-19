import api from './index'

export interface TalentPoolCandidate {
  id: string;
  candidate_id: string;
  candidateUuid?: string;
  resume_id?: number;
  previous_job_id: string;
  application_id: string;
  interview_feedback?: string;
  interview_score?: number;
  ai_score?: number;
  rejection_reason?: string;
  status: string;
  added_at: string;
  created_at: string;
  updated_at: string;
  candidateName: string;
  email?: string;
  phone?: string;
  previousJobTitle?: string;
  previousJobDepartment?: string;
  previousJobLocation?: string;
  employmentType?: string;
  resumeFileName?: string;
  resumeUrl?: string;
}

export interface TalentPoolStats {
  total: number;
  candidates: number;
}

export async function getTalentPoolCandidates(): Promise<TalentPoolCandidate[]> {
  const response = await api.get('/talent-pool');
  return response.data;
}

export async function getTalentPoolStats(): Promise<TalentPoolStats> {
  const response = await api.get('/talent-pool/stats');
  return response.data;
}

export async function getTalentPoolCandidate(id: string): Promise<TalentPoolCandidate> {
  const response = await api.get(`/talent-pool/${id}`);
  return response.data;
}

export async function removeCandidateFromTalentPool(id: string): Promise<void> {
  await api.delete(`/talent-pool/${id}`);
}

export async function downloadCandidateResume(id: string): Promise<{ resumeUrl: string }> {
  const response = await api.get(`/talent-pool/${id}/resume`);
  return response.data;
}

export async function applyForJobFromTalentPool(candidateId: string, jobId: string): Promise<{ message: string; application: any }> {
  const response = await api.post(`/talent-pool/${candidateId}/apply/${jobId}`);
  return response.data;
}

export async function checkCandidateInTalentPool(candidateId: string): Promise<boolean> {
  try {
    const response = await api.get(`/talent-pool/check/${candidateId}`);
    return response.data.inPool;
  } catch (error) {
    // If endpoint doesn't exist or returns error, assume not in pool
    return false;
  }
}
