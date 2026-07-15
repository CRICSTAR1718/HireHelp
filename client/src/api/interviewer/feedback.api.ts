import { apiFetch } from "./http";

export interface FeedbackRating {
  competency: string;
  score: number;
  comment?: string;
}

export interface Feedback {
  id: number;
  assignmentId: number;
  interviewerId: number;
  ratings: FeedbackRating[];
  overallScore: number;
  recommendation: string;
  notes?: string;
  submittedAt: Date;
}

export const feedbackApi = {
  async createFeedback(data: Partial<Feedback>): Promise<Feedback> {
    const response = await apiFetch(`/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getFeedback(id: number): Promise<Feedback> {
    const response = await apiFetch(`/feedback/${id}`);
    return response.json();
  },

  async getAssignmentFeedback(assignmentId: number): Promise<Feedback[]> {
    const response = await apiFetch(`/feedback/assignment/${assignmentId}`);
    return response.json();
  },

  async getInterviewerFeedback(interviewerId: number): Promise<Feedback[]> {
    const response = await apiFetch(`/feedback/interviewer/${interviewerId}`);
    return response.json();
  },
};
