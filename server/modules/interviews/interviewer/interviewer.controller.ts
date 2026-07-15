import { Request, Response } from 'express';
import { interviewerService } from './interviewer.service';

export class InterviewerController {
  async create(req: Request, res: Response) {
    try {
      const interviewer = await interviewerService.createInterviewer(req.body);
      res.status(201).json(interviewer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create interviewer' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const interviewer = await interviewerService.getInterviewer(id);
      if (!interviewer) {
        return res.status(404).json({ error: 'Interviewer not found' });
      }
      res.json(interviewer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get interviewer' });
    }
  }

  async getByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const interviewer = await interviewerService.getInterviewerByUserId(userId);
      if (!interviewer) {
        return res.status(404).json({ error: 'Interviewer not found' });
      }
      res.json(interviewer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get interviewer' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const interviewers = await interviewerService.getAllInterviewers();
      res.json(interviewers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get interviewers' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const interviewer = await interviewerService.updateInterviewer(id, req.body);
      res.json(interviewer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update interviewer' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await interviewerService.deleteInterviewer(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete interviewer' });
    }
  }
}

export const interviewerController = new InterviewerController();
