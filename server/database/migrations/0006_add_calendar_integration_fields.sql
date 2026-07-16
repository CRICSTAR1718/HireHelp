-- Add calendar integration fields to schedules table
-- This migration extends the existing schedules table to support Google Calendar integration
-- and automatic meeting link generation with invitation tracking.

ALTER TABLE schedules 
ADD COLUMN IF NOT EXISTS google_event_id TEXT,
ADD COLUMN IF NOT EXISTS invitation_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS calendar_provider TEXT DEFAULT 'google',
ADD COLUMN IF NOT EXISTS calendar_owner_type TEXT DEFAULT 'company',
ADD COLUMN IF NOT EXISTS calendar_owner_id TEXT;

-- Add index for google_event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_schedules_google_event_id ON schedules(google_event_id);

-- Add index for calendar_owner_id to support future interviewer-specific calendars
CREATE INDEX IF NOT EXISTS idx_schedules_calendar_owner_id ON schedules(calendar_owner_id);

-- Add comment to document the new fields
COMMENT ON COLUMN schedules.google_event_id IS 'Google Calendar event ID for the scheduled interview';
COMMENT ON COLUMN schedules.invitation_sent IS 'Whether calendar invitation has been sent to participants';
COMMENT ON COLUMN schedules.calendar_provider IS 'Calendar provider (google, outlook, etc.)';
COMMENT ON COLUMN schedules.calendar_owner_type IS 'Type of calendar owner (company, interviewer)';
COMMENT ON COLUMN schedules.calendar_owner_id IS 'ID of the calendar owner (interviewer ID or null for company)';
