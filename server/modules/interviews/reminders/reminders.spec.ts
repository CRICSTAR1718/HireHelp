import { describe, it, expect, beforeEach } from '@jest/globals';
import { remindersService } from './reminders.service';
import { remindersRepository } from './reminders.repository';

jest.mock('./reminders.repository');

describe('RemindersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a reminder', async () => {
    const mockData = {
      scheduleId: 1,
      recipientId: 'user-1',
      recipientType: 'interviewer',
      scheduledFor: new Date('2024-01-01T09:00:00Z'),
      status: 'pending',
    };
    
    const mockReminder = { id: 1, ...mockData, sentAt: null, createdAt: new Date() };
    
    jest.spyOn(remindersRepository, 'create').mockResolvedValue(mockReminder as any);
    
    const result = await remindersService.createReminder(mockData);
    expect(result).toEqual(mockReminder);
  });
});
