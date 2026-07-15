import { feedbackRepository } from './feedback.repository';
import { CreateFeedbackInput } from './feedback.schema';

export class FeedbackService {
  async createFeedback(data: CreateFeedbackInput) {
    return feedbackRepository.create(data);
  }

  async getFeedback(id: number) {
    return feedbackRepository.findById(id);
  }

  async getAssignmentFeedback(assignmentId: number) {
    return feedbackRepository.findByAssignment(assignmentId);
  }

  async getInterviewerFeedback(interviewerId: number) {
    return feedbackRepository.findByInterviewer(interviewerId);
  }
}

export const feedbackService = new FeedbackService();
