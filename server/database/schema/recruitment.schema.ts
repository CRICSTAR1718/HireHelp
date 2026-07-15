import { pgTable, uuid, varchar, text, timestamp, numeric, pgEnum, boolean, integer, jsonb } from 'drizzle-orm/pg-core'
import { users } from './admin.schema'

// ─────────────────────────────────────────────────────────────────────────────
// RECRUITMENT MODULE — requisitions, forms, pipeline, feedback, offers.
//
// CHANGED FROM ORIGINAL: the standalone `users` table from the old
// recruitment-service (email/password/role-enum) has been DELETED. Every
// hiring_manager_id / recruiter_id / created_by / approver_id / changed_by /
// offered_by column below now references admin.schema.ts's `users` table —
// a real FK, since staff identity is one table across the whole monolith now.
// Recruitment "role" (hr/admin) maps onto admin.roles rows instead of an enum.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────────────────────
export const requisitionStatusEnum = pgEnum('requisition_status', [
  'draft', 'submitted', 'under_review', 'needs_changes', 'approved', 'rejected', 'published', 'closed'
])

export const applicationStatusEnum = pgEnum('application_status', [
  'submitted', 'under_review', 'shortlisted', 'rejected', 'hired'
])

export const fieldTypeEnum = pgEnum('field_type', [
  'text', 'textarea', 'dropdown', 'file', 'checkbox',
  'date', 'number', 'url', 'multi_select', 'rating', 'yes_no'
])

export const offerStatusEnum = pgEnum('offer_status', [
  'draft', 'sent', 'accepted', 'declined', 'expired'
])

// ─── Job Requisitions ──────────────────────────────────────────────────────
export const job_requisitions = pgTable('job_requisitions', {
  id:                      uuid('id').primaryKey().defaultRandom(),
  memo_no:                 varchar('memo_no', { length: 50 }).unique(),

  title:                   varchar('title', { length: 150 }).notNull(),
  department:              varchar('department', { length: 100 }),
  team:                    varchar('team', { length: 100 }),
  location:                varchar('location', { length: 100 }),
  employment_type:         varchar('employment_type', { length: 50 }),
  work_mode:               varchar('work_mode', { length: 50 }),
  number_of_openings:      integer('number_of_openings').default(1),

  about_role:              text('about_role'),
  responsibilities:        text('responsibilities'),
  required_skills:         text('required_skills'),
  preferred_skills:        text('preferred_skills'),
  experience_required:     varchar('experience_required', { length: 100 }),
  education_requirements:  text('education_requirements'),
  salary:                  varchar('salary', { length: 100 }),
  benefits:                text('benefits'),

  hiring_manager_id:       uuid('hiring_manager_id').notNull().references(() => users.id),
  recruiter_id:            uuid('recruiter_id').references(() => users.id),
  hiring_priority:         varchar('hiring_priority', { length: 50 }),
  target_joining_date:     timestamp('target_joining_date'),
  application_deadline:    timestamp('application_deadline'),

  internal_application_form: boolean('internal_application_form').default(true),

  job_description_document: text('job_description_document'),
  additional_documents:     jsonb('additional_documents'),

  status:                  requisitionStatusEnum('status').notNull().default('draft'),
  rejection_reason:        text('rejection_reason'),
  admin_remarks:           text('admin_remarks'),
  closed_reason:           text('closed_reason'),

  created_by:              uuid('created_by').notNull().references(() => users.id),
  created_at:              timestamp('created_at').defaultNow(),
  updated_at:              timestamp('updated_at').defaultNow(),
  published_at:            timestamp('published_at'),
  closed_at:               timestamp('closed_at')
})

// ─── Screening Rulebooks ───────────────────────────────────────────────────
export const screening_rulebooks = pgTable('screening_rulebooks', {
  id:             uuid('id').primaryKey().defaultRandom(),
  requisition_id: uuid('requisition_id').notNull().references(() => job_requisitions.id, { onDelete: 'cascade' }),
  defined_by:     uuid('defined_by').notNull().references(() => users.id),
  created_at:     timestamp('created_at').defaultNow()
})

export const rulebook_criteria = pgTable('rulebook_criteria', {
  id:             uuid('id').primaryKey().defaultRandom(),
  rulebook_id:    uuid('rulebook_id').notNull().references(() => screening_rulebooks.id, { onDelete: 'cascade' }),
  criterion_type: varchar('criterion_type', { length: 30 }).notNull(),
  weight_pct:     numeric('weight_pct', { precision: 5, scale: 2 }).notNull()
})

