import { db } from '../../../database';
import { candidateApplications } from '../../../database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NewCandidateApplication } from '../../../database/schema';

export class ApplicationsRepository {
  async findByCandidateId(candidateId: number) {
    return await db.select().from(candidateApplications)
      .where(eq(candidateApplications.candidateId, candidateId))
      .orderBy(desc(candidateApplications.appliedAt));
  }

  async findById(id: number) {
    const result = await db.select().from(candidateApplications).where(eq(candidateApplications.id, id)).limit(1);
    return result[0];
  }

  async create(data: NewCandidateApplication) {
    const result = await db.insert(candidateApplications).values({
      ...data,
      appliedAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  }

  async updateStatus(id: number, candidateId: number, status: string) {
    const result = await db.update(candidateApplications)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(candidateApplications.id, id), eq(candidateApplications.candidateId, candidateId)))
      .returning();
    return result[0];
  }
}

export const applicationsRepository = new ApplicationsRepository();
