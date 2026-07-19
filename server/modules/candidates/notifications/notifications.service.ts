import { notificationsRepository } from './notifications.repository.js';
import { MarkAsReadInput } from './notifications.schema.js';

export class NotificationsService {
  async list(candidateId: number) {
    return await notificationsRepository.findByCandidateId(candidateId);
  }

  async getUnreadCount(candidateId: number) {
    return await notificationsRepository.getUnreadCount(candidateId);
  }

  async markAsRead(ids: number[], candidateId: number) {
    await notificationsRepository.markAsRead(ids, candidateId);
  }

  async markAllAsRead(candidateId: number) {
    await notificationsRepository.markAllAsRead(candidateId);
  }

  async create(candidateId: number, data: { type: string; title: string; message: string; metadata?: any }) {
    return await notificationsRepository.create({
      candidateId,
      ...data,
      isRead: false,
      metadata: data.metadata || null,
    });
  }
}

export const notificationsService = new NotificationsService();
