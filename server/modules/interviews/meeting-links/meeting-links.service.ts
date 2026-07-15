import { meetingLinksRepository } from './meeting-links.repository';
import { CreateMeetingLinkInput } from './meeting-links.schema';

export class MeetingLinksService {
  async createMeetingLink(data: CreateMeetingLinkInput) {
    return meetingLinksRepository.create(data);
  }

  async getMeetingLink(id: number) {
    return meetingLinksRepository.findById(id);
  }

  async getScheduleMeetingLinks(scheduleId: number) {
    return meetingLinksRepository.findBySchedule(scheduleId);
  }

  async deleteMeetingLink(id: number) {
    return meetingLinksRepository.delete(id);
  }
}

export const meetingLinksService = new MeetingLinksService();
