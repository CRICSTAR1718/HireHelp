import { interviewerRepository } from './interviewer.repository';
import { CreateInterviewerInput, UpdateInterviewerInput } from './interviewer.schema';

export class InterviewerService {
  async createInterviewer(data: CreateInterviewerInput) {
    return interviewerRepository.create(data);
  }

  async getInterviewer(id: number) {
    return interviewerRepository.findById(id);
  }

  async getInterviewerByUserId(userId: string) {
    return interviewerRepository.findByUserId(userId);
  }

  async getAllInterviewers() {
    return interviewerRepository.findAll();
  }

  async getAvailableInterviewers() {
    // For now, return all interviewers as available
    // In the future, this could filter by availability/schedule
    return interviewerRepository.findAll();
  }

  async updateInterviewer(id: number, data: UpdateInterviewerInput) {
    return interviewerRepository.update(id, data);
  }

  async deleteInterviewer(id: number) {
    return interviewerRepository.delete(id);
  }
}

export const interviewerService = new InterviewerService();
