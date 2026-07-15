import { apiFetch } from "./http";

export interface CalendarIntegration {
  id: number;
  interviewerId: number;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  calendarId?: string;
  syncEnabled: boolean;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const calendarApi = {
  async createIntegration(data: Partial<CalendarIntegration>): Promise<CalendarIntegration> {
    const response = await apiFetch(`/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getIntegration(id: number): Promise<CalendarIntegration> {
    const response = await apiFetch(`/calendar/${id}`);
    return response.json();
  },

  async getInterviewerIntegrations(interviewerId: number): Promise<CalendarIntegration[]> {
    const response = await apiFetch(`/calendar/interviewer/${interviewerId}`);
    return response.json();
  },

  async updateIntegration(id: number, data: Partial<CalendarIntegration>): Promise<CalendarIntegration> {
    const response = await apiFetch(`/calendar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteIntegration(id: number): Promise<void> {
    await apiFetch(`/calendar/${id}`, { method: 'DELETE' });
  },

  async syncCalendar(id: number): Promise<any> {
    const response = await apiFetch(`/calendar/${id}/sync`, {
      method: 'POST',
    });
    return response.json();
  },
};
