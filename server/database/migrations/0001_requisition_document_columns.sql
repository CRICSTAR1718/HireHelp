-- Bring databases created from the earlier requisition schema in sync with
-- the Drizzle model. `IF NOT EXISTS` keeps this safe for fresh installations
-- where these columns were already created by the initial migration.
ALTER TABLE "job_requisitions"
  ADD COLUMN IF NOT EXISTS "additional_documents" jsonb;

ALTER TABLE "job_requisitions"
  ADD COLUMN IF NOT EXISTS "closed_reason" text;