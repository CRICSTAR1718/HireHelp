import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW MODULE — assignment, scheduling, calendar, feedback, reminders.
// No table-name collisions with other modules, so kept unchanged from the
// original interview-service schema.
//
// NOTE ON ID TYPE: uses serial(int) PKs, same caveat as candidate.schema.ts —
// interviewerId/candidateId columns below are stored as text on purpose
// (loose logical refs, not FKs) since they point at other modules whose ID
// types don't match (uuid in recruitment, serial in candidate). Do not
// "upgrade" these to real FKs without a coordinated ID-type migration across
// all modules — flagged here so it isn't done accidentally in isolation.
// ─────────────────────────────────────────────────────────────────────────────

export const interviewers = pgTable('interviewers', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // logical ref -> admin.users.id (uuid, stored as text)
  name: text('name').notNull(),
  email: text('email').notNull(),
  expertise: text('expertise').array(),
  availability: jsonb('availability').$type<{ day: string; slots: string[] }[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const assignments = pgTable('assignments', {
  id: serial('id').primaryKey(),
  interviewId: text('interview_id').notNull(),
  interviewerId: integer('interviewer_id').references(() => interviewers.id),
  candidateId: text('candidate_id').notNull(), // logical ref -> candidate.candidates.id (serial, stored as text)
  role: text('role').notNull(),
  // CHANGED: was notNull() with no default. createAssignmentSchema (Zod)
  // never included a status field, so every create-assignment call path —
  // in the original repo, not just this merge — would have hit a NOT NULL
  // violation at the DB level. Default 'pending' matches the natural
  // lifecycle (assignment created -> pending -> completed).
  status: text('status').notNull().default('pending'),
  assignedAt: timestamp('assigned_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  assignmentId: integer('assignment_id').references(() => assignments.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  location: text('location'),
  meetingLink: text('meeting_link'),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const calendarIntegrations = pgTable('calendar_integrations', {
  id: serial('id').primaryKey(),
  interviewerId: integer('interviewer_id').references(() => interviewers.id),
  provider: text('provider').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  calendarId: text('calendar_id'),
  syncEnabled: boolean('sync_enabled').default(true),
  lastSyncedAt: timestamp('last_synced_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Raw per-interviewer submission. Distinct from
// recruitment.feedback_aggregations, which is the rolled-up recruiter view.
export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  assignmentId: integer('assignment_id').references(() => assignments.id),
  interviewerId: integer('interviewer_id').references(() => interviewers.id),
  ratings: jsonb('ratings').$type<{ competency: string; score: number; comment?: string }[]>().notNull(),
  overallScore: integer('overall_score').notNull(),
  recommendation: text('recommendation').notNull(),
  notes: text('notes'),
  submittedAt: timestamp('submitted_at').defaultNow(),
});

export const meetingLinks = pgTable('meeting_links', {
  id: serial('id').primaryKey(),
  scheduleId: integer('schedule_id').references(() => schedules.id),
  platform: text('platform').notNull(),
  link: text('link').notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reminders = pgTable('reminders', {
  id: serial('id').primaryKey(),
  scheduleId: integer('schedule_id').references(() => schedules.id),
  recipientId: text('recipient_id').notNull(),
  recipientType: text('recipient_type').notNull(),
  scheduledFor: timestamp('scheduled_for').notNull(),
  sentAt: timestamp('sent_at'),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
