// Package admin provides admin authentication and authorization
package admin

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/programprimitives/api/internal/auth"
	"github.com/programprimitives/api/internal/response"
)

// Middleware checks if the current user has admin privileges
type Middleware struct {
	db          *sql.DB
	authHandler *auth.Handler
}

// NewMiddleware creates a new admin middleware
func NewMiddleware(db *sql.DB, authHandler *auth.Handler) *Middleware {
	return &Middleware{db: db, authHandler: authHandler}
}

// RequireAdmin wraps a handler to require admin authentication
func (m *Middleware) RequireAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get user from session
		user := m.authHandler.GetUserFromSession(r)
		if user == nil {
			response.Unauthorized(w, "Authentication required")
			return
		}

		// Check if user is admin
		var role string
		err := m.db.QueryRow("SELECT role FROM users WHERE id = ?", user.ID).Scan(&role)
		if err != nil || role != "admin" {
			response.JSON(w, http.StatusForbidden, map[string]interface{}{
				"error":   "forbidden",
				"message": "Admin access required",
			})
			return
		}

		// User is admin, proceed
		next(w, r)
	}
}

// IsAdmin checks if a user ID has admin role
func (m *Middleware) IsAdmin(userID string) bool {
	var role string
	err := m.db.QueryRow("SELECT role FROM users WHERE id = ?", userID).Scan(&role)
	return err == nil && role == "admin"
}

// LogAction records an admin action in the audit log
func (m *Middleware) LogAction(adminUserID, action, entityType, entityID, oldData, newData, ipAddress string) error {
	_, err := m.db.Exec(`
		INSERT INTO admin_audit_log (id, admin_user_id, action, entity_type, entity_id, old_data, new_data, ip_address, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
	`, generateID(), adminUserID, action, entityType, entityID, oldData, newData, ipAddress)
	return err
}

// generateID creates a simple unique ID
func generateID() string {
	id, err := auth.GenerateUserID()
	if err != nil {
		// Fallback to timestamp-based ID
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return id
}
