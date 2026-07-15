import { db } from '../../../database';
import { feedback } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateFeedbackInput } from './feedback.schema';

export class FeedbackRepository {
  async create(data: CreateFeedbackInput) {
    const [feedbackRecord] = await db.insert(feedback).values(data).returning();
    return feedbackRecord;
  }

  async findById(id: number) {
    const [feedbackRecord] = await db.select().from(feedback).where(eq(feedback.id, id));
    return feedbackRecord;
  }

  async findByAssignment(assignmentId: number) {
    return db.select().from(feedback).where(eq(feedback.assignmentId, assignmentId));
  }

  async findByInterviewer(interviewerId: number) {
    return db.select().from(feedback).where(eq(feedback.interviewerId, interviewerId));
  }
}

export const feedbackRepository = new FeedbackRepository();
