import { Request, Response } from 'express';
import { profileService } from './profile.service.js';
import { UpdateProfileInput, ExperienceInput, EducationInput, SkillInput } from './profile.schema.js';
import { db } from '../../../database';
import { candidates } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '../../../common/middleware/error-handler.js';
import { resumeRepository } from '../resume/resume.repository.js';

declare global {
  namespace Express {
    interface Request {
      file?: any;
    }
  }
}

const formatDateValue = (value: Date | string | null | undefined) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
};

export class ProfileController {
  async getAllCandidates(req: Request, res: Response) {
    try {
      const candidatesData = await db.select().from(candidates).where(eq(candidates.isActive, true));
      const candidatesWithProfiles = await Promise.all(
        candidatesData.map(async (candidate) => {
          const profileData = await profileService.getProfile(candidate.id);
          return {
            id: candidate.uuid || candidate.id.toString(), // Use UUID if available, else serial ID as string
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            profile: profileData?.profile || null,
          };
        })
      );
      res.json(candidatesWithProfiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get candidates' });
    }
  }

  private buildProfileResponse(candidate: any, profileData: any, resume: any) {
    const profile = profileData?.profile;
    const profilePictureUrl = profile?.profilePictureUrl || null;
    const headline = profile?.headline || '';
    const summary = profile?.summary || '';
    const website = profile?.website || '';

    return {
      profile: {
        id: profile?.id?.toString() || candidate?.id?.toString() || '',
        userId: candidate?.id?.toString() || '',
        fullName: `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim(),
        email: candidate?.email || '',
        phone: candidate?.phone || '',
        location: profile?.location || '',
        headline,
        summary,
        linkedin: profile?.linkedin || '',
        github: profile?.github || '',
        portfolio: website,
        profilePictureUrl,
      },
      skills: profileData?.skills?.map((skill: any) => skill.name) || [],
      education: (profileData?.education || []).map((item: any) => ({
        id: item.id?.toString() || '',
        school: item.institution || '',
        degree: item.degree || '',
        field: item.field || '',
        startDate: formatDateValue(item.startDate),
        endDate: formatDateValue(item.endDate),
        description: item.description || '',
      })),
      experience: (profileData?.experiences || []).map((item: any) => ({
        id: item.id?.toString() || '',
        company: item.company || '',
        role: item.title || '',
        startDate: formatDateValue(item.startDate),
        endDate: formatDateValue(item.endDate),
        description: item.description || '',
      })),
      socialLinks: {
        linkedin: profile?.linkedin || '',
        github: profile?.github || '',
        website,
      },
      profileImage: profilePictureUrl,
      resume: resume || null,
    };
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      console.log('[Profile Controller] Authenticated user:', req.candidateUser.email);
      console.log('[Profile Controller] Candidate ID:', req.candidateUser.id);

      const candidateData = await db.select().from(candidates).where(eq(candidates.id, req.candidateUser.id)).limit(1);
      const candidate = candidateData[0];

      if (!candidate) {
        throw new AppError('Candidate Not Found', 404);
      }

      const profileData = await profileService.getProfile(req.candidateUser.id);
      console.log('[Profile Controller] Returned profile data:', profileData);

      // If profile doesn't exist yet, return a default profile built from candidate data
      // This is a normal state for newly registered candidates
      if (!profileData.profile) {
        const resume = (await resumeRepository.findByCandidateId(req.candidateUser.id))[0] || null;
        const responsePayload = this.buildProfileResponse(candidate, { profile: null, skills: [], education: [], experiences: [] }, resume);
        console.log('[Profile Controller] Returned default profile payload:', responsePayload);
        return res.status(200).json(responsePayload);
      }

      const resume = (await resumeRepository.findByCandidateId(req.candidateUser.id))[0] || null;
      const responsePayload = this.buildProfileResponse(candidate, profileData, resume);
      console.log('[Profile Controller] Returned profile payload:', responsePayload);
      res.status(200).json(responsePayload);
    } catch (error) {
      console.error('[Profile Controller] Error getting profile:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async uploadProfilePicture(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'Validation Error' });
      }

      console.log('[Profile Controller] Authenticated user:', req.candidateUser.email);
      console.log('[Profile Controller] Candidate ID:', req.candidateUser.id);
      const result = await profileService.uploadProfilePicture(req.candidateUser.id, req.file);
      res.status(200).json(result);
    } catch (error) {
      console.error('[Profile Controller] Error uploading profile picture:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.candidateUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const data: UpdateProfileInput = req.body;
      console.log('[Profile Controller] Authenticated user:', req.candidateUser.email);
      console.log('[Profile Controller] Candidate ID:', req.candidateUser.id);
      console.log('[Profile Controller] Update payload:', data);

      const candidateData = await db.select().from(candidates).where(eq(candidates.id, req.candidateUser.id)).limit(1);
      const candidate = candidateData[0];

      if (!candidate) {
        throw new AppError('Profile Not Found', 404);
      }

      const profileData = {
        ...data,
        website: data.portfolio || data.website,
      };

      const updatedProfile = await profileService.updateProfile(req.candidateUser.id, profileData);
      console.log('[Profile Controller] Updated profile record:', updatedProfile);

      const fullProfileData = await profileService.getProfile(req.candidateUser.id);
      const resume = (await resumeRepository.findByCandidateId(req.candidateUser.id))[0] || null;
      const responsePayload = this.buildProfileResponse(candidate, fullProfileData, resume);
      console.log('[Profile Controller] Returned profile payload:', responsePayload);
      res.status(200).json(responsePayload);
    } catch (error) {
      console.error('[Profile Controller] Error updating profile:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
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
      console.error('[Profile Controller] Error adding experience:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
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
      console.error('[Profile Controller] Error adding education:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
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
      console.error('[Profile Controller] Error adding skill:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const profileController = new ProfileController();
