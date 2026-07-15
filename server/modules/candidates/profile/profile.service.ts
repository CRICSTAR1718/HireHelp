import { profileRepository } from './profile.repository.js';
import { UpdateProfileInput, ExperienceInput, EducationInput, SkillInput } from './profile.schema.js';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { AppError } from '../../../common/middleware/error-handler.js';

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true,
});

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

    const key = `profile-pictures/${candidateId}/${randomUUID()}-${file.originalname}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const s3Url = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;

    await profileRepository.updateProfile(candidateId, { profilePictureUrl: s3Url });

    console.log('[Profile Service] Profile picture uploaded:', s3Url);
    return { profilePictureUrl: s3Url, profileImage: s3Url };
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
