import { apiFetch } from "./http";

export interface Assignment {
  id: number;
  interviewId: string;
  interviewerId: number;
  interviewerName?: string;
  interviewerEmail?: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  role: string;
  status: string;
  assignedAt: Date;
  completedAt?: Date;
  invitationSent?: boolean;
  scheduleId?: number;
  meetingLink?: string;
}

export const assignmentApi = {
  async createAssignment(data: Partial<Assignment>): Promise<Assignment> {
    const response = await apiFetch(`/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getAssignment(id: number): Promise<Assignment> {
    const response = await apiFetch(`/assignments/${id}`);
    return response.json();
  },

  async getInterviewerAssignments(interviewerId: number): Promise<Assignment[]> {
    const response = await apiFetch(`/assignments/interviewer/${interviewerId}`);
    return response.json();
  },

  async updateAssignment(id: number, data: Partial<Assignment>): Promise<Assignment> {
    const response = await apiFetch(`/assignments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteAssignment(id: number): Promise<void> {
    await apiFetch(`/assignments/${id}`, { method: 'DELETE' });
  },
};
