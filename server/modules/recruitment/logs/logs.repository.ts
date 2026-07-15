import { db } from '../../../database'
import { requisition_status_logs } from '../../../database/schema'
import { eq, desc } from 'drizzle-orm'

export async function findLogs(requisitionId: string) {
  return db.select()
    .from(requisition_status_logs)
    .where(eq(requisition_status_logs.requisition_id, requisitionId))
    .orderBy(desc(requisition_status_logs.changed_at))
}
