import { describe, it, expect, beforeEach } from '@jest/globals';
import { calendarService } from './calendar.service';
import { calendarRepository } from './calendar.repository';

jest.mock('./calendar.repository');

describe('CalendarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a calendar integration', async () => {
    const mockData = {
      interviewerId: 1,
      provider: 'google',
      accessToken: 'token123',
      syncEnabled: true,
    };
    
    const mockIntegration = { id: 1, ...mockData, createdAt: new Date(), updatedAt: new Date() };
    
    jest.spyOn(calendarRepository, 'create').mockResolvedValue(mockIntegration as any);
    
    const result = await calendarService.createIntegration(mockData);
    expect(result).toEqual(mockIntegration);
  });
});
