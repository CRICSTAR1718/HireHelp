import { db } from '../../../database';
import { interviewers } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateInterviewerInput, UpdateInterviewerInput } from './interviewer.schema';

export class InterviewerRepository {
  async create(data: CreateInterviewerInput) {
    const [interviewer] = await db.insert(interviewers).values(data).returning();
    return interviewer;
  }

  async findById(id: number) {
    const [interviewer] = await db.select().from(interviewers).where(eq(interviewers.id, id));
    return interviewer;
  }

  async findByUserId(userId: string) {
    const [interviewer] = await db.select().from(interviewers).where(eq(interviewers.userId, userId));
    return interviewer;
  }

  async findAll() {
    return db.select().from(interviewers);
  }

  async update(id: number, data: UpdateInterviewerInput) {
    const [interviewer] = await db
      .update(interviewers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(interviewers.id, id))
      .returning();
    return interviewer;
  }

  async delete(id: number) {
    const [interviewer] = await db
      .delete(interviewers)
      .where(eq(interviewers.id, id))
      .returning();
    return interviewer;
  }
}

export const interviewerRepository = new InterviewerRepository();
