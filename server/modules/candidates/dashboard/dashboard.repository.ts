import { db } from '../../../database';
import { candidateApplications, interviewStatus, notifications } from '../../../database/schema';
import { eq, and, desc, count, sql } from 'drizzle-orm';

export class DashboardRepository {
  async getStats(candidateId: number) {
    const totalApps = await db.select({ count: count() })
      .from(candidateApplications)
      .where(eq(candidateApplications.candidateId, candidateId));
    
    const activeApps = await db.select({ count: count() })
      .from(candidateApplications)
      .where(and(
        eq(candidateApplications.candidateId, candidateId),
        sql`${candidateApplications.status} = 'applied' OR ${candidateApplications.status} = 'screening' OR ${candidateApplications.status} = 'interview'`
      ));
    
    const interviews = await db.select({ count: count() })
      .from(interviewStatus)
      .where(and(
        eq(interviewStatus.candidateId, candidateId),
        eq(interviewStatus.status, 'scheduled')
      ));
    
    const offers = await db.select({ count: count() })
      .from(candidateApplications)
      .where(and(
        eq(candidateApplications.candidateId, candidateId),
        eq(candidateApplications.status, 'offer')
      ));

    return {
      totalApplications: totalApps[0]?.count || 0,
      activeApplications: activeApps[0]?.count || 0,
      interviewsScheduled: interviews[0]?.count || 0,
      offersReceived: offers[0]?.count || 0,
    };
  }

  async getRecentApplications(candidateId: number, limit = 5) {
    return await db.select()
      .from(candidateApplications)
      .where(eq(candidateApplications.candidateId, candidateId))
      .orderBy(desc(candidateApplications.appliedAt))
      .limit(limit);
  }

  async getUpcomingInterviews(candidateId: number, limit = 5) {
    return await db.select()
      .from(interviewStatus)
      .where(and(
        eq(interviewStatus.candidateId, candidateId),
        eq(interviewStatus.status, 'scheduled'),
        sql`${interviewStatus.scheduledAt} >= NOW()`
      ))
      .orderBy(interviewStatus.scheduledAt)
      .limit(limit);
  }

  async getUnreadNotifications(candidateId: number, limit = 5) {
    return await db.select()
      .from(notifications)
      .where(and(
        eq(notifications.candidateId, candidateId),
        eq(notifications.isRead, false)
      ))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }
}

export const dashboardRepository = new DashboardRepository();
