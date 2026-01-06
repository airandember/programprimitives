-- Curriculum Infrastructure Migration
-- Adds languages, lessons, and scalable progress tracking

-- ============================================
-- LANGUAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS languages (
    id TEXT PRIMARY KEY,              -- 'javascript', 'python', 'go', 'rust'
    name TEXT NOT NULL,               -- 'JavaScript', 'Python', 'Go', 'Rust'
    display_order INTEGER DEFAULT 0,  -- Sort order in UI
    icon TEXT,                        -- Emoji or icon class
    file_extension TEXT,              -- '.js', '.py', '.go', '.rs'
    syntax_highlight TEXT,            -- Monaco/Prism language key
    sandbox_supported INTEGER DEFAULT 0,
    is_primary INTEGER DEFAULT 0,     -- Primary languages shown first
    is_active INTEGER DEFAULT 1,      -- Can be disabled without deletion
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Seed primary languages
INSERT OR IGNORE INTO languages (id, name, display_order, icon, file_extension, syntax_highlight, sandbox_supported, is_primary, is_active, created_at, updated_at)
VALUES 
('javascript', 'JavaScript', 1, '🟨', '.js', 'javascript', 1, 1, 1, datetime('now'), datetime('now')),
('python', 'Python', 2, '🐍', '.py', 'python', 0, 1, 1, datetime('now'), datetime('now')),
('go', 'Go', 3, '🐹', '.go', 'go', 0, 0, 1, datetime('now'), datetime('now')),
('typescript', 'TypeScript', 4, '🔷', '.ts', 'typescript', 0, 0, 0, datetime('now'), datetime('now')),
('rust', 'Rust', 5, '🦀', '.rs', 'rust', 0, 0, 0, datetime('now'), datetime('now'));

-- ============================================
-- LESSONS TABLE (Per Tool)
-- ============================================

CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    tool_id TEXT NOT NULL,
    slug TEXT NOT NULL,               -- URL-safe: 'off-by-one', 'for-syntax'
    title TEXT NOT NULL,              -- 'Off-By-One Errors'
    description TEXT NOT NULL,        -- Brief description for listings
    sequence_order INTEGER NOT NULL,  -- L1, L2, L3...
    difficulty_modifier REAL DEFAULT 0, -- Added to tool base difficulty
    content_markdown TEXT,            -- Lesson content (conceptual)
    estimated_minutes INTEGER DEFAULT 10,
    is_premium INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (tool_id) REFERENCES primitives(id),
    UNIQUE(tool_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_lessons_tool ON lessons(tool_id);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(tool_id, sequence_order);

-- ============================================
-- USER TOOL MASTERY (Conceptual - Language Agnostic)
-- ============================================

CREATE TABLE IF NOT EXISTS user_tool_mastery (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tool_id TEXT NOT NULL,
    concept_level TEXT DEFAULT 'stone',  -- stone, wood, bronze, iron, steel, mastered
    lessons_completed INTEGER DEFAULT 0,
    lessons_total INTEGER DEFAULT 0,
    last_studied_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES primitives(id),
    UNIQUE(user_id, tool_id)
);

CREATE INDEX IF NOT EXISTS idx_tool_mastery_user ON user_tool_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_mastery_tool ON user_tool_mastery(tool_id);

-- ============================================
-- USER TOOL LANGUAGE PROFICIENCY (Per Tool × Language)
-- ============================================

CREATE TABLE IF NOT EXISTS user_tool_language_proficiency (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tool_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    syntax_level TEXT DEFAULT 'stone',   -- Proficiency in this language
    exercises_completed INTEGER DEFAULT 0,
    exercises_total INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    last_practiced_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES primitives(id),
    FOREIGN KEY (language_id) REFERENCES languages(id),
    UNIQUE(user_id, tool_id, language_id)
);

CREATE INDEX IF NOT EXISTS idx_tool_lang_prof_user ON user_tool_language_proficiency(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_lang_prof_tool ON user_tool_language_proficiency(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_lang_prof_lang ON user_tool_language_proficiency(language_id);

-- ============================================
-- USER LESSON PROGRESS (Per Lesson)
-- ============================================

CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    status TEXT DEFAULT 'locked',      -- locked, available, in_progress, completed
    started_at TEXT,
    completed_at TEXT,
    exercises_completed INTEGER DEFAULT 0,
    exercises_total INTEGER DEFAULT 0,
    best_score INTEGER,
    attempts INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON user_lesson_progress(lesson_id);

-- ============================================
-- USER LANGUAGE SKILL (Aggregated)
-- ============================================

CREATE TABLE IF NOT EXISTS user_language_skill (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    tools_mastered INTEGER DEFAULT 0,   -- Tools at iron+ level
    tools_practiced INTEGER DEFAULT 0,  -- Tools with any progress
    overall_level INTEGER DEFAULT 1,    -- Aggregated level
    total_exercises INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    last_active_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES languages(id),
    UNIQUE(user_id, language_id)
);

CREATE INDEX IF NOT EXISTS idx_lang_skill_user ON user_language_skill(user_id);
CREATE INDEX IF NOT EXISTS idx_lang_skill_lang ON user_language_skill(language_id);

-- ============================================
-- TOOL LANGUAGE SUPPORT (Which tools exist in which languages)
-- ============================================

CREATE TABLE IF NOT EXISTS tool_language_support (
    id TEXT PRIMARY KEY,
    tool_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    is_supported INTEGER DEFAULT 1,      -- 1 = supported, 0 = not available
    alternative_tool_id TEXT,            -- If not supported, suggest this instead
    notes TEXT,                          -- "Use map() instead in JavaScript"
    created_at TEXT NOT NULL,
    FOREIGN KEY (tool_id) REFERENCES primitives(id),
    FOREIGN KEY (language_id) REFERENCES languages(id),
    FOREIGN KEY (alternative_tool_id) REFERENCES primitives(id),
    UNIQUE(tool_id, language_id)
);

CREATE INDEX IF NOT EXISTS idx_tool_lang_support_tool ON tool_language_support(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_lang_support_lang ON tool_language_support(language_id);

-- ============================================
-- ADD TIER COLUMN TO PRIMITIVES
-- ============================================

-- Add tier column if it doesn't exist
ALTER TABLE primitives ADD COLUMN tier INTEGER DEFAULT 1;

-- Add tier_name for display
ALTER TABLE primitives ADD COLUMN tier_name TEXT DEFAULT 'stone';
