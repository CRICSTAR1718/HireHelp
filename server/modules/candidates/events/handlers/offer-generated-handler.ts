import { db } from '../../../../database';
import { candidateApplications } from '../../../../database/schema';
import { eq } from 'drizzle-orm';

export const handleOfferGenerated = async (data: {
  applicationId: number;
  candidateId: number;
  offerDetails?: any;
}) => {
  try {
    await db
      .update(candidateApplications)
      .set({ 
        status: 'offer',
        updatedAt: new Date(),
      })
      .where(eq(candidateApplications.id, data.applicationId));
    
    console.log(`Updated application ${data.applicationId} to offer status`);
  } catch (error) {
    console.error('Error handling OfferGenerated event:', error);
  }
};
