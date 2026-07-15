import { dashboardRepository } from './dashboard.repository.js';

export class DashboardService {
  async getStats(candidateId: number) {
    return await dashboardRepository.getStats(candidateId);
  }

  async getOverview(candidateId: number) {
    const [stats, recentApplications, upcomingInterviews, unreadNotifications] = await Promise.all([
      dashboardRepository.getStats(candidateId),
      dashboardRepository.getRecentApplications(candidateId),
      dashboardRepository.getUpcomingInterviews(candidateId),
      dashboardRepository.getUnreadNotifications(candidateId),
    ]);

    return {
      stats,
      recentApplications,
      upcomingInterviews,
      unreadNotifications,
    };
  }
}

export const dashboardService = new DashboardService();
