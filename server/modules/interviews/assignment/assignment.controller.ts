import { Request, Response } from 'express';
import { assignmentService } from './assignment.service';

export class AssignmentController {
  async create(req: Request, res: Response) {
    try {
      const assignment = await assignmentService.createAssignment(req.body);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create assignment' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const assignment = await assignmentService.getAssignment(id);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get assignment' });
    }
  }

  async getByInterviewer(req: Request, res: Response) {
    try {
      const interviewerId = parseInt(req.params.interviewerId);
      const assignments = await assignmentService.getInterviewerAssignments(interviewerId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get assignments' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const assignment = await assignmentService.updateAssignment(id, req.body);
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update assignment' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await assignmentService.deleteAssignment(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete assignment' });
    }
  }
}

export const assignmentController = new AssignmentController();
