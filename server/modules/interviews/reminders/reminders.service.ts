import { remindersRepository } from './reminders.repository';
import { CreateReminderInput, UpdateReminderInput } from './reminders.schema';

export class RemindersService {
  async createReminder(data: CreateReminderInput) {
    return remindersRepository.create(data);
  }

  async getReminder(id: number) {
    return remindersRepository.findById(id);
  }

  async getScheduleReminders(scheduleId: number) {
    return remindersRepository.findBySchedule(scheduleId);
  }

  async getPendingReminders() {
    return remindersRepository.findPending();
  }

  async updateReminder(id: number, data: UpdateReminderInput) {
    return remindersRepository.update(id, data);
  }

  async deleteReminder(id: number) {
    return remindersRepository.delete(id);
  }

  async markAsSent(id: number) {
    return remindersRepository.update(id, { status: 'sent', sentAt: new Date() });
  }
}

export const remindersService = new RemindersService();
