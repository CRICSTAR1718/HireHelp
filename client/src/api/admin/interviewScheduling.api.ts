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
    const response = await apiClient.get(`/interviewers/available`);
    return response.data;
  },

  async getAllCandidates(): Promise<Candidate[]> {
    const response = await apiClient.get(`/profile/all`);
    return response.data;
  },
};
