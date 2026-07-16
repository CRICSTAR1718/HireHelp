import { db, pool } from './database';
import { applications } from './database/schema';
import { eq } from 'drizzle-orm';

async function updateApplicationStatus() {
  try {
    console.log('Updating application status to shortlisted...');
    
    // Update the first application to shortlisted
    const [updated] = await db
      .update(applications)
      .set({ status: 'shortlisted' })
      .where(eq(applications.status, 'submitted'))
      .returning();
    
    if (updated) {
      console.log('Updated application:', updated.id, 'to shortlisted');
    } else {
      console.log('No submitted applications found');
    }
    
    // Verify the update
    const allApps = await db.select().from(applications);
    console.log('Current application statuses:', allApps.map(app => ({ id: app.id, status: app.status })));
    
  } catch (error) {
    console.error('Error updating application status:', error);
  } finally {
    await pool.end();
  }
}

updateApplicationStatus();
