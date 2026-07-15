-- Create candidate_otps table for storing hashed OTPs
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
