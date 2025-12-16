# Sessions Table Schema

## Purpose
Manages active user sessions and refresh tokens. Uses Workers KV for fast access with D1 as backup.

## Table Definition (D1 - Backup/Audit)

```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,                    -- UUID v4 session ID
    user_id TEXT NOT NULL,                  -- Foreign key to users
    
    -- Token Info
    refresh_token_hash TEXT NOT NULL,       -- Hashed refresh token
    
    -- Session Metadata
    device_info TEXT,                       -- User agent string
    ip_address TEXT,                        -- Last known IP
    
    -- Lifecycle
    created_at TEXT NOT NULL,               -- Session start
    expires_at TEXT NOT NULL,               -- Session expiry
    last_used_at TEXT NOT NULL,             -- Last activity
    revoked_at TEXT,                        -- Manual revocation timestamp
    
    -- Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_refresh ON sessions(refresh_token_hash);
```

## Workers KV Structure

For fast session validation, active sessions are stored in Workers KV:

```
Key:    session:{session_id}
Value:  {
    "user_id": "uuid",
    "expires_at": "2024-02-01T00:00:00Z",
    "tier": "pro"
}
TTL:    Matches expires_at
```

```
Key:    user_sessions:{user_id}
Value:  ["session_id_1", "session_id_2", ...]
TTL:    30 days
```

## Token Strategy

```
ACCESS TOKEN (JWT)
├── Short-lived: 15 minutes
├── Stored: httpOnly cookie + memory
├── Contains: user_id, tier, email
└── Refresh: Silent refresh before expiry

REFRESH TOKEN
├── Long-lived: 30 days
├── Stored: httpOnly cookie + KV
├── Single-use: Rotated on each refresh
└── Revocable: Can invalidate all sessions
```

## Session Lifecycle

```
1. LOGIN
   ├── Create session in D1
   ├── Store in Workers KV
   ├── Issue access + refresh tokens
   └── Set httpOnly cookies

2. REQUEST
   ├── Validate access token (JWT)
   ├── If expired, use refresh token
   └── Update last_used_at

3. REFRESH
   ├── Validate refresh token against KV
   ├── Rotate refresh token (new token)
   ├── Issue new access token
   └── Update D1 record

4. LOGOUT
   ├── Remove from Workers KV
   ├── Set revoked_at in D1
   └── Clear cookies

5. LOGOUT ALL
   ├── Remove all user sessions from KV
   ├── Revoke all in D1
   └── Force re-login
```

## Security Considerations

- Refresh tokens are hashed before storage
- Access tokens contain minimal claims
- All tokens use httpOnly, Secure, SameSite=Strict cookies
- Session rotation on privilege escalation
- Automatic cleanup of expired sessions

