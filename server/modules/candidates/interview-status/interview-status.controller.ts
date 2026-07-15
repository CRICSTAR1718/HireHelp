import { Request, Response } from 'express';
import { interviewStatusService } from './interview-status.service.js';
import { UpdateInterviewStatusInput } from './interview-status.schema.js';

export class InterviewStatusController {
  async list(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const interviews = await interviewStatusService.list(req.candidateUser.id);
      res.status(200).json(interviews);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { id } = req.params;
      const interview = await interviewStatusService.getById(parseInt(id), req.candidateUser.id);
      res.status(200).json(interview);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { id } = req.params;
      const data: UpdateInterviewStatusInput = req.body;
      const interview = await interviewStatusService.update(parseInt(id), req.candidateUser.id, data);
      res.status(200).json(interview);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const interviewStatusController = new InterviewStatusController();
