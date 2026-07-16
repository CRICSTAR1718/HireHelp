-- Fix candidates table schema to match current code expectations
-- Add UUID column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'candidates' AND column_name = 'uuid'
    ) THEN
        ALTER TABLE candidates 
        ADD COLUMN uuid UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE;
        CREATE INDEX idx_candidates_uuid ON candidates(uuid);
    END IF;
END $$;

-- Add is_verified column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'candidates' AND column_name = 'is_verified'
    ) THEN
        ALTER TABLE candidates
        ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END $$;

-- Create candidate_otps table if not exists
CREATE TABLE IF NOT EXISTS candidate_otps (
  id BIGSERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  purpose VARCHAR(50) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidate_otps_email ON candidate_otps(email);
CREATE INDEX IF NOT EXISTS idx_candidate_otps_candidate_id ON candidate_otps(candidate_id);
