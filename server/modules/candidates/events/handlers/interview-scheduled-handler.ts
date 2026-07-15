import { db } from '../../../../database';
import { interviewStatus } from '../../../../database/schema';
import { eq } from 'drizzle-orm';

export const handleInterviewScheduled = async (data: {
  candidateId: number;
  applicationId: number;
  scheduledAt: string;
  interviewType: string;
  interviewerName: string;
  meetingLink?: string;
}) => {
  try {
    await db.insert(interviewStatus).values({
      candidateId: data.candidateId,
      applicationId: data.applicationId,
      status: 'scheduled',
      scheduledAt: new Date(data.scheduledAt),
      interviewType: data.interviewType,
      interviewerName: data.interviewerName,
      meetingLink: data.meetingLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log(`Created interview status for candidate ${data.candidateId}`);
  } catch (error) {
    console.error('Error handling InterviewScheduled event:', error);
  }
};
