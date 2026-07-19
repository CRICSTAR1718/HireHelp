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

  async assignAndSchedule(req: Request, res: Response) {
    try {
      const result = await assignmentService.assignAndSchedule(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error('[Assignment Controller] assignAndSchedule failed:', error);
      res.status(500).json({ error: 'Failed to assign interviewer and schedule interview' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const assignments = await assignmentService.getAllAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get assignments' });
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
      // Get interviewer ID from authenticated user or route param
      const interviewerId = req.params.interviewerId 
        ? parseInt(req.params.interviewerId)
        : await this.getInterviewerIdFromUser(req.user?.userId);
      
      const assignments = await assignmentService.getInterviewerAssignments(interviewerId);
      res.json(assignments);
    } catch (error) {
      console.error('[Assignment Controller] getByInterviewer failed:', error);
      console.error('[Assignment Controller] User ID:', req.user?.userId);
      console.error('[Assignment Controller] Route param interviewerId:', req.params.interviewerId);
      // Return empty array if interviewer not found or other error
      res.json([]);
    }
  }

  private async getInterviewerIdFromUser(userId?: string): Promise<number> {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    console.log('[Assignment Controller] Looking up interviewer for user ID:', userId);
    
    // Get interviewer ID from users table
    const { interviewerRepository } = await import('../interviewer/interviewer.repository');
    const interviewer = await interviewerRepository.findByUserId(userId);
    
    console.log('[Assignment Controller] Found interviewer:', interviewer);
    
    if (!interviewer) {
      throw new Error('Interviewer not found for user');
    }
    
    return interviewer.id;
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
