import { Request, Response } from 'express';
import { settingsService } from './settings.service.js';

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const settings = await settingsService.getSettings(req.candidateUser.id);
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateEmailPreferences(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const preferences = req.body;
      const result = await settingsService.updateEmailPreferences(req.candidateUser.id, preferences);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updatePrivacySettings(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const settings = req.body;
      const result = await settingsService.updatePrivacySettings(req.candidateUser.id, settings);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const result = await settingsService.deleteAccount(req.candidateUser.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const settingsController = new SettingsController();
