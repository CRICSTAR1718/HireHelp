import { db } from '../../../database';
import { interviewStatus } from '../../../database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NewInterviewStatus } from '../../../database/schema';

export class InterviewStatusRepository {
  async findByCandidateId(candidateId: number) {
    return await db.select()
      .from(interviewStatus)
      .where(eq(interviewStatus.candidateId, candidateId))
      .orderBy(desc(interviewStatus.scheduledAt));
  }

  async findById(id: number) {
    const result = await db.select().from(interviewStatus).where(eq(interviewStatus.id, id)).limit(1);
    return result[0];
  }

  async findByApplicationId(applicationId: number) {
    const result = await db.select().from(interviewStatus).where(eq(interviewStatus.applicationId, applicationId)).limit(1);
    return result[0];
  }

  async create(data: NewInterviewStatus) {
    const result = await db.insert(interviewStatus).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  }

  async update(id: number, candidateId: number, data: Partial<NewInterviewStatus>) {
    const result = await db.update(interviewStatus)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(interviewStatus.id, id), eq(interviewStatus.candidateId, candidateId)))
      .returning();
    return result[0];
  }
}

export const interviewStatusRepository = new InterviewStatusRepository();
