import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { profileService } from './profile.service';
import { profileRepository } from './profile.repository';

const mockProfileRepository = {
  findByCandidateId: jest.fn() as any,
  updateProfile: jest.fn() as any,
  addExperience: jest.fn() as any,
  addEducation: jest.fn() as any,
  addSkill: jest.fn() as any,
};

jest.mock('./profile.repository', () => ({
  profileRepository: mockProfileRepository,
}));

describe('ProfileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return candidate profile', async () => {
      const mockProfile = {
        profile: { id: 1, candidateId: 1, headline: 'Developer' },
        experiences: [],
        education: [],
        skills: [],
      };
      
      (mockProfileRepository.findByCandidateId as any).mockResolvedValue(mockProfile);
      
      const result = await profileService.getProfile(1);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update profile', async () => {
      const mockProfile = { id: 1, candidateId: 1, headline: 'Senior Developer' };
      (mockProfileRepository.updateProfile as any).mockResolvedValue(mockProfile);
      
      const result = await profileService.updateProfile(1, { headline: 'Senior Developer' });
      expect(result.headline).toBe('Senior Developer');
    });
  });
});
