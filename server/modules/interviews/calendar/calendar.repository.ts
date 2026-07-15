import { db } from '../../../database';
import { calendarIntegrations } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateCalendarIntegrationInput, UpdateCalendarIntegrationInput } from './calendar.schema';

export class CalendarRepository {
  async create(data: CreateCalendarIntegrationInput) {
    const [integration] = await db.insert(calendarIntegrations).values(data).returning();
    return integration;
  }

  async findById(id: number) {
    const [integration] = await db.select().from(calendarIntegrations).where(eq(calendarIntegrations.id, id));
    return integration;
  }

  async findByInterviewer(interviewerId: number) {
    return db.select().from(calendarIntegrations).where(eq(calendarIntegrations.interviewerId, interviewerId));
  }

  async update(id: number, data: UpdateCalendarIntegrationInput) {
    const [integration] = await db
      .update(calendarIntegrations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(calendarIntegrations.id, id))
      .returning();
    return integration;
  }

  async delete(id: number) {
    const [integration] = await db
      .delete(calendarIntegrations)
      .where(eq(calendarIntegrations.id, id))
      .returning();
    return integration;
  }
}

export const calendarRepository = new CalendarRepository();