// ─── Requisition Approvals ─────────────────────────────────────────────────
// NOT a duplicate of admin.approvals — that one's generic/config-scoped;
// this one is requisition-workflow-specific and drives the state machine.
export const requisition_approvals = pgTable('requisition_approvals', {
  id:             uuid('id').primaryKey().defaultRandom(),
  requisition_id: uuid('requisition_id').notNull().references(() => job_requisitions.id, { onDelete: 'cascade' }),
  approver_id:    uuid('approver_id').notNull().references(() => users.id),
  approver_role:  varchar('approver_role', { length: 30 }),
  status:         varchar('status', { length: 20 }).default('pending'),
  decided_at:     timestamp('decided_at')
})

export const requisition_status_logs = pgTable('requisition_status_logs', {
  id:             uuid('id').primaryKey().defaultRandom(),
  requisition_id: uuid('requisition_id').notNull().references(() => job_requisitions.id, { onDelete: 'cascade' }),
  from_status:    requisitionStatusEnum('from_status'),
  to_status:      requisitionStatusEnum('to_status').notNull(),
  changed_by:     uuid('changed_by').notNull().references(() => users.id),
  changed_at:     timestamp('changed_at').defaultNow(),
  remarks:        text('remarks')
})

// ─── Application Forms ─────────────────────────────────────────────────────
export const application_forms = pgTable('application_forms', {
  id:             uuid('id').primaryKey().defaultRandom(),
  requisition_id: uuid('requisition_id').notNull()
                    .references(() => job_requisitions.id, { onDelete: 'cascade' }),
  created_by:     uuid('created_by').notNull().references(() => users.id),
  is_published:   boolean('is_published').default(false),
  admin_remarks:  text('admin_remarks'),
  created_at:     timestamp('created_at').defaultNow(),
  updated_at:     timestamp('updated_at').defaultNow()
})

export const form_fields = pgTable('form_fields', {
  id:           uuid('id').primaryKey().defaultRandom(),
  form_id:      uuid('form_id').notNull()
                  .references(() => application_forms.id, { onDelete: 'cascade' }),
  label:        text('label').notNull(),
  field_type:   fieldTypeEnum('field_type').notNull(),
  is_required:  boolean('is_required').default(false),
  position:     integer('position').notNull(),
  placeholder:  text('placeholder'),
  helper_text:  text('helper_text'),
  max_rating:   integer('max_rating').default(5),
  created_at:   timestamp('created_at').defaultNow()
})

export const field_options = pgTable('field_options', {
  id:       uuid('id').primaryKey().defaultRandom(),
  field_id: uuid('field_id').notNull()
              .references(() => form_fields.id, { onDelete: 'cascade' }),
  label:    text('label').notNull(),
  position: integer('position').notNull()
})

// ─── Applications (pipeline-side record — recruiter view) ─────────────────
// candidate_id stays a loose uuid, NOT an FK to candidate.candidates.id,
// because that table uses serial(int) ids, not uuid — the two ID spaces don't
// match. Cross-module candidate lookups go through the in-process event bus /
// a direct module import, not a DB-level FK.
export const applications = pgTable('applications', {
  id:             uuid('id').primaryKey().defaultRandom(),
  requisition_id: uuid('requisition_id').notNull()
                    .references(() => job_requisitions.id, { onDelete: 'cascade' }),
  candidate_id:   uuid('candidate_id').notNull(), // logical ref -> candidate module (see note above)
  status:         applicationStatusEnum('status').default('submitted'),
  ai_score:       numeric('ai_score', { precision: 5, scale: 2 }),
  submitted_at:   timestamp('submitted_at').defaultNow()
})

export const field_responses = pgTable('field_responses', {
  id:             uuid('id').primaryKey().defaultRandom(),
  application_id: uuid('application_id').notNull()
                    .references(() => applications.id, { onDelete: 'cascade' }),
  field_id:       uuid('field_id').notNull()
                    .references(() => form_fields.id, { onDelete: 'cascade' }),
  response_text:  text('response_text'),
  response_json:  jsonb('response_json'),
  file_url:       text('file_url')
})

