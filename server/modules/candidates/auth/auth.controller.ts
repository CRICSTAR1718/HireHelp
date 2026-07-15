import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { RegisterInput, LoginInput } from './auth.schema.js';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const candidate = await authService.getProfile(req.candidateUser.id);
      res.status(200).json(candidate);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}

export const authController = new AuthController();
