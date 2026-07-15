import { Request, Response } from 'express';
import { meetingLinksService } from './meeting-links.service';

export class MeetingLinksController {
  async create(req: Request, res: Response) {
    try {
      const meetingLink = await meetingLinksService.createMeetingLink(req.body);
      res.status(201).json(meetingLink);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create meeting link' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const meetingLink = await meetingLinksService.getMeetingLink(id);
      if (!meetingLink) {
        return res.status(404).json({ error: 'Meeting link not found' });
      }
      res.json(meetingLink);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get meeting link' });
    }
  }

  async getBySchedule(req: Request, res: Response) {
    try {
      const scheduleId = parseInt(req.params.scheduleId);
      const meetingLinks = await meetingLinksService.getScheduleMeetingLinks(scheduleId);
      res.json(meetingLinks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get meeting links' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await meetingLinksService.deleteMeetingLink(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete meeting link' });
    }
  }
}

export const meetingLinksController = new MeetingLinksController();
