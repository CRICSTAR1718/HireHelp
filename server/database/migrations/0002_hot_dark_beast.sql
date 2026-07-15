ALTER TABLE "candidates" ADD COLUMN "uuid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_uuid_unique" UNIQUE("uuid");