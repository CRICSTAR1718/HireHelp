import { Request, Response } from 'express';
import { remindersService } from './reminders.service';

export class RemindersController {
  async create(req: Request, res: Response) {
    try {
      const reminder = await remindersService.createReminder(req.body);
      res.status(201).json(reminder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create reminder' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const reminder = await remindersService.getReminder(id);
      if (!reminder) {
        return res.status(404).json({ error: 'Reminder not found' });
      }
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get reminder' });
    }
  }

  async getBySchedule(req: Request, res: Response) {
    try {
      const scheduleId = parseInt(req.params.scheduleId);
      const reminders = await remindersService.getScheduleReminders(scheduleId);
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get reminders' });
    }
  }

  async getPending(req: Request, res: Response) {
    try {
      const reminders = await remindersService.getPendingReminders();
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get pending reminders' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const reminder = await remindersService.updateReminder(id, req.body);
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reminder' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await remindersService.deleteReminder(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reminder' });
    }
  }

  async markAsSent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const reminder = await remindersService.markAsSent(id);
      res.json(reminder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark reminder as sent' });
    }
  }
}

export const remindersController = new RemindersController();
