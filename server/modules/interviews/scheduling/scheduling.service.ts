import { schedulingRepository } from './scheduling.repository';
import { CreateScheduleInput, UpdateScheduleInput, CreateInterviewScheduleInput } from './scheduling.schema';
import { assignmentRepository } from '../assignment/assignment.repository';

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
    // First create the assignment
    const assignment = await assignmentRepository.create({
      interviewerId: data.interviewerId,
      candidateId: data.candidateId,
      role: data.role,
      interviewId: data.interviewId || `int-${Date.now()}`, // Generate interview ID if not provided
    });

    // Then create the schedule linked to the assignment
    const schedule = await schedulingRepository.create({
      assignmentId: assignment.id,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      meetingLink: data.meetingLink,
      status: data.status,
    });

    return {
      assignment,
      schedule,
    };
  }
}

export const schedulingService = new SchedulingService();
