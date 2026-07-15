import { assignmentRepository } from './assignment.repository';
import { CreateAssignmentInput, UpdateAssignmentInput } from './assignment.schema';

export class AssignmentService {
  async createAssignment(data: CreateAssignmentInput) {
    return assignmentRepository.create(data);
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
