# AUTH Braid

## Purpose
Handles all user authentication, authorization, and session management. This braid ensures secure access to the platform and manages user identity.

## Scope
- User registration (email/password)
- User login/logout
- Session management (JWT + refresh tokens)
- Password reset & recovery
- Email verification
- OAuth integration (Google, GitHub) - Phase 2
- Role-based access control

## Dependencies
- **External**: 
  - bcrypt (password hashing)
  - jose (JWT handling)
  - Cloudflare Workers KV (session storage)
  - Email service (verification emails)
- **Internal**: 
  - core (types, validation)

## Current Status
- [x] User registration (frontend)
- [x] User login (frontend)
- [ ] Session management (backend)
- [ ] Password reset (backend)
- [ ] Email verification
- [ ] OAuth (Phase 2)
- [x] Frontend integration
- [ ] Backend implementation
- [ ] Testing

## Strands

### 1. register
User registration flow
- Validate email/password
- Check email uniqueness
- Hash password
- Create user record
- Send verification email
- Auto-login after registration

### 2. login
Email/password authentication
- Validate credentials
- Verify password hash
- Create session
- Issue JWT tokens
- Set secure cookies

### 3. session
JWT token management
- Access token (15 min)
- Refresh token (30 days)
- Token rotation
- Session invalidation
- Multi-device support

### 4. logout
Session termination
- Clear tokens
- Remove from KV store
- Clear cookies
- Optional: logout all devices

### 5. password-reset
Forgot password flow
- Request reset email
- Validate reset token
- Update password
- Invalidate old sessions

### 6. email-verify
Email verification
- Send verification email
- Validate token
- Mark email verified

## API Endpoints

```
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Authenticate
POST   /api/auth/logout            - End session
POST   /api/auth/refresh           - Refresh tokens
POST   /api/auth/forgot-password   - Request reset
POST   /api/auth/reset-password    - Complete reset
GET    /api/auth/verify-email/:token
GET    /api/auth/me                - Get current user
```

## Database Schema

### users
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    email_verified INTEGER DEFAULT 0,
    password_hash TEXT,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'javascript',
    theme TEXT DEFAULT 'dark',
    subscription_tier TEXT DEFAULT 'free',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_login_at TEXT
);
```

### sessions (Workers KV)
```
Key:    session:{session_id}
Value:  { userId, expiresAt, tier }
TTL:    30 days
```

### password_resets
```sql
CREATE TABLE password_resets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL
);
```

## Security Considerations
- Password hashing with bcrypt (cost 12)
- JWT tokens in httpOnly cookies
- Refresh token rotation
- Rate limiting on auth endpoints
- CSRF protection
- Secure cookie settings (Secure, SameSite=Strict)

