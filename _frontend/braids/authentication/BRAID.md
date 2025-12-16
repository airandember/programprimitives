# Authentication Braid (Frontend)

## Purpose
Provides all user-facing authentication flows including login, registration, password management, and session handling. Creates a seamless, secure authentication experience.

## Scope
- Login page and form
- Registration page and form
- Password reset flow UI
- Email verification handling
- OAuth login buttons (Google, GitHub)
- Session state management
- Auth guards for protected routes
- User menu and profile access

## Dependencies
- **External**: None
- **Internal (Backend)**: Authentication Braid API

## Current Status
- [ ] Presentation Layer
- [ ] Application Layer
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **login-page** - Login form with email/password and OAuth
2. **register-page** - Registration form with validation
3. **password-reset** - Forgot password and reset UI
4. **auth-state** - Svelte stores for auth state
5. **protected-routes** - Route guards and redirects

## Pages & Routes
```
/login              - Login page
/register           - Registration page
/forgot-password    - Password reset request
/reset-password     - Password reset form
/verify-email       - Email verification handler
/oauth/callback     - OAuth callback handler
```

## Components
```
src/lib/components/auth/
├── LoginForm.svelte        - Email/password login
├── RegisterForm.svelte     - Registration form
├── OAuthButtons.svelte     - Google/GitHub sign-in
├── PasswordResetForm.svelte
├── UserMenu.svelte         - Logged-in user dropdown
└── AuthGuard.svelte        - Protected route wrapper
```

## State Management (Svelte Stores)
```typescript
// src/lib/stores/auth.ts
export const user = writable<User | null>(null);
export const isAuthenticated = derived(user, $u => !!$u);
export const isLoading = writable(true);

// Actions
export async function login(email: string, password: string): Promise<void>;
export async function register(data: RegisterData): Promise<void>;
export async function logout(): Promise<void>;
export async function refreshSession(): Promise<void>;
```

## UI/UX Guidelines
- Clean, minimal login/register forms
- Clear error messages with field-level validation
- Loading states on all auth actions
- Social login prominently displayed
- "Remember me" option
- Password strength indicator on registration
- Smooth transitions between auth states

