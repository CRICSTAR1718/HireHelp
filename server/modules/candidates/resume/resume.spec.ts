import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { resumeService } from './resume.service';
import { resumeRepository } from './resume.repository';

const mockResumeRepository = {
  findByCandidateId: jest.fn() as any,
  create: jest.fn() as any,
  deactivate: jest.fn() as any,
};

jest.mock('./resume.repository', () => ({
  resumeRepository: mockResumeRepository,
}));

jest.mock('../events/kafka-producer', () => ({
  publishResumeUploaded: jest.fn() as any,
}));

describe('ResumeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return candidate resumes', async () => {
      const mockResumes = [{ id: 1, candidateId: 1, originalFileName: 'resume.pdf' }];
      (mockResumeRepository.findByCandidateId as any).mockResolvedValue(mockResumes);
      
      const result = await resumeService.list(1);
      expect(result).toEqual(mockResumes);
    });
  });
});
