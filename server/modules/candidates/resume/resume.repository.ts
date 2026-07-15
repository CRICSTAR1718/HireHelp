import { db } from '../../../database';
import { resumes } from '../../../database/schema';
import { eq, and } from 'drizzle-orm';
import { NewResume } from '../../../database/schema';

export class ResumeRepository {
  async findByCandidateId(candidateId: number) {
    return await db.select().from(resumes).where(and(eq(resumes.candidateId, candidateId), eq(resumes.isActive, true)));
  }

  async findById(id: number) {
    const result = await db.select().from(resumes).where(eq(resumes.id, id)).limit(1);
    return result[0];
  }

  async create(data: NewResume) {
    const result = await db.insert(resumes).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  }

  async deactivate(id: number, candidateId: number) {
    await db.update(resumes)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(resumes.id, id), eq(resumes.candidateId, candidateId)));
  }
}

export const resumeRepository = new ResumeRepository();
