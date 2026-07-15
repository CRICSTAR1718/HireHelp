import { db } from '../../../../database';
import { candidateApplications } from '../../../../database/schema';
import { eq } from 'drizzle-orm';

export const handleFitmentScoreCalculated = async (data: {
  applicationId: number;
  fitmentScore: number;
  details?: any;
}) => {
  try {
    await db
      .update(candidateApplications)
      .set({ 
        fitmentScore: data.fitmentScore,
        updatedAt: new Date(),
      })
      .where(eq(candidateApplications.id, data.applicationId));
    
    console.log(`Updated fitment score for application ${data.applicationId}`);
  } catch (error) {
    console.error('Error handling FitmentScoreCalculated event:', error);
  }
};
