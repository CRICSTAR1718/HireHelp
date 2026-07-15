import { pgTable, serial, text, timestamp, boolean, varchar, integer, jsonb, uuid } from 'drizzle-orm/pg-core';

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE MODULE — separate identity domain from staff (admin.users).
// Candidate auth stays intentionally separate (different JWT issuer/audience)
// even inside the monolith — do not merge candidate login with staff login.
//
// NOTE ON ID TYPE: this module still uses serial (int) PKs, inherited from the
// original candidate-service. Recruitment/Admin use uuid. Left as-is for this
// merge pass — do not silently "fix" by changing types, it'll break every FK
// below. If unified later, needs an explicit migration, not a schema edit.
// ─────────────────────────────────────────────────────────────────────────────

export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').notNull().defaultRandom().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  headline: varchar('headline', { length: 255 }),
  summary: text('summary'),
  location: varchar('location', { length: 255 }),
  website: varchar('website', { length: 255 }),
  linkedin: varchar('linkedin', { length: 255 }),
  github: varchar('github', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  company: varchar('company', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  current: boolean('current').notNull().default(false),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  institution: varchar('institution', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 255 }).notNull(),
  field: varchar('field', { length: 255 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  name: varchar('name', { length: 100 }).notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const resumes = pgTable('resumes', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  originalFileName: varchar('original_file_name', { length: 255 }).notNull(),
  s3Key: varchar('s3_key', { length: 500 }).notNull(),
  s3Url: varchar('s3_url', { length: 500 }).notNull(),
  fileSize: integer('file_size').notNull(),
  fileType: varchar('file_type', { length: 100 }).notNull(),
  parsedData: jsonb('parsed_data'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// RENAMED from `applications` -> `candidate_applications` to resolve a name
// collision with recruitment.applications (the pipeline-side record). This is
// the candidate's own view of "jobs I applied to" — a separate, intentionally
// denormalized read model, not a duplicate of the recruitment table.
export const candidateApplications = pgTable('candidate_applications', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  jobId: varchar('job_id', { length: 100 }).notNull(), // maps to recruitment.job_requisitions.id (uuid) - stored as text since ID types differ across modules
  status: varchar('status', { length: 50 }).notNull().default('applied'),
  coverLetter: text('cover_letter'),
  fitmentScore: integer('fitment_score'),
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const interviewStatus = pgTable('interview_status', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  applicationId: integer('application_id').notNull().references(() => candidateApplications.id),
  status: varchar('status', { length: 50 }).notNull(),
  scheduledAt: timestamp('scheduled_at'),
  interviewType: varchar('interview_type', { length: 50 }),
  interviewerName: varchar('interviewer_name', { length: 255 }),
  meetingLink: varchar('meeting_link', { length: 500 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
export type CandidateApplication = typeof candidateApplications.$inferSelect;
export type NewCandidateApplication = typeof candidateApplications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type InterviewStatus = typeof interviewStatus.$inferSelect;
export type NewInterviewStatus = typeof interviewStatus.$inferInsert;
