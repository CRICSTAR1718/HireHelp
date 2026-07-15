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

export const scheduleApi = {
  async createSchedule(data: Partial<Schedule>): Promise<Schedule> {
    const response = await apiFetch(`/scheduling`, {
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
