import { db } from '../../../database';
import { assignments } from '../../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateAssignmentInput, UpdateAssignmentInput } from './assignment.schema';

export class AssignmentRepository {
  async create(data: CreateAssignmentInput) {
    const [assignment] = await db.insert(assignments).values(data).returning();
    return assignment;
  }

  async findById(id: number) {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
  }

  async findByInterviewer(interviewerId: number) {
    return db.select().from(assignments).where(eq(assignments.interviewerId, interviewerId));
  }

  async findAll() {
    return db.select().from(assignments);
  }

  async update(id: number, data: UpdateAssignmentInput) {
    const [assignment] = await db
      .update(assignments)
      .set(data)
      .where(eq(assignments.id, id))
      .returning();
    return assignment;
  }

  async delete(id: number) {
    const [assignment] = await db
      .delete(assignments)
      .where(eq(assignments.id, id))
      .returning();
    return assignment;
  }
}

export const assignmentRepository = new AssignmentRepository();
