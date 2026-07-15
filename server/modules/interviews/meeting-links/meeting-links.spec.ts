import { describe, it, expect, beforeEach } from '@jest/globals';
import { meetingLinksService } from './meeting-links.service';
import { meetingLinksRepository } from './meeting-links.repository';

jest.mock('./meeting-links.repository');

describe('MeetingLinksService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a meeting link', async () => {
    const mockData = {
      scheduleId: 1,
      platform: 'zoom',
      link: 'https://zoom.us/j/123456',
    };
    
    const mockMeetingLink = { id: 1, ...mockData, createdAt: new Date() };
    
    jest.spyOn(meetingLinksRepository, 'create').mockResolvedValue(mockMeetingLink as any);
    
    const result = await meetingLinksService.createMeetingLink(mockData);
    expect(result).toEqual(mockMeetingLink);
  });
});
