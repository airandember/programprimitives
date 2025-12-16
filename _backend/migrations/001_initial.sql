-- ProgramPrimitives Initial Database Schema
-- Cloudflare D1 (SQLite)

-- ============================================
-- Users & Authentication
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    email_verified INTEGER DEFAULT 0,
    password_hash TEXT,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'javascript',
    theme TEXT DEFAULT 'dark',
    oauth_provider TEXT,
    oauth_id TEXT,
    subscription_tier TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'active',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_login_at TEXT,
    UNIQUE(oauth_provider, oauth_id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    refresh_token_hash TEXT NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    last_used_at TEXT NOT NULL,
    revoked_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ============================================
-- Primitives & Content
-- ============================================

CREATE TABLE IF NOT EXISTS primitives (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    best_practices TEXT,
    pitfalls TEXT,
    difficulty INTEGER DEFAULT 1,
    prerequisites TEXT,
    related TEXT,
    icon TEXT,
    category_order INTEGER DEFAULT 0,
    is_premium INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_primitives_category ON primitives(category);
CREATE INDEX IF NOT EXISTS idx_primitives_published ON primitives(is_published);

CREATE TABLE IF NOT EXISTS primitive_syntax (
    id TEXT PRIMARY KEY,
    primitive_id TEXT NOT NULL,
    language TEXT NOT NULL,
    syntax_template TEXT NOT NULL,
    full_example TEXT NOT NULL,
    explanation TEXT,
    variations TEXT,
    is_primary INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (primitive_id) REFERENCES primitives(id) ON DELETE CASCADE,
    UNIQUE(primitive_id, language, is_primary)
);

CREATE INDEX IF NOT EXISTS idx_syntax_primitive ON primitive_syntax(primitive_id);
CREATE INDEX IF NOT EXISTS idx_syntax_language ON primitive_syntax(language);

-- ============================================
-- Exercises
-- ============================================

CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    primitive_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    estimated_minutes INTEGER DEFAULT 5,
    instructions TEXT NOT NULL,
    hints TEXT,
    sequence_order INTEGER DEFAULT 0,
    is_premium INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (primitive_id) REFERENCES primitives(id),
    UNIQUE(primitive_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_exercises_primitive ON exercises(primitive_id);
CREATE INDEX IF NOT EXISTS idx_exercises_published ON exercises(is_published);

CREATE TABLE IF NOT EXISTS exercise_starter_code (
    id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL,
    language TEXT NOT NULL,
    starter_code TEXT NOT NULL,
    solution_code TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    UNIQUE(exercise_id, language)
);

CREATE TABLE IF NOT EXISTS exercise_test_cases (
    id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden INTEGER DEFAULT 0,
    timeout_ms INTEGER DEFAULT 5000,
    sequence_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tests_exercise ON exercise_test_cases(exercise_id);

-- ============================================
-- Progress Tracking
-- ============================================

CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT PRIMARY KEY,
    total_exercises_completed INTEGER DEFAULT 0,
    total_primitives_mastered INTEGER DEFAULT 0,
    total_time_spent_minutes INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_daily_streak INTEGER DEFAULT 0,
    longest_daily_streak INTEGER DEFAULT 0,
    streak_last_date TEXT,
    last_activity_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS primitive_mastery (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    primitive_id TEXT NOT NULL,
    language TEXT NOT NULL,
    mastery_level INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,
    exercises_available INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    last_practiced_at TEXT,
    decay_factor REAL DEFAULT 1.0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (primitive_id) REFERENCES primitives(id),
    UNIQUE(user_id, primitive_id, language)
);

CREATE INDEX IF NOT EXISTS idx_mastery_user ON primitive_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_mastery_primitive ON primitive_mastery(primitive_id);

CREATE TABLE IF NOT EXISTS exercise_completions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    language TEXT NOT NULL,
    status TEXT NOT NULL,
    attempts INTEGER DEFAULT 1,
    hints_used INTEGER DEFAULT 0,
    score INTEGER,
    time_spent_seconds INTEGER,
    submitted_code TEXT,
    feedback_given TEXT,
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    UNIQUE(user_id, exercise_id, language)
);

CREATE INDEX IF NOT EXISTS idx_completions_user ON exercise_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_exercise ON exercise_completions(exercise_id);

-- ============================================
-- Gamification
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    xp_reward INTEGER DEFAULT 0,
    rarity TEXT DEFAULT 'common',
    trigger_condition TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at TEXT NOT NULL,
    notified INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

CREATE TABLE IF NOT EXISTS activity_log (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    activity_data TEXT,
    xp_earned INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_date ON activity_log(created_at);

-- ============================================
-- Subscriptions
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tier TEXT NOT NULL,
    status TEXT NOT NULL,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    current_period_start TEXT,
    current_period_end TEXT,
    cancel_at_period_end INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

