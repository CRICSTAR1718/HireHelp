import { describe, it, expect, beforeEach } from '@jest/globals';
import { assignmentService } from './assignment.service';
import { assignmentRepository } from './assignment.repository';

jest.mock('./assignment.repository');

describe('AssignmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an assignment', async () => {
    const mockData = {
      interviewId: 'int-1',
      interviewerId: 1,
      candidateId: 'cand-1',
      role: 'Technical Interviewer',
    };
    
    const mockAssignment = { id: 1, ...mockData, status: 'pending', assignedAt: new Date() };
    
    jest.spyOn(assignmentRepository, 'create').mockResolvedValue(mockAssignment as any);
    
    const result = await assignmentService.createAssignment(mockData);
    expect(result).toEqual(mockAssignment);
  });

  it('should get assignment by id', async () => {
    const mockAssignment = { id: 1, interviewId: 'int-1', interviewerId: 1, candidateId: 'cand-1', role: 'Technical Interviewer', status: 'pending', assignedAt: new Date() };
    
    jest.spyOn(assignmentRepository, 'findById').mockResolvedValue(mockAssignment as any);
    
    const result = await assignmentService.getAssignment(1);
    expect(result).toEqual(mockAssignment);
  });
});
