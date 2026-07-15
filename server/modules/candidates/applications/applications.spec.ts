import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { applicationsService } from './applications.service';
import { applicationsRepository } from './applications.repository';

const mockApplicationsRepository = {
  findByCandidateId: jest.fn() as any,
  findById: jest.fn() as any,
  create: jest.fn() as any,
  updateStatus: jest.fn() as any,
};

jest.mock('./applications.repository', () => ({
  applicationsRepository: mockApplicationsRepository,
}));

describe('ApplicationsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return candidate candidateApplications', async () => {
      const mockApplications = [{ id: 1, candidateId: 1, jobId: 'job-1' }];
      (mockApplicationsRepository.findByCandidateId as any).mockResolvedValue(mockApplications);
      
      const result = await applicationsService.list(1);
      expect(result).toEqual(mockApplications);
    });
  });
});
