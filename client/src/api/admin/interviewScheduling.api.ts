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
      const response = await apiClient.get(`/interviews/interviewers`);
      return response.data.map((interviewer: any) => ({
        id: interviewer.id,
        userId: interviewer.userId,
        name: interviewer.name,
        email: interviewer.email,
        expertise: interviewer.expertise || [],
        availability: interviewer.availability || null,
        createdAt: new Date(interviewer.createdAt),
        updatedAt: new Date(interviewer.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to fetch interviewers:', error);
      return [];
    }
  },

  async getShortlistedCandidates(): Promise<Candidate[]> {
    try {
      const response = await apiClient.get(`/applications/shortlisted`);
      console.log('Shortlisted candidates response:', response.data);
      
      // If no shortlisted candidates, fall back to all candidates
      if (!response.data || response.data.length === 0) {
        console.log('No shortlisted candidates found, fetching all candidates');
        return this.getAllCandidates();
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch shortlisted candidates:', error);
      // Fallback to all candidates on error
      return this.getAllCandidates();
    }
  },

  async getAllCandidates(): Promise<Candidate[]> {
    try {
      const response = await apiClient.get(`/candidates/profile/all`);
      console.log('All candidates response:', response.data);
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
    console.log('API call to /interviews/scheduling/interview with data:', data);
    const response = await apiClient.post(`/interviews/scheduling/interview`, data);
    console.log('API response:', response.data);
    return response.data;
  },

  async sendInvitation(scheduleId: number, data: {
    interviewerId: number;
    candidateEmail: string;
    candidateName: string;
    interviewerEmail: string;
    interviewerName: string;
    jobTitle?: string;
  }) {
    const response = await apiClient.post(`/interviews/scheduling/${scheduleId}/send-invite`, data);
    return response.data;
  },
};