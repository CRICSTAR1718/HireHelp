import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { notificationsService } from './notifications.service';
import { notificationsRepository } from './notifications.repository';

const mockNotificationsRepository = {
  findByCandidateId: jest.fn() as any,
  findById: jest.fn() as any,
  create: jest.fn() as any,
  markAsRead: jest.fn() as any,
  markAllAsRead: jest.fn() as any,
  getUnreadCount: jest.fn() as any,
};

jest.mock('./notifications.repository', () => ({
  notificationsRepository: mockNotificationsRepository,
}));

describe('NotificationsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return candidate notifications', async () => {
      const mockNotifications = [{ id: 1, candidateId: 1, title: 'Test' }];
      (mockNotificationsRepository.findByCandidateId as any).mockResolvedValue(mockNotifications);
      
      const result = await notificationsService.list(1);
      expect(result).toEqual(mockNotifications);
    });
  });
});
