-- Add is_daily flag to rules table
ALTER TABLE rules ADD COLUMN IF NOT EXISTS is_daily BOOLEAN DEFAULT false;

-- Add streak tracking fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_rules_completed_at TIMESTAMP WITH TIME ZONE;
