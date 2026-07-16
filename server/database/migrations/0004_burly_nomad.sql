CREATE TYPE "public"."ai_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "recommendation" text;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "strengths" jsonb;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "weaknesses" jsonb;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "matched_skills" jsonb;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "missing_skills" jsonb;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "ai_status" "ai_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "processed_at" timestamp;