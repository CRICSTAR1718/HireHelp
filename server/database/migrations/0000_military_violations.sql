CREATE TYPE "public"."application_status" AS ENUM('submitted', 'under_review', 'shortlisted', 'rejected', 'hired'); 
CREATE TYPE "public"."field_type" AS ENUM('text', 'textarea', 'dropdown', 'file', 'checkbox', 'date', 'number', 'url', 'multi_select', 'rating', 'yes_no'); 
CREATE TYPE "public"."offer_status" AS ENUM('draft', 'sent', 'accepted', 'declined', 'expired'); 
CREATE TYPE "public"."requisition_status" AS ENUM('draft', 'submitted', 'under_review', 'needs_changes', 'approved', 'rejected', 'published', 'closed'); 
CREATE TABLE "approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"required_approval_count" text DEFAULT '1' NOT NULL,
	"current_approval_count" text DEFAULT '0' NOT NULL,
	"approved_by" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rejected_by" varchar(200),
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
 
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(200) NOT NULL,
	"resource" varchar(300) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
 
CREATE TABLE "configuration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(200) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "configuration_key_unique" UNIQUE("key")
);
 
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"parent_department_id" uuid,
	"head_user_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
 
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"resource" varchar(200) NOT NULL,
	"action" varchar(100) NOT NULL,
	"description" text,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
 
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
 
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
 
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token_hash" varchar(255) NOT NULL,
	"device_name" varchar(200),
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_reason" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_sessions_refresh_token_hash_unique" UNIQUE("refresh_token_hash")
);
 
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(150) NOT NULL,
	"last_name" varchar(150) NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"phone" varchar(50),
	"role_id" uuid NOT NULL,
	"department_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
 
CREATE TABLE "candidate_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"job_id" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'applied' NOT NULL,
	"cover_letter" text,
	"fitment_score" integer,
	"applied_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
 
CREATE TABLE "candidates" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_email_unique" UNIQUE("email")
);
 
CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"institution" varchar(255) NOT NULL,
	"degree" varchar(255) NOT NULL,
	"field" varchar(255),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
 
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"company" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"current" boolean DEFAULT false NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
 
CREATE TABLE "interview_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"application_id" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"scheduled_at" timestamp,
	"interview_type" varchar(50),
	"interviewer_name" varchar(255),
	"meeting_link" varchar(500),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
 
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
 
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"headline" varchar(255),
	"summary" text,
	"location" varchar(255),
	"website" varchar(255),
	"linkedin" varchar(255),
	"github" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
 
CREATE TABLE "resumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"original_file_name" varchar(255) NOT NULL,
	"s3_key" varchar(500) NOT NULL,
	"s3_url" varchar(500) NOT NULL,
	"file_size" integer NOT NULL,
	"file_type" varchar(100) NOT NULL,
	"parsed_data" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
 
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"level" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
 
CREATE TABLE "assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"interview_id" text NOT NULL,
	"interviewer_id" integer,
	"candidate_id" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"assigned_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
 
CREATE TABLE "calendar_integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"interviewer_id" integer,
	"provider" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"calendar_id" text,
	"sync_enabled" boolean DEFAULT true,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
 
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"assignment_id" integer,
	"interviewer_id" integer,
	"ratings" jsonb NOT NULL,
	"overall_score" integer NOT NULL,
	"recommendation" text NOT NULL,
	"notes" text,
	"submitted_at" timestamp DEFAULT now()
);
 
CREATE TABLE "interviewers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"expertise" text[],
	"availability" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
 
CREATE TABLE "meeting_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"schedule_id" integer,
	"platform" text NOT NULL,
	"link" text NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
 
CREATE TABLE "reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"schedule_id" integer,
	"recipient_id" text NOT NULL,
	"recipient_type" text NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"sent_at" timestamp,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
 
CREATE TABLE "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"assignment_id" integer,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"location" text,
	"meeting_link" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
 
CREATE TABLE "application_forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"is_published" boolean DEFAULT false,
	"admin_remarks" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
 
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" uuid NOT NULL,
	"candidate_id" uuid NOT NULL,
	"status" "application_status" DEFAULT 'submitted',
	"ai_score" numeric(5, 2),
	"submitted_at" timestamp DEFAULT now()
);
 
