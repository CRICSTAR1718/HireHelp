import { db } from '../../../database';
import { meetingLinks } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateMeetingLinkInput } from './meeting-links.schema';

export class MeetingLinksRepository {
  async create(data: CreateMeetingLinkInput) {
    const [meetingLink] = await db.insert(meetingLinks).values(data).returning();
    return meetingLink;
  }

  async findById(id: number) {
    const [meetingLink] = await db.select().from(meetingLinks).where(eq(meetingLinks.id, id));
    return meetingLink;
  }

  async findBySchedule(scheduleId: number) {
    return db.select().from(meetingLinks).where(eq(meetingLinks.scheduleId, scheduleId));
  }

  async delete(id: number) {
    const [meetingLink] = await db
      .delete(meetingLinks)
      .where(eq(meetingLinks.id, id))
      .returning();
    return meetingLink;
  }
}

export const meetingLinksRepository = new MeetingLinksRepository();
