import { db } from '../../../database';
import { interviewers, users, roles } from '../../../database/schema';
import { eq, inArray } from 'drizzle-orm';
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
    // 1. Fetch staff users with hr, admin, or interviewer roles
    const staffUsers = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        roleName: roles.name,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(inArray(roles.name, ['hr', 'admin', 'interviewer']));

    // 2. Fetch all existing interviewers
    const existing = await db.select().from(interviewers);
    const existingByUserId = new Map(existing.map(i => [i.userId, i]));

    // 3. Keep interviewers synchronized
    for (const user of staffUsers) {
      const name = `${user.firstName} ${user.lastName}`;
      if (!existingByUserId.has(user.id)) {
        const [newInterviewer] = await db
          .insert(interviewers)
          .values({
            userId: user.id,
            name,
            email: user.email,
            expertise: [],
            availability: [],
          })
          .returning();
        existingByUserId.set(user.id, newInterviewer);
      } else {
        const current = existingByUserId.get(user.id)!;
        if (current.name !== name || current.email !== user.email) {
          const [updated] = await db
            .update(interviewers)
            .set({
              name,
              email: user.email,
              updatedAt: new Date(),
            })
            .where(eq(interviewers.id, current.id))
            .returning();
          existingByUserId.set(user.id, updated);
        }
      }
    }

    // 4. Return interviewers corresponding to active staff users
    const activeUserIds = new Set(staffUsers.map(u => u.id));
    return Array.from(existingByUserId.values()).filter(i => activeUserIds.has(i.userId));
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
