import { schedulingRepository } from './scheduling.repository';
import { CreateScheduleInput, UpdateScheduleInput, CreateInterviewScheduleInput } from './scheduling.schema';
import { assignmentRepository } from '../assignment/assignment.repository';
import { CompanyGoogleCalendarProvider } from '../calendar/google-calendar.provider';
import { MeetingData, Attendee } from '../calendar/types';
import { eq } from 'drizzle-orm';
import { db } from '../../../database';
import { schedules } from '../../../database/schema';

export class SchedulingService {
  private calendarProvider: CompanyGoogleCalendarProvider;

  constructor() {
    this.calendarProvider = new CompanyGoogleCalendarProvider();
  }

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

  // Send calendar invitation for a scheduled interview
  async sendInvitation(scheduleId: number, interviewerId: number, candidateEmail: string, candidateName: string, interviewerEmail: string, interviewerName: string) {
    const schedule = await schedulingRepository.findById(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    if (schedule.invitationSent) {
      throw new Error('Invitation already sent');
    }

    try {
      const meetingData: MeetingData = {
        title: `Interview: ${candidateName}`,
        description: `Interview for ${schedule.assignmentId} - ${new Date(schedule.startTime).toLocaleString()}`,
        startTime: new Date(schedule.startTime),
        endTime: new Date(schedule.endTime),
        attendees: [
          { email: candidateEmail, name: candidateName },
          { email: interviewerEmail, name: interviewerName },
        ],
        location: schedule.location || undefined,
      };

      const result = await this.calendarProvider.createMeeting(meetingData);

      // Update schedule with calendar event details
      const updatedSchedule = await schedulingRepository.update(scheduleId, {
        googleEventId: result.eventId,
        meetingLink: result.meetLink || schedule.meetingLink || undefined,
        invitationSent: true,
      });

      return updatedSchedule;
    } catch (calendarError) {
      console.error('[Scheduling Service] Failed to send calendar invitation:', calendarError);
      // Don't fail the whole process if calendar integration fails
      // Mark as invitation sent but without calendar details
      const updatedSchedule = await schedulingRepository.update(scheduleId, {
        invitationSent: true,
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
