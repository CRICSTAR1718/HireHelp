import { db } from "../../../database";
import { candidateOtps } from "../../../database/schema";
import { eq, and } from 'drizzle-orm';

export class OtpRepository {
  async create(otp: Partial<any>) {
    const [row] = await db.insert(candidateOtps).values(otp).returning();
    return row;
  }

  async findLatestByEmailAndPurpose(email: string, purpose: string) {
    const rows = await db.select().from(candidateOtps).where(and(eq(candidateOtps.email, email), eq(candidateOtps.purpose, purpose))).orderBy(candidateOtps.createdAt.desc).limit(1);
    return rows[0] ?? null;
  }

  async invalidateByEmailAndPurpose(email: string, purpose: string) {
    await db.update(candidateOtps).set({ isUsed: true }).where(and(eq(candidateOtps.email, email), eq(candidateOtps.purpose, purpose)));
  }

  async incrementAttempts(id: number) {
    await db.update(candidateOtps).set({ attempts: candidateOtps.attempts + 1 }).where(eq(candidateOtps.id, id));
  }

  async deleteById(id: number) {
    await db.delete(candidateOtps).where(eq(candidateOtps.id, id));
  }
}

export const otpRepository = new OtpRepository();
