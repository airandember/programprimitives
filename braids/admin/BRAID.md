# ADMIN Braid

## Purpose
Administrative interface for managing educational content, user roles, and platform settings.

## Status: ✅ Complete

## Scope

### Backend (Go)
- [x] Admin middleware (role checking)
- [x] CRUD handlers for primitives
- [x] CRUD handlers for exercises
- [x] Starter code management
- [x] Test case management
- [x] Primitive syntax management
- [x] User role management
- [x] Audit logging

### Frontend (SvelteKit)
- [x] Admin layout with sidebar
- [x] Dashboard with stats
- [x] Primitives list/editor
- [x] Exercises list/editor
- [x] Users management
- [x] Audit log viewer
- [x] Admin link in main nav

### Database
- [x] Role column on users table
- [x] Admin audit log table

## Dependencies
- **CORE**: Types, utilities
- **AUTH**: Session management, user info

## API Endpoints

### Dashboard
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/audit-log` - Admin action history

### Primitives
- `GET /api/admin/primitives` - List all primitives
- `POST /api/admin/primitives` - Create primitive
- `PUT /api/admin/primitives/{id}` - Update primitive
- `DELETE /api/admin/primitives/{id}` - Delete primitive

### Primitive Syntax
- `GET /api/admin/primitives/{id}/syntax` - List syntax for primitive
- `POST /api/admin/primitives/{id}/syntax` - Upsert syntax

### Exercises
- `GET /api/admin/exercises` - List all exercises
- `POST /api/admin/exercises` - Create exercise
- `PUT /api/admin/exercises/{id}` - Update exercise
- `DELETE /api/admin/exercises/{id}` - Delete exercise

### Starter Code
- `GET /api/admin/exercises/{id}/starter-code` - List starter code
- `POST /api/admin/exercises/{id}/starter-code` - Upsert starter code

### Test Cases
- `GET /api/admin/exercises/{id}/test-cases` - List test cases
- `POST /api/admin/exercises/{id}/test-cases` - Create test case
- `DELETE /api/admin/test-cases/{id}` - Delete test case

### Users
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/{id}/role` - Update user role

## Making Yourself Admin

After registering, run this SQL against your database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

On Fly.io:
```bash
fly ssh console
sqlite3 /data/programprimitives.db "UPDATE users SET role = 'admin' WHERE email = 'your@email.com';"
```

## Frontend Routes
- `/admin` - Dashboard
- `/admin/primitives` - Primitive management
- `/admin/exercises` - Exercise management
- `/admin/users` - User management
- `/admin/audit-log` - Audit log

## Security
- All admin routes protected by middleware
- Role check happens at Go backend level
- Actions are logged to audit table
- Frontend uses derived `isAdmin` store

## Future Enhancements
- [ ] Exercise starter code editor page
- [ ] Test case editor page
- [ ] Bulk import/export
- [ ] Content preview
- [ ] Analytics dashboard
- [ ] Email notifications
