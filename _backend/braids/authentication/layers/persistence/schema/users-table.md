# Users Table Schema

## Purpose
Stores user account information including credentials, profile data, and account settings.

## Table Definition

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,                    -- UUID v4
    email TEXT UNIQUE NOT NULL,             -- User's email address
    email_verified INTEGER DEFAULT 0,       -- Boolean: email verified
    password_hash TEXT,                     -- Bcrypt hash (null for OAuth-only)
    
    -- Profile
    display_name TEXT NOT NULL,             -- Public display name
    avatar_url TEXT,                        -- Profile picture URL
    
    -- Account Settings
    preferred_language TEXT DEFAULT 'javascript',  -- Default coding language
    theme TEXT DEFAULT 'dark',              -- UI theme preference
    
    -- OAuth
    oauth_provider TEXT,                    -- 'google', 'github', null for email
    oauth_id TEXT,                          -- Provider's user ID
    
    -- Subscription (denormalized for quick access)
    subscription_tier TEXT DEFAULT 'free',  -- 'free', 'learner', 'pro', 'team'
    subscription_status TEXT DEFAULT 'active',
    
    -- Timestamps
    created_at TEXT NOT NULL,               -- ISO 8601 timestamp
    updated_at TEXT NOT NULL,               -- ISO 8601 timestamp
    last_login_at TEXT,                     -- Last successful login
    
    -- Constraints
    UNIQUE(oauth_provider, oauth_id)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);
CREATE INDEX idx_users_subscription ON users(subscription_tier);
```

## Column Details

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | UUID v4, generated on insert |
| `email` | TEXT | Unique, lowercase, validated email |
| `email_verified` | INTEGER | 0 = false, 1 = true |
| `password_hash` | TEXT | Bcrypt with cost 12, null for OAuth users |
| `display_name` | TEXT | User-chosen name, defaults to email prefix |
| `avatar_url` | TEXT | URL to profile image |
| `preferred_language` | TEXT | Default language for exercises |
| `theme` | TEXT | 'dark' or 'light' |
| `oauth_provider` | TEXT | OAuth provider name or null |
| `oauth_id` | TEXT | Provider's unique user ID |
| `subscription_tier` | TEXT | Current subscription level |
| `subscription_status` | TEXT | 'active', 'canceled', 'past_due' |
| `created_at` | TEXT | Account creation timestamp |
| `updated_at` | TEXT | Last modification timestamp |
| `last_login_at` | TEXT | Most recent login |

## Notes

- D1 uses SQLite, so we use TEXT for dates (ISO 8601 format)
- Passwords are hashed with bcrypt, cost factor 12
- OAuth users have null password_hash
- subscription_tier is denormalized from subscriptions table for performance
- All UUIDs are v4, generated server-side

