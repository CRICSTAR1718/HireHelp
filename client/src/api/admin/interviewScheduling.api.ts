import { apiClient } from "./client";

export interface Interviewer {
  id: number;
  userId: string;
  name: string;
  email: string;
  expertise?: string[];
  availability?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profile?: {
    id?: number;
    headline?: string;
    location?: string;
    summary?: string;
  };
}

export const interviewSchedulingApi = {
  async getAvailableInterviewers(): Promise<Interviewer[]> {
    const response = await apiClient.get(`/interviews/interviewers/available`);
    return response.data;
  },

  async getShortlistedCandidates(): Promise<Candidate[]> {
    const response = await apiClient.get(`/applications/shortlisted`);
    return response.data;
  },

  async getAllCandidates(): Promise<Candidate[]> {
    const response = await apiClient.get(`/candidates/profile/all`);
    return response.data;
  },

  async createInterviewSchedule(data: {
    interviewerId: number;
    candidateId: string;
    role: string;
    startTime: string;
    endTime: string;
    location?: string;
    status?: string;
  }) {
    const response = await apiClient.post(`/interviews/scheduling/interview`, data);
    return response.data;
  },

  async sendInvitation(scheduleId: number, data: {
    interviewerId: number;
    candidateEmail: string;
    candidateName: string;
    interviewerEmail: string;
    interviewerName: string;
  }) {
    const response = await apiClient.post(`/interviews/scheduling/${scheduleId}/send-invite`, data);
    return response.data;
  },
};
