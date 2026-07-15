import { Request, Response } from 'express';
import { feedbackService } from './feedback.service';

export class FeedbackController {
  async create(req: Request, res: Response) {
    try {
      const feedback = await feedbackService.createFeedback(req.body);
      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create feedback' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const feedback = await feedbackService.getFeedback(id);
      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get feedback' });
    }
  }

  async getByAssignment(req: Request, res: Response) {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const feedbackList = await feedbackService.getAssignmentFeedback(assignmentId);
      res.json(feedbackList);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get feedback' });
    }
  }

  async getByInterviewer(req: Request, res: Response) {
    try {
      const interviewerId = parseInt(req.params.interviewerId);
      const feedbackList = await feedbackService.getInterviewerFeedback(interviewerId);
      res.json(feedbackList);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get feedback' });
    }
  }
}

export const feedbackController = new FeedbackController();
