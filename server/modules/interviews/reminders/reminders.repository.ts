import { db } from '../../../database';
import { reminders } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateReminderInput, UpdateReminderInput } from './reminders.schema';

export class RemindersRepository {
  async create(data: CreateReminderInput) {
    const [reminder] = await db.insert(reminders).values(data).returning();
    return reminder;
  }

  async findById(id: number) {
    const [reminder] = await db.select().from(reminders).where(eq(reminders.id, id));
    return reminder;
  }

  async findBySchedule(scheduleId: number) {
    return db.select().from(reminders).where(eq(reminders.scheduleId, scheduleId));
  }

  async findPending() {
    return db.select().from(reminders).where(eq(reminders.status, 'pending'));
  }

  async update(id: number, data: UpdateReminderInput) {
    const [reminder] = await db
      .update(reminders)
      .set(data)
      .where(eq(reminders.id, id))
      .returning();
    return reminder;
  }

  async delete(id: number) {
    const [reminder] = await db
      .delete(reminders)
      .where(eq(reminders.id, id))
      .returning();
    return reminder;
  }
}

export const remindersRepository = new RemindersRepository();
