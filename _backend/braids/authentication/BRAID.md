# Authentication Braid

## Purpose
Handles all user authentication, authorization, and session management for ProgramPrimitives.com. This braid ensures secure access to the platform and manages user identity across all features.

## Scope
- User registration (email/password, OAuth providers)
- User login/logout
- Session management (JWT tokens)
- Password reset & recovery
- Email verification
- OAuth2 integration (Google, GitHub)
- Role-based access control (free/premium users)

## Dependencies
- **External**: 
  - Email service (SendGrid/Postmark) for verification emails
  - OAuth providers (Google, GitHub)
  - Cloudflare Workers KV for session storage
- **Internal**: None (foundational braid)

## Current Status
- [ ] Persistence Layer
- [ ] Data Access Layer
- [ ] Business Logic Layer
- [ ] Application Layer
- [ ] Frontend Integration
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **user-registration** - Sign up flow with email verification
2. **user-login** - Email/password and OAuth login
3. **password-reset** - Forgot password flow
4. **session-management** - JWT handling, refresh tokens, logout
5. **oauth-integration** - Google and GitHub sign-in

## Technical Notes
- Using JWT tokens stored in httpOnly cookies for security
- Refresh tokens stored in Cloudflare Workers KV
- Password hashing with bcrypt (cost factor 12)
- Rate limiting on auth endpoints to prevent brute force

## API Endpoints (Planned)
```
POST   /api/auth/register      - Create new account
POST   /api/auth/login         - Authenticate user
POST   /api/auth/logout        - End session
POST   /api/auth/refresh       - Refresh access token
POST   /api/auth/forgot        - Initiate password reset
POST   /api/auth/reset         - Complete password reset
GET    /api/auth/verify/:token - Verify email address
GET    /api/auth/oauth/:provider - OAuth initiation
GET    /api/auth/callback/:provider - OAuth callback
GET    /api/auth/me            - Get current user
```

