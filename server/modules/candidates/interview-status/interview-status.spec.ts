import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { interviewStatusService } from './interview-status.service';
import { interviewStatusRepository } from './interview-status.repository';

const mockInterviewStatusRepository = {
  findByCandidateId: jest.fn() as any,
  findById: jest.fn() as any,
  findByApplicationId: jest.fn() as any,
  create: jest.fn() as any,
  update: jest.fn() as any,
};

jest.mock('./interview-status.repository', () => ({
  interviewStatusRepository: mockInterviewStatusRepository,
}));

describe('InterviewStatusService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return candidate interview statuses', async () => {
      const mockInterviews = [{ id: 1, candidateId: 1, status: 'scheduled' }];
      (mockInterviewStatusRepository.findByCandidateId as any).mockResolvedValue(mockInterviews);
      
      const result = await interviewStatusService.list(1);
      expect(result).toEqual(mockInterviews);
    });
  });
});
