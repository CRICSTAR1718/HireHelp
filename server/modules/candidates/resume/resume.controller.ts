import { Request, Response } from 'express';
import { resumeService } from './resume.service.js';

// CHANGED: this used to also redeclare `user?: { id: number; email: string }`
// here, which globally collided with staff auth.ts's `user?: JwtPayload`
// augmentation once both live in one TS project — caught by `tsc` during the
// merge dry-run. req.candidateUser is already declared globally and
// correctly in common/middleware/candidate-auth.ts; only `file` (multer)
// needs declaring here.
declare global {
  namespace Express {
    interface Request {
      file?: any;
    }
  }
}

export class ResumeController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const resume = await resumeService.upload(req.candidateUser.id, req.file);
      res.status(201).json(resume);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const resumes = await resumeService.list(req.candidateUser.id);
      res.status(200).json(resumes);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { id } = req.params;
      await resumeService.delete(parseInt(id), req.candidateUser.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const resumeController = new ResumeController();
