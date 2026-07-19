import { schedulingRepository } from './scheduling.repository';
import { CreateScheduleInput, UpdateScheduleInput, CreateInterviewScheduleInput } from './scheduling.schema';
import { assignmentRepository } from '../assignment/assignment.repository';
import { CalComProvider } from '../calendar/calcom.provider';
import { calendarRepository } from '../calendar/calendar.repository';
import { MeetingData, Attendee, CalendarOwnerType } from '../calendar/types';
import { sendInterviewScheduledEmail } from '../../../common/utils/email.service';
import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { schedules } from '../../../database/schema';

export class SchedulingService {
  async createSchedule(data: CreateScheduleInput) {
    return schedulingRepository.create(data);
  }

  async getSchedule(id: number) {
    return schedulingRepository.findById(id);
  }

  async getAssignmentSchedules(assignmentId: number) {
    return schedulingRepository.findByAssignment(assignmentId);
  }

  async updateSchedule(id: number, data: UpdateScheduleInput) {
    return schedulingRepository.update(id, data);
  }

  async deleteSchedule(id: number) {
    return schedulingRepository.delete(id);
  }

  // Combined method to create assignment + schedule in one transaction
  async createInterviewSchedule(data: CreateInterviewScheduleInput) {
    console.log('[Scheduling Service] Creating interview schedule with data:', data);

    // First create the assignment
    const assignment = await assignmentRepository.create({
      interviewerId: data.interviewerId,
      candidateId: data.candidateId,
      role: data.role,
      interviewId: data.interviewId || `int-${Date.now()}`, // Generate interview ID if not provided
    });

    console.log('[Scheduling Service] Created assignment:', assignment);

    // Then create the schedule linked to the assignment
    const schedule = await schedulingRepository.create({
      assignmentId: assignment.id,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      meetingLink: data.meetingLink,
      status: data.status,
    });

    console.log('[Scheduling Service] Created schedule:', schedule);

    return {
      assignment,
      schedule,
    };
  }

  /**
   * Creates the Google Calendar event (Meet link included) AND emails the
   * candidate a branded confirmation. This is the single entry point both
   * flows (HR assigns interviewer -> auto-schedule, and HR/Admin direct
   * "Schedule Interview" page) should call right after a schedule row
   * exists.
   *
   * If the interviewer has connected their own Google account (via
   * /interviews/calendar/google/connect/:interviewerId), the event is
   * created directly on THEIR calendar. Otherwise it falls back to the
   * shared company calendar -- either way the interviewer and candidate are
   * both added as attendees, so it lands on both people's calendars via
   * Google's own invite.
   */
  async sendInvitation(
    scheduleId: number,
    interviewerId: number,
    candidateEmail: string,
    candidateName: string,
    interviewerEmail: string,
    interviewerName: string,
    jobTitle: string = 'the role you applied for'
  ) {
    const schedule = await schedulingRepository.findById(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    if (schedule.invitationSent) {
      throw new Error('Invitation already sent');
    }

    let calendarOwnerType: string = CalendarOwnerType.INTERVIEWER;
    let calendarOwnerId: string | null = String(interviewerId);

    try {
      // Look up this interviewer's Cal.com Event Type ID + API key,
      // stored via calendar_integrations (provider='calcom'). See setup
      // steps: interviewer connects Google Calendar/Meet inside Cal.com,
      // creates one Event Type, and shares the Event Type ID + API key
      // with HR/admin to store here.
      const integrations = await calendarRepository.findByInterviewer(interviewerId);
      const calcom = integrations.find((i) => i.provider === 'calcom' && i.syncEnabled);

      if (!calcom || !calcom.calendarId) {
        throw new Error(
          `No Cal.com Event Type configured for interviewer ${interviewerId}. Ask them to complete the Cal.com setup and give HR their Event Type ID.`
        );
      }

      const calendarProvider = new CalComProvider(Number(calcom.calendarId), calcom.accessToken);

      const meetingData: MeetingData = {
        title: `Interview: ${candidateName}`,
        description: `Interview for ${jobTitle} - ${new Date(schedule.startTime).toLocaleString()}`,
        startTime: new Date(schedule.startTime),
        endTime: new Date(schedule.endTime),
        attendees: [
          { email: candidateEmail, name: candidateName },
          { email: interviewerEmail, name: interviewerName },
        ],
        location: schedule.location || undefined,
      };

      const result = await calendarProvider.createMeeting(meetingData);

      // Update schedule with calendar event details
      const updatedSchedule = await schedulingRepository.update(scheduleId, {
        googleEventId: result.eventId,
        meetingLink: result.meetLink || schedule.meetingLink || undefined,
        invitationSent: true,
        calendarProvider: 'calcom',
        calendarOwnerType,
        calendarOwnerId: calendarOwnerId || undefined,
      });

      // Branded email to the candidate on top of Google's own auto-invite.
      await sendInterviewScheduledEmail({
        to: candidateEmail,
        candidateName,
        jobTitle,
        interviewerName,
        startTime: new Date(schedule.startTime),
        endTime: new Date(schedule.endTime),
        meetingLink: result.meetLink || schedule.meetingLink || undefined,
        location: schedule.location || undefined,
      });

      return updatedSchedule;
    } catch (calendarError) {
      console.error('[Scheduling Service] Failed to send calendar invitation:', calendarError);
      // Don't fail the whole process if calendar integration fails.
      // Still email the candidate with what we have (no Meet link) so the
      // interview isn't silently unscheduled from the candidate's POV.
      const updatedSchedule = await schedulingRepository.update(scheduleId, {
        invitationSent: true,
      });

      await sendInterviewScheduledEmail({
        to: candidateEmail,
        candidateName,
        jobTitle,
        interviewerName,
        startTime: new Date(schedule.startTime),
        endTime: new Date(schedule.endTime),
        meetingLink: schedule.meetingLink || undefined,
        location: schedule.location || undefined,
      });

      return updatedSchedule;
    }
  }

  // Get upcoming interviews for a candidate
  async getUpcomingInterviews(candidateId: string) {
    const result = await db
      .select({
        schedule: schedules,
      })
      .from(schedules)
      .where(eq(schedules.status, 'scheduled'));

    // Filter by candidate through assignment (would need to join with assignments table)
    // For now, return all scheduled interviews
    return result;
  }
}

export const schedulingService = new SchedulingService();
