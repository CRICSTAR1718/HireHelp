import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service.js';

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const stats = await dashboardService.getStats(req.candidateUser.id);
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOverview(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const overview = await dashboardService.getOverview(req.candidateUser.id);
      res.status(200).json(overview);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const dashboardController = new DashboardController();
