import { schedulingRepository } from './scheduling.repository';
import { CreateScheduleInput, UpdateScheduleInput } from './scheduling.schema';

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
}

export const schedulingService = new SchedulingService();
