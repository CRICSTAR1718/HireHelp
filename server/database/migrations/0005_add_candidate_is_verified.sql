-- Add is_verified column to candidates
ALTER TABLE candidates
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;
