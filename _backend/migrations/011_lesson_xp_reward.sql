-- Add configurable XP reward per lesson
-- Default is 25 XP, can be adjusted for larger/smaller lessons

ALTER TABLE lessons ADD COLUMN xp_reward INTEGER DEFAULT 25;
