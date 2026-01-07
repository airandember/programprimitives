-- Migration 010: Add missing admin columns to lessons table
-- These columns support the admin lesson editor

-- Visual elements JSON for UI display
ALTER TABLE lessons ADD COLUMN visual_elements TEXT;

-- Admin tracking columns
ALTER TABLE lessons ADD COLUMN last_edited_by TEXT;
ALTER TABLE lessons ADD COLUMN last_edited_at TEXT;
ALTER TABLE lessons ADD COLUMN version INTEGER DEFAULT 1;

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_lessons_edited ON lessons(last_edited_at);