CREATE TABLE "feedback_aggregations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"requisition_id" uuid NOT NULL,
	"interview_round" varchar(50),
	"interviewer_id" uuid,
	"overall_rating" numeric(3, 1),
	"recommendation" varchar(30),
	"raw_feedback" jsonb,
	"aggregated_at" timestamp DEFAULT now()
);
 
CREATE TABLE "field_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"field_id" uuid NOT NULL,
	"label" text NOT NULL,
	"position" integer NOT NULL
);
 
CREATE TABLE "field_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"response_text" text,
	"response_json" jsonb,
	"file_url" text
);
 
CREATE TABLE "form_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"approver_id" uuid NOT NULL,
	"approver_role" varchar(30),
	"status" varchar(20) DEFAULT 'pending',
	"decided_at" timestamp
);
 
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"label" text NOT NULL,
	"field_type" "field_type" NOT NULL,
	"is_required" boolean DEFAULT false,
	"position" integer NOT NULL,
	"placeholder" text,
	"helper_text" text,
	"max_rating" integer DEFAULT 5,
	"created_at" timestamp DEFAULT now()
);
 
CREATE TABLE "job_requisitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memo_no" varchar(50),
	"title" varchar(150) NOT NULL,
	"department" varchar(100),
	"team" varchar(100),
	"location" varchar(100),
	"employment_type" varchar(50),
	"work_mode" varchar(50),
	"number_of_openings" integer DEFAULT 1,
	"about_role" text,
	"responsibilities" text,
	"required_skills" text,
	"preferred_skills" text,
	"experience_required" varchar(100),
	"education_requirements" text,
	"salary" varchar(100),
	"benefits" text,
	"hiring_manager_id" uuid NOT NULL,
	"recruiter_id" uuid,
	"hiring_priority" varchar(50),
	"target_joining_date" timestamp,
	"application_deadline" timestamp,
	"internal_application_form" boolean DEFAULT true,
	"job_description_document" text,
	"additional_documents" jsonb,
	"status" "requisition_status" DEFAULT 'draft' NOT NULL,
	"rejection_reason" text,
	"admin_remarks" text,
	"closed_reason" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"closed_at" timestamp,
	CONSTRAINT "job_requisitions_memo_no_unique" UNIQUE("memo_no")
);
 
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"candidate_id" uuid NOT NULL,
	"offered_by" uuid NOT NULL,
	"title" varchar(150) NOT NULL,
	"department" varchar(100),
	"salary_amount" numeric(12, 2),
	"salary_currency" varchar(10) DEFAULT 'INR',
	"start_date" timestamp,
	"offer_letter" text,
	"status" "offer_status" DEFAULT 'draft',
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
 
CREATE TABLE "pipeline_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"stage_id" uuid NOT NULL,
	"candidate_id" uuid NOT NULL,
	"status" "application_status" DEFAULT 'submitted',
	"ai_score" numeric(5, 2),
	"recruiter_notes" text,
	"moved_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
 
CREATE TABLE "pipeline_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
 
CREATE TABLE "question_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"field_type" "field_type" NOT NULL,
	"category" varchar(50),
	"user_id" uuid,
	"is_required" boolean DEFAULT false,
	"placeholder" text,
	"helper_text" text,
	"max_rating" integer DEFAULT 5,
	"options" jsonb,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
 
CREATE TABLE "requisition_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" uuid NOT NULL,
	"approver_id" uuid NOT NULL,
	"approver_role" varchar(30),
	"status" varchar(20) DEFAULT 'pending',
	"decided_at" timestamp
);
 
CREATE TABLE "requisition_status_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" uuid NOT NULL,
	"from_status" "requisition_status",
	"to_status" "requisition_status" NOT NULL,
	"changed_by" uuid NOT NULL,
	"changed_at" timestamp DEFAULT now(),
	"remarks" text
);
 
CREATE TABLE "rulebook_criteria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rulebook_id" uuid NOT NULL,
	"criterion_type" varchar(30) NOT NULL,
	"weight_pct" numeric(5, 2) NOT NULL
);
 
