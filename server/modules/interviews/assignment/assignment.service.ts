import { assignmentRepository } from './assignment.repository';
import { CreateAssignmentInput, UpdateAssignmentInput, AssignAndScheduleInput } from './assignment.schema';
import { schedulingService } from '../scheduling/scheduling.service';
import { schedulingRepository } from '../scheduling/scheduling.repository';

export class AssignmentService {
  async createAssignment(data: CreateAssignmentInput) {
    return assignmentRepository.create(data);
  }

  /**
   * Flow 1: HR assigns a shortlisted candidate to an interviewer AND picks a
   * slot in the same action. Creates assignment -> schedule -> Google
   * Calendar event/Meet link -> candidate email, all in one call.
   */
  async assignAndSchedule(data: AssignAndScheduleInput) {
    const assignment = await assignmentRepository.create({
      interviewId: `int-${Date.now()}`,
      interviewerId: data.interviewerId,
      candidateId: data.candidateId,
      role: data.role,
    });

    const schedule = await schedulingRepository.create({
      assignmentId: assignment.id,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      status: 'scheduled',
    });

    const updatedSchedule = await schedulingService.sendInvitation(
      schedule.id,
      data.interviewerId,
      data.candidateEmail,
      data.candidateName,
      data.interviewerEmail,
      data.interviewerName,
      data.jobTitle
    );

    return { assignment, schedule: updatedSchedule };
  }

  async getAllAssignments() {
    return assignmentRepository.findAll();
  }

  async getAssignment(id: number) {
    return assignmentRepository.findById(id);
  }

  async getInterviewerAssignments(interviewerId: number) {
    return assignmentRepository.findByInterviewer(interviewerId);
  }

  async updateAssignment(id: number, data: UpdateAssignmentInput) {
    return assignmentRepository.update(id, data);
  }

  async deleteAssignment(id: number) {
    return assignmentRepository.delete(id);
  }
}

export const assignmentService = new AssignmentService();
