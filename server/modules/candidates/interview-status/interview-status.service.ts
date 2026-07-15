import { interviewStatusRepository } from './interview-status.repository.js';
import { UpdateInterviewStatusInput } from './interview-status.schema.js';

export class InterviewStatusService {
  async list(candidateId: number) {
    return await interviewStatusRepository.findByCandidateId(candidateId);
  }

  async getById(id: number, candidateId: number) {
    const interview = await interviewStatusRepository.findById(id);
    if (!interview || interview.candidateId !== candidateId) {
      throw new Error('Interview not found');
    }
    return interview;
  }

  async update(id: number, candidateId: number, data: UpdateInterviewStatusInput) {
    return await interviewStatusRepository.update(id, candidateId, data);
  }
}

export const interviewStatusService = new InterviewStatusService();
