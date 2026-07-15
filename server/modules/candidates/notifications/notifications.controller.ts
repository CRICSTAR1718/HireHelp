import { Request, Response } from 'express';
import { notificationsService } from './notifications.service.js';
import { MarkAsReadInput } from './notifications.schema.js';

export class NotificationsController {
  async list(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const notifications = await notificationsService.list(req.candidateUser.id);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const count = await notificationsService.getUnreadCount(req.candidateUser.id);
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data: MarkAsReadInput = req.body;
      await notificationsService.markAsRead(data.notificationIds, req.candidateUser.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await notificationsService.markAllAsRead(req.candidateUser.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const notificationsController = new NotificationsController();
