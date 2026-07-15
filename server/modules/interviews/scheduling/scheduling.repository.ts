import { db } from '../../../database';
import { schedules } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateScheduleInput, UpdateScheduleInput } from './scheduling.schema';

export class SchedulingRepository {
  async create(data: CreateScheduleInput) {
    const [schedule] = await db.insert(schedules).values(data).returning();
    return schedule;
  }

  async findById(id: number) {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule;
  }

  async findByAssignment(assignmentId: number) {
    return db.select().from(schedules).where(eq(schedules.assignmentId, assignmentId));
  }

  async update(id: number, data: UpdateScheduleInput) {
    const [schedule] = await db
      .update(schedules)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schedules.id, id))
      .returning();
    return schedule;
  }

  async delete(id: number) {
    const [schedule] = await db
      .delete(schedules)
      .where(eq(schedules.id, id))
      .returning();
    return schedule;
  }
}

export const schedulingRepository = new SchedulingRepository();
