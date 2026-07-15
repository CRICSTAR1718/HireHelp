import { describe, it, expect, beforeEach } from '@jest/globals';
import { schedulingService } from './scheduling.service';
import { schedulingRepository } from './scheduling.repository';

jest.mock('./scheduling.repository');

describe('SchedulingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a schedule', async () => {
    const mockData = {
      assignmentId: 1,
      startTime: new Date('2024-01-01T10:00:00Z'),
      endTime: new Date('2024-01-01T11:00:00Z'),
      status: 'scheduled',
    };
    
    const mockSchedule = { id: 1, ...mockData, createdAt: new Date(), updatedAt: new Date() };
    
    jest.spyOn(schedulingRepository, 'create').mockResolvedValue(mockSchedule as any);
    
    const result = await schedulingService.createSchedule(mockData);
    expect(result).toEqual(mockSchedule);
  });

  it('should get schedule by id', async () => {
    const mockSchedule = { id: 1, assignmentId: 1, startTime: new Date(), endTime: new Date(), status: 'scheduled', createdAt: new Date(), updatedAt: new Date() };
    
    jest.spyOn(schedulingRepository, 'findById').mockResolvedValue(mockSchedule as any);
    
    const result = await schedulingService.getSchedule(1);
    expect(result).toEqual(mockSchedule);
  });
});
