-- Add UUID column to candidates table for cross-module reference
-- This allows the recruitment module to reference candidates using UUIDs
-- while the candidate module continues to use integer IDs

-- Add the UUID column with a default value for existing records
ALTER TABLE candidates 
ADD COLUMN uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE;

-- Create an index on the UUID column for better query performance
CREATE INDEX idx_candidates_uuid ON candidates(uuid);

-- Add a comment to document the purpose of this column
COMMENT ON COLUMN candidates.uuid IS 'UUID for cross-module reference with recruitment module (uses integer IDs internally)';
