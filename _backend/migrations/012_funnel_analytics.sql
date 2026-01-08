-- Funnel Analytics - Track conversion events for optimization
-- Captures user journey touchpoints and conversion opportunities

-- ============================================
-- FUNNEL EVENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS funnel_events (
    id TEXT PRIMARY KEY,
    
    -- Who triggered the event
    user_id TEXT,                     -- NULL for anonymous users
    session_id TEXT NOT NULL,         -- Anonymous session tracking
    
    -- Event details
    event_type TEXT NOT NULL,         -- 'view', 'click', 'dismiss', 'convert'
    funnel_name TEXT NOT NULL,        -- 'try_signup', 'lesson_gate', 'premium_exercise', etc.
    touchpoint TEXT NOT NULL,         -- 'try_complete_1', 'lesson_locked', 'header_upgrade', etc.
    
    -- Context
    source_page TEXT,                 -- Where the event happened
    exercise_id TEXT,                 -- If exercise-related
    lesson_id TEXT,                   -- If lesson-related
    primitive_id TEXT,                -- If tool-related
    
    -- Metadata
    metadata TEXT,                    -- JSON for additional context
    
    -- Conversion tracking
    converted_at TEXT,                -- When user converted (signed up/subscribed)
    conversion_type TEXT,             -- 'signup', 'subscribe', 'upgrade'
    
    -- Device info
    device_type TEXT,                 -- 'desktop', 'mobile', 'tablet'
    browser TEXT,
    
    -- Timestamps
    created_at TEXT NOT NULL,
    
    -- Indexes for analytics queries
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_funnel_events_session ON funnel_events(session_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_type ON funnel_events(event_type);
CREATE INDEX IF NOT EXISTS idx_funnel_events_funnel ON funnel_events(funnel_name);
CREATE INDEX IF NOT EXISTS idx_funnel_events_touchpoint ON funnel_events(touchpoint);
CREATE INDEX IF NOT EXISTS idx_funnel_events_created ON funnel_events(created_at);
CREATE INDEX IF NOT EXISTS idx_funnel_events_user ON funnel_events(user_id);

-- ============================================
-- FUNNEL AGGREGATES TABLE (for dashboard)
-- ============================================

CREATE TABLE IF NOT EXISTS funnel_daily_stats (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,               -- YYYY-MM-DD
    funnel_name TEXT NOT NULL,
    touchpoint TEXT NOT NULL,
    
    -- Counts
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    dismisses INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    
    -- Calculated
    click_rate REAL DEFAULT 0,        -- clicks / views
    conversion_rate REAL DEFAULT 0,   -- conversions / views
    
    -- Unique counts
    unique_sessions INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    
    UNIQUE(date, funnel_name, touchpoint)
);

CREATE INDEX IF NOT EXISTS idx_funnel_daily_date ON funnel_daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_funnel_daily_funnel ON funnel_daily_stats(funnel_name);

-- ============================================
-- CONVERSION ATTRIBUTION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS conversion_attribution (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    
    -- What converted them
    attributed_funnel TEXT NOT NULL,   -- Which funnel got credit
    attributed_touchpoint TEXT NOT NULL,
    
    -- Journey tracking
    first_touchpoint TEXT,             -- First funnel interaction
    last_touchpoint TEXT,              -- Touchpoint before conversion
    touchpoint_count INTEGER DEFAULT 0,-- How many touchpoints before converting
    
    -- Conversion details
    conversion_type TEXT NOT NULL,     -- 'signup', 'subscribe'
    subscription_plan TEXT,            -- If subscribe: 'monthly', 'yearly'
    revenue REAL DEFAULT 0,            -- If purchase
    
    -- Timestamps
    first_seen_at TEXT,
    converted_at TEXT NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attribution_user ON conversion_attribution(user_id);
CREATE INDEX IF NOT EXISTS idx_attribution_funnel ON conversion_attribution(attributed_funnel);
