import { pgTable, serial, integer, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const candidateOtps = pgTable('candidate_otps', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id'),
  email: varchar('email', { length: 255 }).notNull(),
  otpHash: varchar('otp_hash', { length: 255 }).notNull(),
  purpose: varchar('purpose', { length: 50 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  attempts: integer('attempts').notNull().default(0),
  isUsed: boolean('is_used').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type CandidateOtp = typeof candidateOtps.$inferSelect;
export type NewCandidateOtp = typeof candidateOtps.$inferInsert;
