import { calendarRepository } from './calendar.repository';
import { CreateCalendarIntegrationInput, UpdateCalendarIntegrationInput } from './calendar.schema';

export class CalendarService {
  async createIntegration(data: CreateCalendarIntegrationInput) {
    return calendarRepository.create(data);
  }

  async getIntegration(id: number) {
    return calendarRepository.findById(id);
  }

  async getInterviewerIntegrations(interviewerId: number) {
    return calendarRepository.findByInterviewer(interviewerId);
  }

  async updateIntegration(id: number, data: UpdateCalendarIntegrationInput) {
    return calendarRepository.update(id, data);
  }

  async deleteIntegration(id: number) {
    return calendarRepository.delete(id);
  }

  async syncCalendar(integrationId: number) {
    const integration = await calendarRepository.findById(integrationId);
    if (!integration || !integration.syncEnabled) {
      throw new Error('Integration not found or sync disabled');
    }
    await calendarRepository.update(integrationId, { lastSyncedAt: new Date() });
    return { success: true, lastSyncedAt: new Date() };
  }
}

export const calendarService = new CalendarService();
