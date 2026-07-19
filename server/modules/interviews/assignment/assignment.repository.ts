import { db } from '../../../database';
import { assignments, interviewers, schedules } from '../../../database/schema';
import { candidates } from '../../../database/schema/candidate.schema';
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
    const assignmentsData = await db.select().from(assignments).where(eq(assignments.interviewerId, interviewerId));
    console.log('[Assignment Repository] Found assignments for interviewer', interviewerId, ':', assignmentsData.length);
    
    // Enrich with candidate, interviewer, and schedule data
    return await Promise.all(assignmentsData.map(async (assignment) => {
      console.log('[Assignment Repository] Processing assignment:', assignment.id, 'candidateId:', assignment.candidateId);
      
      // Try to find candidate by UUID first, then by integer ID (for backward compatibility)
      let candidate = null;
      try {
        [candidate] = await db.select({
          id: candidates.id,
          uuid: candidates.uuid,
          firstName: candidates.firstName,
          lastName: candidates.lastName,
          email: candidates.email,
          phone: candidates.phone,
        }).from(candidates).where(eq(candidates.uuid, assignment.candidateId)).limit(1);
      } catch (e) {
        console.log('[Assignment Repository] UUID lookup failed, trying integer ID');
      }
      
      // If not found by UUID, try by integer ID
      if (!candidate) {
        const candidateIdInt = parseInt(assignment.candidateId);
        if (!isNaN(candidateIdInt)) {
          [candidate] = await db.select({
            id: candidates.id,
            uuid: candidates.uuid,
            firstName: candidates.firstName,
            lastName: candidates.lastName,
            email: candidates.email,
            phone: candidates.phone,
          }).from(candidates).where(eq(candidates.id, candidateIdInt)).limit(1);
        }
      }

      console.log('[Assignment Repository] Candidate found:', !!candidate, candidate?.firstName, candidate?.lastName);

      let interviewer = null;
      if (assignment.interviewerId) {
        [interviewer] = await db.select({
          id: interviewers.id,
          name: interviewers.name,
          email: interviewers.email,
        }).from(interviewers).where(eq(interviewers.id, assignment.interviewerId as number)).limit(1);
      }

      const [schedule] = await db.select().from(schedules).where(eq(schedules.assignmentId, assignment.id)).limit(1);

      const enriched = {
        ...assignment,
        candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown',
        candidateEmail: candidate?.email,
        candidatePhone: candidate?.phone,
        interviewerName: interviewer?.name,
        interviewerEmail: interviewer?.email,
        schedule,
      };
      
      console.log('[Assignment Repository] Enriched assignment:', enriched.id, enriched.candidateName);
      return enriched;
    }));
  }

  async findAll() {
    const assignmentsData = await db.select().from(assignments);
    
    // Enrich with candidate, interviewer, and schedule data
    return await Promise.all(assignmentsData.map(async (assignment) => {
      // Try to find candidate by UUID first, then by integer ID (for backward compatibility)
      let candidate = null;
      try {
        [candidate] = await db.select({
          id: candidates.id,
          uuid: candidates.uuid,
          firstName: candidates.firstName,
          lastName: candidates.lastName,
          email: candidates.email,
          phone: candidates.phone,
        }).from(candidates).where(eq(candidates.uuid, assignment.candidateId)).limit(1);
      } catch (e) {
        console.log('[Assignment Repository] UUID lookup failed, trying integer ID');
      }
      
      // If not found by UUID, try by integer ID
      if (!candidate) {
        const candidateIdInt = parseInt(assignment.candidateId);
        if (!isNaN(candidateIdInt)) {
          [candidate] = await db.select({
            id: candidates.id,
            uuid: candidates.uuid,
            firstName: candidates.firstName,
            lastName: candidates.lastName,
            email: candidates.email,
            phone: candidates.phone,
          }).from(candidates).where(eq(candidates.id, candidateIdInt)).limit(1);
        }
      }

      let interviewer = null;
      if (assignment.interviewerId) {
        [interviewer] = await db.select({
          id: interviewers.id,
          name: interviewers.name,
          email: interviewers.email,
        }).from(interviewers).where(eq(interviewers.id, assignment.interviewerId as number)).limit(1);
      }

      const [schedule] = await db.select().from(schedules).where(eq(schedules.assignmentId, assignment.id)).limit(1);

      return {
        ...assignment,
        candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown',
        candidateEmail: candidate?.email,
        candidatePhone: candidate?.phone,
        interviewerName: interviewer?.name,
        interviewerEmail: interviewer?.email,
        schedule,
      };
    }));
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
