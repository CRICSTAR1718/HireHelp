import { profileRepository } from './profile.repository.js';
import { UpdateProfileInput, ExperienceInput, EducationInput, SkillInput } from './profile.schema.js';
import { AppError } from '../../../common/middleware/error-handler.js';

export class ProfileService {
  async getProfile(candidateId: number) {
    return await profileRepository.findByCandidateId(candidateId);
  }

  async updateProfile(candidateId: number, data: UpdateProfileInput) {
    console.log('[Profile Service] Candidate ID:', candidateId);
    console.log('[Profile Service] Update payload:', data);

    const { fullName, phone, skills, portfolio, website, ...profileData } = data;

    if (skills !== undefined) {
      const normalizedSkills = skills.filter((skill) => skill && skill.trim());
      const hasDuplicates = normalizedSkills.length !== new Set(normalizedSkills.map((skill) => skill.toLowerCase())).size;

      if (hasDuplicates) {
        throw new AppError('Duplicate skills are not allowed', 409);
      }

      await profileRepository.updateSkills(candidateId, normalizedSkills);
    }

    if (fullName !== undefined || phone !== undefined) {
      await profileRepository.updateCandidateIdentity(candidateId, { fullName, phone });
    }

    const normalizedProfileData = {
      ...profileData,
      ...(portfolio !== undefined ? { website: portfolio } : {}),
      ...(website !== undefined ? { website } : {}),
    };

    return await profileRepository.updateProfile(candidateId, normalizedProfileData);
  }

  async uploadProfilePicture(candidateId: number, file: any) {
    console.log('[Profile Service] Uploading profile picture for candidate:', candidateId);

    // Cloudinary returns the URL in file.path after upload via multer-storage-cloudinary
    const cloudinaryUrl = file.path;

    await profileRepository.updateProfile(candidateId, { profilePictureUrl: cloudinaryUrl });

    console.log('[Profile Service] Profile picture uploaded:', cloudinaryUrl);
    return { profilePictureUrl: cloudinaryUrl, profileImage: cloudinaryUrl };
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
