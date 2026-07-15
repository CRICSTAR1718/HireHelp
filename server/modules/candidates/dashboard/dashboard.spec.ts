import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { dashboardService } from './dashboard.service';
import { dashboardRepository } from './dashboard.repository';

const mockDashboardRepository = {
  getStats: jest.fn() as any,
  getRecentApplications: jest.fn() as any,
  getUpcomingInterviews: jest.fn() as any,
  getUnreadNotifications: jest.fn() as any,
};

jest.mock('./dashboard.repository', () => ({
  dashboardRepository: mockDashboardRepository,
}));

describe('DashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return dashboard statistics', async () => {
      const mockStats = {
        totalApplications: 10,
        activeApplications: 5,
        interviewsScheduled: 2,
        offersReceived: 1,
      };
      (mockDashboardRepository.getStats as any).mockResolvedValue(mockStats);
      
      const result = await dashboardService.getStats(1);
      expect(result).toEqual(mockStats);
    });
  });
});
