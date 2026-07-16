// Calendar provider types and interfaces

export interface MeetingData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees: Attendee[];
  location?: string;
}

export interface Attendee {
  email: string;
  name?: string;
}

export interface MeetingResult {
  eventId: string;
  meetLink?: string;
  htmlLink?: string;
}

export interface CalendarProvider {
  createMeeting(data: MeetingData): Promise<MeetingResult>;
  updateMeeting(eventId: string, data: Partial<MeetingData>): Promise<void>;
  cancelMeeting(eventId: string): Promise<void>;
}

export enum CalendarProviderType {
  GOOGLE = 'google',
  OUTLOOK = 'outlook',
}

export enum CalendarOwnerType {
  COMPANY = 'company',
  INTERVIEWER = 'interviewer',
}
