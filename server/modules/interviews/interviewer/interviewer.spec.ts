import { describe, it, expect, beforeEach } from '@jest/globals';
import { interviewerService } from './interviewer.service';
import { interviewerRepository } from './interviewer.repository';

jest.mock('./interviewer.repository');

describe('InterviewerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an interviewer', async () => {
    const mockData = {
      userId: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      expertise: ['JavaScript', 'React'],
    };
    
    const mockInterviewer = { id: 1, ...mockData, availability: null, createdAt: new Date(), updatedAt: new Date() };
    
    jest.spyOn(interviewerRepository, 'create').mockResolvedValue(mockInterviewer as any);
    
    const result = await interviewerService.createInterviewer(mockData);
    expect(result).toEqual(mockInterviewer);
  });
});
