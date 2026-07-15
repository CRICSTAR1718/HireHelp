import { assignmentService } from '../../assignment/assignment.service';
import { publishEvent } from '../../../../events/bus';
import { events } from '../../../../events/catalog';

// CHANGED: previously imported publishEvent from this module's own
// kafka-producer.ts (which also defined its own local `events` string map).
// Now imports the shared bus + shared catalog — same call shape, one source
// of truth for event names across the whole monolith.
export const handleCandidateShortlisted = async (event: any) => {
  console.log('Handling CandidateShortlisted event:', event);
  try {
    const { candidateId, jobId } = event;

    const assignment = await assignmentService.createAssignment({
      interviewId: `int-${Date.now()}`,
      interviewerId: 1,
      candidateId,
      role: 'Technical Interviewer',
    });

    await publishEvent(events.InterviewerAssigned, {
      assignmentId: assignment.id,
      candidateId,
      interviewerId: assignment.interviewerId,
    });
  } catch (error) {
    console.error('Error handling CandidateShortlisted:', error);
  }
};
