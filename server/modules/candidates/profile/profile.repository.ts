import { db } from '../../../database';
import { profiles, experiences, education, skills } from '../../../database/schema';
import { eq, and } from 'drizzle-orm';
import { NewProfile, NewExperience, NewEducation, NewSkill } from '../../../database/schema';

type NewExperienceWithoutId = Omit<NewExperience, 'candidateId' | 'id' | 'createdAt' | 'updatedAt'>;
type NewEducationWithoutId = Omit<NewEducation, 'candidateId' | 'id' | 'createdAt' | 'updatedAt'>;
type NewSkillWithoutId = Omit<NewSkill, 'candidateId' | 'id' | 'createdAt'>;

export class ProfileRepository {
  async findByCandidateId(candidateId: number) {
    const profile = await db.select().from(profiles).where(eq(profiles.candidateId, candidateId)).limit(1);
    const exp = await db.select().from(experiences).where(eq(experiences.candidateId, candidateId));
    const edu = await db.select().from(education).where(eq(education.candidateId, candidateId));
    const skl = await db.select().from(skills).where(eq(skills.candidateId, candidateId));
    
    return {
      profile: profile[0] || null,
      experiences: exp,
      education: edu,
      skills: skl,
    };
  }

  async updateProfile(candidateId: number, data: Partial<NewProfile>) {
    const existing = await db.select().from(profiles).where(eq(profiles.candidateId, candidateId)).limit(1);
    
    if (existing[0]) {
      const result = await db.update(profiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profiles.candidateId, candidateId))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(profiles).values({
        ...data,
        candidateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return result[0];
    }
  }

  async addExperience(candidateId: number, data: NewExperienceWithoutId) {
    const result = await db.insert(experiences).values({
      ...data,
      candidateId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  }

  async addEducation(candidateId: number, data: NewEducationWithoutId) {
    const result = await db.insert(education).values({
      ...data,
      candidateId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result[0];
  }

  async addSkill(candidateId: number, data: NewSkillWithoutId) {
    const result = await db.insert(skills).values({
      ...data,
      candidateId,
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async deleteExperience(id: number, candidateId: number) {
    await db.delete(experiences).where(and(eq(experiences.id, id), eq(experiences.candidateId, candidateId)));
  }

  async deleteEducation(id: number, candidateId: number) {
    await db.delete(education).where(and(eq(education.id, id), eq(education.candidateId, candidateId)));
  }

  async deleteSkill(id: number, candidateId: number) {
    await db.delete(skills).where(and(eq(skills.id, id), eq(skills.candidateId, candidateId)));
  }
}

export const profileRepository = new ProfileRepository();
