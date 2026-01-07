package auth

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/programprimitives/api/internal/response"
)

// Handler holds dependencies for auth handlers
type Handler struct {
	db       *sql.DB
	// In-memory cache for sessions (for quick lookup)
	sessions map[string]*Session
	mu       sync.RWMutex
}

// NewHandler creates a new auth handler (in-memory only, for backwards compat)
func NewHandler() *Handler {
	return &Handler{
		sessions: make(map[string]*Session),
	}
}

// NewHandlerWithDB creates a new auth handler with database
func NewHandlerWithDB(db *sql.DB) *Handler {
	return &Handler{
		db:       db,
		sessions: make(map[string]*Session),
	}
}

// HandleRegister handles user registration
func (h *Handler) HandleRegister(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, response.ErrValidation, "Invalid request body")
		return
	}

	// Validate input
	errors := ValidateRegisterRequest(&req)
	if errors.HasErrors() {
		response.ValidationError(w, "Validation failed", errors)
		return
	}

	// Check if email already exists
	if h.db != nil {
		var exists int
		err := h.db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", req.Email).Scan(&exists)
		if err == nil && exists > 0 {
			response.Error(w, http.StatusConflict, response.ErrEmailTaken, "This email is already registered")
			return
		}
	}

	// Hash password
	passwordHash, err := HashPassword(req.Password)
	if err != nil {
		response.InternalError(w)
		return
	}

	// Generate user ID
	userID, err := GenerateUserID()
	if err != nil {
		response.InternalError(w)
		return
	}

	// Create user
	now := time.Now()
	user := &User{
		ID:                userID,
		Email:             req.Email,
		EmailVerified:     false,
		PasswordHash:      passwordHash,
		DisplayName:       req.DisplayName,
		PreferredLanguage: "javascript",
		Theme:             "dark",
		SubscriptionTier:  "free",
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	// Save user to database
	if h.db != nil {
		_, err := h.db.Exec(`
			INSERT INTO users (id, email, email_verified, password_hash, display_name, 
				preferred_language, theme, subscription_tier, subscription_status, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
		`, user.ID, user.Email, user.EmailVerified, user.PasswordHash, user.DisplayName,
			user.PreferredLanguage, user.Theme, user.SubscriptionTier,
			now.Format(time.RFC3339), now.Format(time.RFC3339))
		if err != nil {
			response.Error(w, http.StatusConflict, response.ErrEmailTaken, "This email is already registered")
			return
		}
	}

	// Create session
	session, err := h.createSession(user.ID)
	if err != nil {
		response.InternalError(w)
		return
	}

	// Set session cookie
	SetSessionCookie(w, session.ID, session.ExpiresAt)

	// Return response
	response.JSON(w, http.StatusCreated, AuthResponse{
		User:      user.ToPublic(),
		ExpiresAt: session.ExpiresAt,
	})
}

// HandleLogin handles user login
func (h *Handler) HandleLogin(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, response.ErrValidation, "Invalid request body")
		return
	}

	// Validate input
	errors := ValidateLoginRequest(&req)
	if errors.HasErrors() {
		response.ValidationError(w, "Validation failed", errors)
		return
	}

	// Find user
	var user *User
	if h.db != nil {
		user = h.findUserByEmail(req.Email)
	}
	
	if user == nil {
		response.Error(w, http.StatusUnauthorized, response.ErrInvalidCredentials, "Invalid email or password")
		return
	}

	// Check password
	if !CheckPassword(req.Password, user.PasswordHash) {
		response.Error(w, http.StatusUnauthorized, response.ErrInvalidCredentials, "Invalid email or password")
		return
	}

	// Update last login
	now := time.Now()
	user.LastLoginAt = &now
	if h.db != nil {
		h.db.Exec("UPDATE users SET last_login_at = ? WHERE id = ?", now.Format(time.RFC3339), user.ID)
	}

	// Create session
	session, err := h.createSession(user.ID)
	if err != nil {
		response.InternalError(w)
		return
	}

	// Set session cookie
	SetSessionCookie(w, session.ID, session.ExpiresAt)

	// Return response
	response.JSON(w, http.StatusOK, AuthResponse{
		User:      user.ToPublic(),
		ExpiresAt: session.ExpiresAt,
	})
}

// HandleLogout handles user logout
func (h *Handler) HandleLogout(w http.ResponseWriter, r *http.Request) {
	sessionID := GetSessionFromCookie(r)
	if sessionID != "" {
		h.mu.Lock()
		delete(h.sessions, sessionID)
		h.mu.Unlock()

		// Revoke in database
		if h.db != nil {
			h.db.Exec("UPDATE sessions SET revoked_at = ? WHERE id = ?", time.Now().Format(time.RFC3339), sessionID)
		}
	}

	ClearSessionCookie(w)
	response.JSON(w, http.StatusOK, map[string]string{"message": "Logged out successfully"})
}

// HandleMe returns the current user
func (h *Handler) HandleMe(w http.ResponseWriter, r *http.Request) {
	user := h.GetUserFromSession(r)
	if user == nil {
		response.Unauthorized(w, "No valid session found")
		return
	}
	response.JSON(w, http.StatusOK, user.ToPublic())
}

