import { schedulingService } from '../../scheduling/scheduling.service';
import { publishEvent } from '../../../../events/bus';
import { events } from '../../../../events/catalog';

export const handleAIInterviewCompleted = async (event: any) => {
  console.log('Handling AIInterviewCompleted event:', event);
  try {
    const { candidateId, interviewId } = event;

    const schedule = await schedulingService.createSchedule({
      assignmentId: 1,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
      status: 'scheduled',
    });

    await publishEvent(events.InterviewScheduled, {
      scheduleId: schedule.id,
      candidateId,
      startTime: schedule.startTime,
    });
  } catch (error) {
    console.error('Error handling AIInterviewCompleted:', error);
  }
};
