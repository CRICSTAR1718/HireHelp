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
    const response = await apiClient.get(`/interviews/interviewers/available`);
    return response.data;
  },

  async getInterviewersByRoles(): Promise<Interviewer[]> {
    // Get users with interviewer, hr, or admin roles
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
