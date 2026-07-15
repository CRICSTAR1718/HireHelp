import { describe, it, expect, beforeEach } from '@jest/globals';
import { feedbackService } from './feedback.service';
import { feedbackRepository } from './feedback.repository';

jest.mock('./feedback.repository');

describe('FeedbackService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create feedback', async () => {
    const mockData = {
      assignmentId: 1,
      interviewerId: 1,
      ratings: [{ competency: 'Technical Skills', score: 4 }],
      overallScore: 4,
      recommendation: 'Hire',
    };
    
    const mockFeedback = { id: 1, ...mockData, submittedAt: new Date() };
    
    jest.spyOn(feedbackRepository, 'create').mockResolvedValue(mockFeedback as any);
    
    const result = await feedbackService.createFeedback(mockData);
    expect(result).toEqual(mockFeedback);
  });
});
