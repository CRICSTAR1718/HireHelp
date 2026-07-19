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
ALTER TABLE "candidates" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "source" varchar(20) DEFAULT 'self' NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "is_claimed" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD COLUMN "sourced_by_user_id" integer;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "google_event_id" text;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "invitation_sent" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "calendar_provider" text DEFAULT 'google';--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "calendar_owner_type" text DEFAULT 'company';--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "calendar_owner_id" text;--> statement-breakpoint
ALTER TABLE "candidate_settings" ADD CONSTRAINT "candidate_settings_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;