// HandleRefresh refreshes the session
func (h *Handler) HandleRefresh(w http.ResponseWriter, r *http.Request) {
	sessionID := GetSessionFromCookie(r)
	if sessionID == "" {
		response.Unauthorized(w, "No session found")
		return
	}

	h.mu.RLock()
	session, exists := h.sessions[sessionID]
	h.mu.RUnlock()

	if !exists {
		response.Unauthorized(w, "Invalid session")
		return
	}

	// Delete old session
	h.mu.Lock()
	delete(h.sessions, sessionID)
	h.mu.Unlock()

	// Create new session
	newSession, err := h.createSession(session.UserID)
	if err != nil {
		response.InternalError(w)
		return
	}

	// Find user
	user := h.findUserByID(session.UserID)
	if user == nil {
		response.Unauthorized(w, "User not found")
		return
	}

	SetSessionCookie(w, newSession.ID, newSession.ExpiresAt)
	response.JSON(w, http.StatusOK, AuthResponse{
		User:      user.ToPublic(),
		ExpiresAt: newSession.ExpiresAt,
	})
}

// createSession creates a new session for a user
func (h *Handler) createSession(userID string) (*Session, error) {
	sessionID, err := GenerateSessionID()
	if err != nil {
		return nil, err
	}

	now := time.Now()
	session := &Session{
		ID:        sessionID,
		UserID:    userID,
		ExpiresAt: now.Add(SessionDuration),
		CreatedAt: now,
	}

	h.mu.Lock()
	h.sessions[sessionID] = session
	h.mu.Unlock()

	// Persist to database
	if h.db != nil {
		h.db.Exec(`
			INSERT INTO sessions (id, user_id, refresh_token_hash, created_at, expires_at, last_used_at)
			VALUES (?, ?, '', ?, ?, ?)
		`, sessionID, userID, now.Format(time.RFC3339), session.ExpiresAt.Format(time.RFC3339), now.Format(time.RFC3339))
	}

	return session, nil
}

// GetUserFromSession retrieves the user from a request's session
func (h *Handler) GetUserFromSession(r *http.Request) *User {
	sessionID := GetSessionFromCookie(r)
	if sessionID == "" {
		return nil
	}

	// First check in-memory cache
	h.mu.RLock()
	session, exists := h.sessions[sessionID]
	h.mu.RUnlock()

	if exists && time.Now().Before(session.ExpiresAt) {
		return h.findUserByID(session.UserID)
	}

	// If not in memory, check database (session might have persisted across restart)
	if h.db != nil {
		var userID, expiresAtStr string
		err := h.db.QueryRow(`
			SELECT user_id, expires_at FROM sessions 
			WHERE id = ? AND revoked_at IS NULL
		`, sessionID).Scan(&userID, &expiresAtStr)
		
		if err == nil {
			expiresAt, _ := time.Parse(time.RFC3339, expiresAtStr)
			if time.Now().Before(expiresAt) {
				// Restore to memory cache
				h.mu.Lock()
				h.sessions[sessionID] = &Session{
					ID:        sessionID,
					UserID:    userID,
					ExpiresAt: expiresAt,
				}
				h.mu.Unlock()
				
				return h.findUserByID(userID)
			}
		}
	}

	return nil
}

// findUserByEmail finds a user by email
func (h *Handler) findUserByEmail(email string) *User {
	if h.db == nil {
		return nil
	}

	var user User
	var createdAt, updatedAt string
	var lastLoginAt, role sql.NullString

	err := h.db.QueryRow(`
		SELECT id, email, email_verified, password_hash, display_name, avatar_url,
			role, preferred_language, theme, subscription_tier, created_at, updated_at, last_login_at
		FROM users WHERE email = ?
	`, email).Scan(
		&user.ID, &user.Email, &user.EmailVerified, &user.PasswordHash, &user.DisplayName,
		&user.AvatarURL, &role, &user.PreferredLanguage, &user.Theme, &user.SubscriptionTier,
		&createdAt, &updatedAt, &lastLoginAt,
	)
	if err != nil {
		return nil
	}

	user.Role = "user"
	if role.Valid && role.String != "" {
		user.Role = role.String
	}
	user.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
	user.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt)
	if lastLoginAt.Valid {
		t, _ := time.Parse(time.RFC3339, lastLoginAt.String)
		user.LastLoginAt = &t
	}

	return &user
}

// findUserByID finds a user by ID
func (h *Handler) findUserByID(id string) *User {
	if h.db == nil {
		return nil
	}

	var user User
	var createdAt, updatedAt string
	var lastLoginAt, role sql.NullString

	err := h.db.QueryRow(`
		SELECT id, email, email_verified, password_hash, display_name, avatar_url,
			role, preferred_language, theme, subscription_tier, created_at, updated_at, last_login_at
		FROM users WHERE id = ?
	`, id).Scan(
		&user.ID, &user.Email, &user.EmailVerified, &user.PasswordHash, &user.DisplayName,
		&user.AvatarURL, &role, &user.PreferredLanguage, &user.Theme, &user.SubscriptionTier,
		&createdAt, &updatedAt, &lastLoginAt,
	)
	if err != nil {
		return nil
	}

	user.Role = "user"
	if role.Valid && role.String != "" {
		user.Role = role.String
	}
	user.CreatedAt, _ = time.Parse(time.RFC3339, createdAt)
	user.UpdatedAt, _ = time.Parse(time.RFC3339, updatedAt)
	if lastLoginAt.Valid {
		t, _ := time.Parse(time.RFC3339, lastLoginAt.String)
		user.LastLoginAt = &t
	}

	return &user
}
