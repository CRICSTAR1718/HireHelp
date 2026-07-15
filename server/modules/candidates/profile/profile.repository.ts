import { db } from '../../../database';
import { profiles, experiences, education, skills, candidates } from '../../../database/schema';
import { eq, and } from 'drizzle-orm';
import { NewProfile, NewExperience, NewEducation, NewSkill } from '../../../database/schema';

type NewExperienceWithoutId = Omit<NewExperience, 'candidateId' | 'id' | 'createdAt' | 'updatedAt'>;
type NewEducationWithoutId = Omit<NewEducation, 'candidateId' | 'id' | 'createdAt' | 'updatedAt'>;
type NewSkillWithoutId = Omit<NewSkill, 'candidateId' | 'id' | 'createdAt'>;

export class ProfileRepository {
  async findByCandidateId(candidateId: number) {
    console.log('[Profile Repository] Generated SQL: select profile/skills/education/experience', { candidateId });
    const profile = await db.select().from(profiles).where(eq(profiles.candidateId, candidateId)).limit(1);
    const exp = await db.select().from(experiences).where(eq(experiences.candidateId, candidateId));
    const edu = await db.select().from(education).where(eq(education.candidateId, candidateId));
    const skl = await db.select().from(skills).where(eq(skills.candidateId, candidateId));

    console.log('[Profile Repository] Database result', {
      profileCount: profile.length,
      experienceCount: exp.length,
      educationCount: edu.length,
      skillCount: skl.length,
    });

    return {
      profile: profile[0] || null,
      experiences: exp,
      education: edu,
      skills: skl,
    };
  }

  async updateCandidateIdentity(candidateId: number, data: { fullName?: string; phone?: string }) {
    const updates: Record<string, string | Date> = {};

    if (data.fullName !== undefined) {
      const trimmedName = data.fullName.trim();
      const names = trimmedName.split(/\s+/).filter(Boolean);

      if (names.length > 0) {
        updates.firstName = names[0];
        updates.lastName = names.length > 1 ? names.slice(1).join(' ') : '';
      }
    }

    if (data.phone !== undefined) {
      updates.phone = data.phone;
    }

    if (Object.keys(updates).length === 0) {
      return null;
    }

    console.log('[Profile Repository] Generated SQL: update candidates identity', { candidateId, updates });
    const result = await db.update(candidates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(candidates.id, candidateId))
      .returning();

    console.log('[Profile Repository] Database result', result[0] || null);
    return result[0] || null;
  }

  async updateProfile(candidateId: number, data: Partial<NewProfile>) {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== null)
    ) as Partial<NewProfile>;

    const existing = await db.select().from(profiles).where(eq(profiles.candidateId, candidateId)).limit(1);

    if (existing[0]) {
      console.log('[Profile Repository] Generated SQL: update profiles', { candidateId, data: filteredData });
      const result = await db.update(profiles)
        .set({ ...filteredData, updatedAt: new Date() })
        .where(eq(profiles.candidateId, candidateId))
        .returning();
      console.log('[Profile Repository] Database result', result[0] || null);
      return result[0];
    }

    console.log('[Profile Repository] Generated SQL: insert profiles', { candidateId, data: filteredData });
    const result = await db.insert(profiles).values({
      ...filteredData,
      candidateId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    console.log('[Profile Repository] Database result', result[0] || null);
    return result[0];
  }

  async updateSkills(candidateId: number, skillList: string[]) {
    const normalizedSkills = [...new Set(skillList.filter((skill) => skill && skill.trim()).map((skill) => skill.trim()))];
    console.log('[Profile Repository] Generated SQL: replace skills', { candidateId, skills: normalizedSkills });
    await db.delete(skills).where(eq(skills.candidateId, candidateId));

    if (normalizedSkills.length > 0) {
      const skillValues = normalizedSkills.map((skill) => ({
        candidateId,
        name: skill,
        level: 'Intermediate',
        createdAt: new Date(),
      }));
      await db.insert(skills).values(skillValues);
    }

    console.log('[Profile Repository] Database result', { insertedSkills: normalizedSkills.length });
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
