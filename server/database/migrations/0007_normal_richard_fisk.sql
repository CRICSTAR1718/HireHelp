CREATE TYPE "public"."talent_pool_status" AS ENUM('active', 'removed');--> statement-breakpoint
CREATE TABLE "candidate_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"job_alerts" boolean DEFAULT true NOT NULL,
	"application_updates" boolean DEFAULT true NOT NULL,
	"interview_emails" boolean DEFAULT true NOT NULL,
	"marketing_emails" boolean DEFAULT false NOT NULL,
	"profile_visibility" boolean DEFAULT true NOT NULL,
	"allow_recruiter_discovery" boolean DEFAULT true NOT NULL,
	"include_in_talent_pool" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "candidate_settings_candidate_id_unique" UNIQUE("candidate_id")
);
--> statement-breakpoint
CREATE TABLE "notification_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"job_id" uuid NOT NULL,
	"email_status" varchar(50) NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"opened" boolean DEFAULT false,
	"opened_at" timestamp,
	"clicked" boolean DEFAULT false,
	"clicked_at" timestamp,
	"applied" boolean DEFAULT false,
	"applied_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "talent_pool" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid NOT NULL,
	"resume_id" integer,
	"previous_job_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"interview_feedback" text,
	"interview_score" numeric(5, 2),
	"ai_score" numeric(5, 2),
	"rejection_reason" text,
	"status" "talent_pool_status" DEFAULT 'active' NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "candidates" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "source" varchar(20) DEFAULT 'self' NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "is_claimed" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "sourced_by_user_id" integer;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "cancellation_reason" text;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "feedback" text;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "google_event_id" text;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "invitation_sent" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "calendar_provider" text DEFAULT 'google';--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "calendar_owner_type" text DEFAULT 'company';--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "calendar_owner_id" text;--> statement-breakpoint
ALTER TABLE "candidate_settings" ADD CONSTRAINT "candidate_settings_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_history" ADD CONSTRAINT "notification_history_job_id_job_requisitions_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_requisitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_pool" ADD CONSTRAINT "talent_pool_previous_job_id_job_requisitions_id_fk" FOREIGN KEY ("previous_job_id") REFERENCES "public"."job_requisitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talent_pool" ADD CONSTRAINT "talent_pool_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;