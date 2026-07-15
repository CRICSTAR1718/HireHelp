import { db } from '../../../database'
import { offers } from '../../../database/schema'
import { eq } from 'drizzle-orm'

export async function createOffer(data: any) {
  const [row] = await db.insert(offers).values(data).returning()
  return row
}

export async function getOffer(id: string) {
  const [row] = await db
    .select()
    .from(offers)
    .where(eq(offers.id, id))
  return row ?? null
}

export async function getOffersForApplication(applicationId: string) {
  return db
    .select()
    .from(offers)
    .where(eq(offers.application_id, applicationId))
}
