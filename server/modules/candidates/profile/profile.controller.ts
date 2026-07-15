import { Request, Response } from 'express';
import { profileService } from './profile.service.js';
import { UpdateProfileInput, ExperienceInput, EducationInput, SkillInput } from './profile.schema.js';

export class ProfileController {
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const profile = await profileService.getProfile(req.candidateUser.id);
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data: UpdateProfileInput = req.body;
      const profile = await profileService.updateProfile(req.candidateUser.id, data);
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async addExperience(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data: ExperienceInput = req.body;
      const experience = await profileService.addExperience(req.candidateUser.id, data);
      res.status(201).json(experience);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async addEducation(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data: EducationInput = req.body;
      const education = await profileService.addEducation(req.candidateUser.id, data);
      res.status(201).json(education);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async addSkill(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data: SkillInput = req.body;
      const skill = await profileService.addSkill(req.candidateUser.id, data);
      res.status(201).json(skill);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const profileController = new ProfileController();
