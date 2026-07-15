import { profileRepository } from './profile.repository.js';
import { UpdateProfileInput, ExperienceInput, EducationInput, SkillInput } from './profile.schema.js';

export class ProfileService {
  async getProfile(candidateId: number) {
    return await profileRepository.findByCandidateId(candidateId);
  }

  async updateProfile(candidateId: number, data: UpdateProfileInput) {
    return await profileRepository.updateProfile(candidateId, data);
  }

  async addExperience(candidateId: number, data: ExperienceInput) {
    return await profileRepository.addExperience(candidateId, {
      company: data.company,
      title: data.title,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current,
      description: data.description || null,
    });
  }

  async addEducation(candidateId: number, data: EducationInput) {
    return await profileRepository.addEducation(candidateId, {
      institution: data.institution,
      degree: data.degree,
      field: data.field || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      description: data.description || null,
    });
  }

  async addSkill(candidateId: number, data: SkillInput) {
    return await profileRepository.addSkill(candidateId, {
      name: data.name,
      level: data.level,
    });
  }
}

export const profileService = new ProfileService();
