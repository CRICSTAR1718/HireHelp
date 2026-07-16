import { google } from 'googleapis';
import { CalendarProvider, MeetingData, MeetingResult } from './types';
import { env } from '../../../config/env';

export class CompanyGoogleCalendarProvider implements CalendarProvider {
  private calendar: any;

  constructor() {
    const auth = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
    });

    this.calendar = google.calendar({
      version: 'v3',
      auth,
    });
  }

  async createMeeting(data: MeetingData): Promise<MeetingResult> {
    try {
      const event = {
        summary: data.title,
        description: data.description,
        start: {
          dateTime: data.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: data.endTime.toISOString(),
          timeZone: 'UTC',
        },
        attendees: data.attendees.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
        })),
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
        location: data.location,
      };

      const response = await this.calendar.events.insert({
        calendarId: env.GOOGLE_CALENDAR_ID || 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
      });

      const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
      const htmlLink = response.data.htmlLink;

      return {
        eventId: response.data.id,
        meetLink,
        htmlLink,
      };
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw new Error('Failed to create Google Calendar event');
    }
  }

  async updateMeeting(eventId: string, data: Partial<MeetingData>): Promise<void> {
    try {
      const existingEvent = await this.calendar.events.get({
        calendarId: env.GOOGLE_CALENDAR_ID || 'primary',
        eventId,
      });

      const updatedEvent = {
        ...existingEvent.data,
        summary: data.title || existingEvent.data.summary,
        description: data.description || existingEvent.data.description,
        start: data.startTime ? {
          dateTime: data.startTime.toISOString(),
          timeZone: 'UTC',
        } : existingEvent.data.start,
        end: data.endTime ? {
          dateTime: data.endTime.toISOString(),
          timeZone: 'UTC',
        } : existingEvent.data.end,
        attendees: data.attendees ? data.attendees.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
        })) : existingEvent.data.attendees,
        location: data.location || existingEvent.data.location,
      };

      await this.calendar.events.update({
        calendarId: env.GOOGLE_CALENDAR_ID || 'primary',
        eventId,
        requestBody: updatedEvent,
      });
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw new Error('Failed to update Google Calendar event');
    }
  }

  async cancelMeeting(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: env.GOOGLE_CALENDAR_ID || 'primary',
        eventId,
      });
    } catch (error) {
      console.error('Error cancelling Google Calendar event:', error);
      throw new Error('Failed to cancel Google Calendar event');
    }
  }
}
