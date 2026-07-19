import { db } from '../../../database';
import { candidates } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { Candidate } from '../../../database/schema';
import bcrypt from 'bcryptjs';

type RegisterInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password: string;
};

export class AuthRepository {
  async findById(id: number): Promise<Candidate | undefined> {
    const result = await db.select().from(candidates).where(eq(candidates.id, id)).limit(1);
    return result[0];
  }

  async findByEmail(email: string): Promise<Candidate | undefined> {
    const result = await db.select().from(candidates).where(eq(candidates.email, email)).limit(1);
    return result[0];
  }

  async create(data: RegisterInput): Promise<Candidate> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const { password, ...candidateData } = data;
    
    const result = await db.insert(candidates).values({
      ...candidateData,
      passwordHash,
    }).returning();
    
    return result[0];
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async updatePasswordByEmail(email: string, newPassword: string) {
    const hash = await bcrypt.hash(newPassword, 10);
    await db.update(candidates).set({ passwordHash: hash }).where(eq(candidates.email, email));
  }

  async updatePassword(id: number, newPassword: string) {
    const hash = await bcrypt.hash(newPassword, 10);
    await db.update(candidates).set({ passwordHash: hash }).where(eq(candidates.id, id));
  }

  async markVerifiedByEmail(email: string) {
    await db.update(candidates).set({ isVerified: true }).where(eq(candidates.email, email));
  }
}

export const authRepository = new AuthRepository();
