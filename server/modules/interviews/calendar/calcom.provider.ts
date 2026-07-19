import { CalendarProvider, MeetingData, MeetingResult } from './types';
import { env } from '../../../config/env';

const CAL_API_BASE = 'https://api.cal.com/v2';

export class CalComProvider implements CalendarProvider {
  private apiKey: string;
  private eventTypeId: number;

  /**
   * apiKey: the interviewer's (or org's) Cal.com API key.
   * eventTypeId: the interviewer's Cal.com Event Type ID (set up manually
   * in their Cal.com dashboard -- see setup steps). Falls back to
   * env.CAL_API_KEY if no per-interviewer key is stored yet.
   */
  constructor(eventTypeId: number, apiKey?: string) {
    this.eventTypeId = eventTypeId;
    this.apiKey = apiKey || env.CAL_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('No Cal.com API key configured for this interviewer or company-wide fallback');
    }
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'cal-api-version': env.CAL_API_VERSION || '2024-08-13',
    };
  }

  async createMeeting(data: MeetingData): Promise<MeetingResult> {
    const candidate = data.attendees[0]; // convention: candidate is attendees[0], interviewer is the Cal.com account owner

    const res = await fetch(`${CAL_API_BASE}/bookings`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        start: data.startTime.toISOString(),
        eventTypeId: this.eventTypeId,
        attendee: {
          name: candidate.name || candidate.email,
          email: candidate.email,
          timeZone: 'Asia/Kolkata', // TODO: make configurable per candidate if you collect timezone
        },
        guests: data.attendees.slice(1).map((a) => a.email), // interviewer + anyone else, added as guests
        metadata: { source: 'hirehelp' },
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('[Cal.com] Booking failed:', JSON.stringify(json));
      throw new Error(json?.error?.message || 'Failed to create Cal.com booking');
    }

    // Cal.com v2 wraps the created booking in `data`. Log once and adjust
    // the field names below if your account's response shape differs
    // (e.g. some setups return `data.meetingUrl` directly, others nest it
    // under `data.location` or `data.references[].meetingUrl`).
    console.log('[Cal.com] Booking response:', JSON.stringify(json.data));

    const booking = json.data;
    const meetLink =
      booking?.meetingUrl ||
      booking?.location ||
      booking?.references?.find((r: any) => r.type?.includes('google_meet'))?.meetingUrl;

    return {
      eventId: String(booking?.uid || booking?.id),
      meetLink,
      htmlLink: undefined,
    };
  }

  async updateMeeting(eventId: string, data: Partial<MeetingData>): Promise<void> {
    const res = await fetch(`${CAL_API_BASE}/bookings/${eventId}/reschedule`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        start: data.startTime?.toISOString(),
      }),
    });
    if (!res.ok) {
      const json = await res.json();
      console.error('[Cal.com] Reschedule failed:', JSON.stringify(json));
      throw new Error('Failed to reschedule Cal.com booking');
    }
  }

  async cancelMeeting(eventId: string): Promise<void> {
    const res = await fetch(`${CAL_API_BASE}/bookings/${eventId}/cancel`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ cancellationReason: 'Cancelled by HireHelp' }),
    });
    if (!res.ok) {
      const json = await res.json();
      console.error('[Cal.com] Cancel failed:', JSON.stringify(json));
      throw new Error('Failed to cancel Cal.com booking');
    }
  }
}
