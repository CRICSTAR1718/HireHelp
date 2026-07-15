import { Request, Response } from 'express';
import { calendarService } from './calendar.service';

export class CalendarController {
  async create(req: Request, res: Response) {
    try {
      const integration = await calendarService.createIntegration(req.body);
      res.status(201).json(integration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create calendar integration' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const integration = await calendarService.getIntegration(id);
      if (!integration) {
        return res.status(404).json({ error: 'Integration not found' });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get integration' });
    }
  }

  async getByInterviewer(req: Request, res: Response) {
    try {
      const interviewerId = parseInt(req.params.interviewerId);
      const integrations = await calendarService.getInterviewerIntegrations(interviewerId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get integrations' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const integration = await calendarService.updateIntegration(id, req.body);
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update integration' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await calendarService.deleteIntegration(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete integration' });
    }
  }

  async sync(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await calendarService.syncCalendar(id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to sync calendar' });
    }
  }
}

export const calendarController = new CalendarController();
