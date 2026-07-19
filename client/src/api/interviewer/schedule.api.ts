import { apiFetch } from "./http";

export interface Schedule {
  id: number;
  assignmentId: number;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewSchedule {
  assignment: {
    id: number;
    interviewId: string;
    interviewerId: number;
    candidateId: string;
    role: string;
    status: string;
    assignedAt: Date;
  };
  schedule: Schedule;
}

export const scheduleApi = {
  async createSchedule(data: Partial<Schedule>): Promise<Schedule> {
    const response = await apiFetch(`/scheduling`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async createInterviewSchedule(data: {
    interviewerId: number;
    candidateId: string;
    role: string;
    interviewId?: string;
    startTime: string;
    endTime: string;
    location?: string;
    meetingLink?: string;
    status?: string;
  }): Promise<InterviewSchedule> {
    const response = await apiFetch(`/scheduling/interview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async sendInvitation(scheduleId: number, data: {
    interviewerId: number;
    candidateEmail: string;
    candidateName: string;
    interviewerEmail: string;
    interviewerName: string;
    jobTitle?: string;
  }): Promise<Schedule> {
    const response = await apiFetch(`/scheduling/${scheduleId}/send-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getSchedule(id: number): Promise<Schedule> {
    const response = await apiFetch(`/scheduling/${id}`);
    return response.json();
  },

  async getAssignmentSchedules(assignmentId: number): Promise<Schedule[]> {
    const response = await apiFetch(`/scheduling/assignment/${assignmentId}`);
    return response.json();
  },

  async updateSchedule(id: number, data: Partial<Schedule>): Promise<Schedule> {
    const response = await apiFetch(`/scheduling/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteSchedule(id: number): Promise<void> {
    await apiFetch(`/scheduling/${id}`, { method: 'DELETE' });
  },
};