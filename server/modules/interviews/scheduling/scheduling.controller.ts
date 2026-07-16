import { Request, Response } from 'express';
import { schedulingService } from './scheduling.service';

export class SchedulingController {
  async create(req: Request, res: Response) {
    try {
      const schedule = await schedulingService.createSchedule(req.body);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  }

  async createInterviewSchedule(req: Request, res: Response) {
    try {
      const result = await schedulingService.createInterviewSchedule(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create interview schedule' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const schedule = await schedulingService.getSchedule(id);
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get schedule' });
    }
  }

  async getByAssignment(req: Request, res: Response) {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const schedules = await schedulingService.getAssignmentSchedules(assignmentId);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get schedules' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const schedule = await schedulingService.updateSchedule(id, req.body);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await schedulingService.deleteSchedule(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete schedule' });
    }
  }

  async sendInvitation(req: Request, res: Response) {
    try {
      const scheduleId = parseInt(req.params.id);
      const { interviewerId, candidateEmail, candidateName, interviewerEmail, interviewerName } = req.body;
      
      const updatedSchedule = await schedulingService.sendInvitation(
        scheduleId,
        interviewerId,
        candidateEmail,
        candidateName,
        interviewerEmail,
        interviewerName
      );
      
      res.json(updatedSchedule);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to send invitation' });
    }
  }

  async getUpcoming(req: Request, res: Response) {
    try {
      const candidateId = req.params.candidateId;
      const interviews = await schedulingService.getUpcomingInterviews(candidateId);
      res.json(interviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get upcoming interviews' });
    }
  }
}

export const schedulingController = new SchedulingController();
