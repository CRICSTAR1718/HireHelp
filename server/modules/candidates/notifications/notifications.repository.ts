import { db } from '../../../database';
import { notifications } from '../../../database/schema';
import { eq, and, desc, inArray, sql } from 'drizzle-orm';
import { NewNotification } from '../../../database/schema';

export class NotificationsRepository {
  async findByCandidateId(candidateId: number, limit = 20) {
    return await db.select()
      .from(notifications)
      .where(eq(notifications.candidateId, candidateId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async findById(id: number) {
    const result = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1);
    return result[0];
  }

  async create(data: Omit<NewNotification, 'id' | 'createdAt'>) {
    const result = await db.insert(notifications).values({
      ...data,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async markAsRead(ids: number[], candidateId: number) {
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(
        inArray(notifications.id, ids),
        eq(notifications.candidateId, candidateId)
      ));
  }

  async markAllAsRead(candidateId: number) {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.candidateId, candidateId));
  }

  async getUnreadCount(candidateId: number) {
    const result = await db.select({ count: sql`count(*)` })
      .from(notifications)
      .where(and(
        eq(notifications.candidateId, candidateId),
        eq(notifications.isRead, false)
      ));
    return result[0]?.count || 0;
  }
}

export const notificationsRepository = new NotificationsRepository();
