import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { profileService } from './profile.service';
import { profileRepository } from './profile.repository';

const mockProfileRepository = {
  findByCandidateId: jest.fn(),
  updateProfile: jest.fn(),
  updateCandidateIdentity: jest.fn(),
  addExperience: jest.fn(),
  addEducation: jest.fn(),
  addSkill: jest.fn(),
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
      
      mockProfileRepository.findByCandidateId.mockResolvedValue(mockProfile);
      
      const result = await profileService.getProfile(1);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update profile', async () => {
      const mockProfile = { id: 1, candidateId: 1, headline: 'Senior Developer' };
      mockProfileRepository.updateProfile.mockResolvedValue(mockProfile);
      
      const result = await profileService.updateProfile(1, { headline: 'Senior Developer' });
      expect(result.headline).toBe('Senior Developer');
    });

    it('maps full name and portfolio into the correct persistence fields', async () => {
      const mockProfile = { id: 1, candidateId: 1, headline: 'Senior Developer' };
      mockProfileRepository.updateProfile.mockResolvedValue(mockProfile);

      await profileService.updateProfile(1, {
        fullName: 'Jane Doe',
        headline: 'Senior Developer',
        portfolio: 'https://janedoe.dev',
      });

      expect(mockProfileRepository.updateCandidateIdentity).toHaveBeenCalledWith(1, { fullName: 'Jane Doe', phone: undefined });
      expect(mockProfileRepository.updateProfile).toHaveBeenCalledWith(1, {
        headline: 'Senior Developer',
        website: 'https://janedoe.dev',
      });
    });
  });
});