CREATE TABLE "screening_rulebooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requisition_id" uuid NOT NULL,
	"defined_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
 
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; 
ALTER TABLE "configuration" ADD CONSTRAINT "configuration_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action; 
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action; 
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action; 
ALTER TABLE "candidate_applications" ADD CONSTRAINT "candidate_applications_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "education" ADD CONSTRAINT "education_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "interview_status" ADD CONSTRAINT "interview_status_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "interview_status" ADD CONSTRAINT "interview_status_application_id_candidate_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."candidate_applications"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "skills" ADD CONSTRAINT "skills_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_interviewer_id_interviewers_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."interviewers"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "calendar_integrations" ADD CONSTRAINT "calendar_integrations_interviewer_id_interviewers_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."interviewers"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_interviewer_id_interviewers_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."interviewers"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "meeting_links" ADD CONSTRAINT "meeting_links_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "application_forms" ADD CONSTRAINT "application_forms_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "application_forms" ADD CONSTRAINT "application_forms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "applications" ADD CONSTRAINT "applications_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "feedback_aggregations" ADD CONSTRAINT "feedback_aggregations_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "feedback_aggregations" ADD CONSTRAINT "feedback_aggregations_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "field_options" ADD CONSTRAINT "field_options_field_id_form_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_fields"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "field_responses" ADD CONSTRAINT "field_responses_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "field_responses" ADD CONSTRAINT "field_responses_field_id_form_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_fields"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "form_approvals" ADD CONSTRAINT "form_approvals_form_id_application_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."application_forms"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "form_approvals" ADD CONSTRAINT "form_approvals_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_application_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."application_forms"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "job_requisitions" ADD CONSTRAINT "job_requisitions_hiring_manager_id_users_id_fk" FOREIGN KEY ("hiring_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "job_requisitions" ADD CONSTRAINT "job_requisitions_recruiter_id_users_id_fk" FOREIGN KEY ("recruiter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "job_requisitions" ADD CONSTRAINT "job_requisitions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "offers" ADD CONSTRAINT "offers_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "offers" ADD CONSTRAINT "offers_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "offers" ADD CONSTRAINT "offers_offered_by_users_id_fk" FOREIGN KEY ("offered_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "pipeline_entries" ADD CONSTRAINT "pipeline_entries_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "pipeline_entries" ADD CONSTRAINT "pipeline_entries_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "pipeline_entries" ADD CONSTRAINT "pipeline_entries_stage_id_pipeline_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."pipeline_stages"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "pipeline_stages" ADD CONSTRAINT "pipeline_stages_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "question_templates" ADD CONSTRAINT "question_templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "requisition_approvals" ADD CONSTRAINT "requisition_approvals_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "requisition_approvals" ADD CONSTRAINT "requisition_approvals_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "requisition_status_logs" ADD CONSTRAINT "requisition_status_logs_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "requisition_status_logs" ADD CONSTRAINT "requisition_status_logs_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
ALTER TABLE "rulebook_criteria" ADD CONSTRAINT "rulebook_criteria_rulebook_id_screening_rulebooks_id_fk" FOREIGN KEY ("rulebook_id") REFERENCES "public"."screening_rulebooks"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "screening_rulebooks" ADD CONSTRAINT "screening_rulebooks_requisition_id_job_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action; 
ALTER TABLE "screening_rulebooks" ADD CONSTRAINT "screening_rulebooks_defined_by_users_id_fk" FOREIGN KEY ("defined_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; 
CREATE INDEX "approvals_requisition_id_idx" ON "approvals" USING btree ("requisition_id"); 
CREATE INDEX "approvals_status_idx" ON "approvals" USING btree ("status"); 
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at"); 
CREATE INDEX "configuration_key_idx" ON "configuration" USING btree ("key"); 
CREATE INDEX "departments_parent_idx" ON "departments" USING btree ("parent_department_id"); 
CREATE INDEX "permissions_resource_action_idx" ON "permissions" USING btree ("resource","action"); 
CREATE INDEX "roles_name_idx" ON "roles" USING btree ("name"); 
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions" USING btree ("user_id"); 
CREATE INDEX "user_sessions_refresh_token_hash_idx" ON "user_sessions" USING btree ("refresh_token_hash"); 
CREATE INDEX "user_sessions_expires_at_idx" ON "user_sessions" USING btree ("expires_at"); 
CREATE INDEX "user_sessions_is_revoked_idx" ON "user_sessions" USING btree ("is_revoked"); 
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");