import { apiClient } from "../shared/client";



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
    try {
      const response = await apiClient.get(`/interviews/interviewers/available`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch interviewers from dedicated endpoint, trying users endpoint:', error);
      // Fallback to users endpoint if interviewers table is empty
      try {
        const response = await apiClient.get(`/admin/users/by-roles?roleIds=interviewer,hr,admin`);
        return response.data.data.map((user: any) => ({
          id: user.id,
          userId: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          expertise: [],
          availability: null,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }));
      } catch (fallbackError) {
        console.error('Failed to fetch interviewers from users endpoint as well:', fallbackError);
        return [];
      }
    }
  },

  async getInterviewersByRoles(): Promise<Interviewer[]> {
    try {
      const response = await apiClient.get(`/admin/users/by-roles?roleIds=interviewer,hr,admin`);
      return response.data.data.map((user: any) => ({
        id: user.id,
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        expertise: [],
        availability: null,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch interviewers by roles:', error);
      return [];
    }
  },

  async getShortlistedCandidates(): Promise<Candidate[]> {
    try {
      const response = await apiClient.get(`/applications/shortlisted`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch shortlisted candidates:', error);
      return [];
    }
  },

  async getAllCandidates(): Promise<Candidate[]> {
    try {
      const response = await apiClient.get(`/candidates/profile/all`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all candidates:', error);
      return [];
    }
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