export const form_approvals = pgTable('form_approvals', {
  id:             uuid('id').primaryKey().defaultRandom(),
  form_id:        uuid('form_id').notNull()
                    .references(() => application_forms.id, { onDelete: 'cascade' }),
  approver_id:    uuid('approver_id').notNull().references(() => users.id),
  approver_role:  varchar('approver_role', { length: 30 }),
  status:         varchar('status', { length: 20 }).default('pending'),
  decided_at:     timestamp('decided_at')
})

export const question_templates = pgTable('question_templates', {
  id:           uuid('id').primaryKey().defaultRandom(),
  label:        text('label').notNull(),
  field_type:   fieldTypeEnum('field_type').notNull(),
  category:     varchar('category', { length: 50 }),
  user_id:      uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  is_required:  boolean('is_required').default(false),
  placeholder:  text('placeholder'),
  helper_text:  text('helper_text'),
  max_rating:   integer('max_rating').default(5),
  options:      jsonb('options'),
  usage_count:  integer('usage_count').default(0),
  created_at:   timestamp('created_at').defaultNow()
})

// ─── Pipeline ────────────────────────────────────────────────────────────
export const pipeline_stages = pgTable('pipeline_stages', {
  id:             uuid('id').primaryKey().defaultRandom(),
  requisition_id: uuid('requisition_id').notNull().references(() => job_requisitions.id, { onDelete: 'cascade' }),
  name:           varchar('name', { length: 100 }).notNull(),
  position:       integer('position').notNull(),
  created_at:     timestamp('created_at').defaultNow()
})

export const pipeline_entries = pgTable('pipeline_entries', {
  id:              uuid('id').primaryKey().defaultRandom(),
  requisition_id:  uuid('requisition_id').notNull().references(() => job_requisitions.id, { onDelete: 'cascade' }),
  application_id:  uuid('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }),
  stage_id:        uuid('stage_id').notNull().references(() => pipeline_stages.id),
  candidate_id:    uuid('candidate_id').notNull(), // logical ref -> candidate module
  status:          applicationStatusEnum('status').default('submitted'),
  ai_score:        numeric('ai_score', { precision: 5, scale: 2 }),
  recruiter_notes: text('recruiter_notes'),
  moved_at:        timestamp('moved_at').defaultNow(),
  created_at:      timestamp('created_at').defaultNow()
})

// ─── Feedback Aggregations (recruiter-facing rollup, distinct from
// interview.feedback which is the raw per-interviewer submission) ─────────
export const feedback_aggregations = pgTable('feedback_aggregations', {
  id:              uuid('id').primaryKey().defaultRandom(),
  application_id:  uuid('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }),
  requisition_id:  uuid('requisition_id').notNull().references(() => job_requisitions.id, { onDelete: 'cascade' }),
  interview_round: varchar('interview_round', { length: 50 }),
  interviewer_id:  uuid('interviewer_id'), // logical ref -> interview.interviewers (different id space, see note there)
  overall_rating:  numeric('overall_rating', { precision: 3, scale: 1 }),
  recommendation:  varchar('recommendation', { length: 30 }),
  raw_feedback:    jsonb('raw_feedback'),
  aggregated_at:   timestamp('aggregated_at').defaultNow()
})

// ─── Offers ────────────────────────────────────────────────────────────────
export const offers = pgTable('offers', {
  id:              uuid('id').primaryKey().defaultRandom(),
  requisition_id:  uuid('requisition_id').notNull().references(() => job_requisitions.id, { onDelete: 'cascade' }),
  application_id:  uuid('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }),
  candidate_id:    uuid('candidate_id').notNull(), // logical ref -> candidate module
  offered_by:      uuid('offered_by').notNull().references(() => users.id),
  title:           varchar('title', { length: 150 }).notNull(),
  department:      varchar('department', { length: 100 }),
  salary_amount:   numeric('salary_amount', { precision: 12, scale: 2 }),
  salary_currency: varchar('salary_currency', { length: 10 }).default('INR'),
  start_date:      timestamp('start_date'),
  offer_letter:    text('offer_letter'),
  status:          offerStatusEnum('status').default('draft'),
  expires_at:      timestamp('expires_at'),
  created_at:      timestamp('created_at').defaultNow(),
  updated_at:      timestamp('updated_at').defaultNow()
})
