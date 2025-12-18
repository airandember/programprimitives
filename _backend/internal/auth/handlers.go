package auth

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/programprimitives/api/internal/response"
)

// Handler holds dependencies for auth handlers
type Handler struct {
	// In production, this would have DB connection
	// For now, we'll use in-memory storage for demo
	users    map[string]*User   // email -> User
	sessions map[string]*Session // sessionID -> Session
}

// NewHandler creates a new auth handler
func NewHandler() *Handler {
	return &Handler{
		users:    make(map[string]*User),
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
	if _, exists := h.users[req.Email]; exists {
		response.Error(w, http.StatusConflict, response.ErrEmailTaken, "This email is already registered")
		return
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

	// Save user (in-memory for now)
	h.users[req.Email] = user

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
	user, exists := h.users[req.Email]
	if !exists {
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
	// Get session from cookie
	sessionID := GetSessionFromCookie(r)
	if sessionID != "" {
		// Delete session
		delete(h.sessions, sessionID)
	}

	// Clear cookie
	ClearSessionCookie(w)

	response.JSON(w, http.StatusOK, map[string]string{"message": "Logged out successfully"})
}

// HandleMe returns the current user
func (h *Handler) HandleMe(w http.ResponseWriter, r *http.Request) {
	// Get session from cookie
	sessionID := GetSessionFromCookie(r)
	if sessionID == "" {
		response.Unauthorized(w, "No session found")
		return
	}

	// Find session
	session, exists := h.sessions[sessionID]
	if !exists {
		response.Unauthorized(w, "Invalid session")
		return
	}

	// Check if expired
	if time.Now().After(session.ExpiresAt) {
		delete(h.sessions, sessionID)
		ClearSessionCookie(w)
		response.Error(w, http.StatusUnauthorized, response.ErrSessionExpired, "Session expired")
		return
	}

	// Find user
	var user *User
	for _, u := range h.users {
		if u.ID == session.UserID {
			user = u
			break
		}
	}

	if user == nil {
		response.Unauthorized(w, "User not found")
		return
	}

	response.JSON(w, http.StatusOK, user.ToPublic())
}

// HandleRefresh refreshes the session
func (h *Handler) HandleRefresh(w http.ResponseWriter, r *http.Request) {
	// Get session from cookie
	sessionID := GetSessionFromCookie(r)
	if sessionID == "" {
		response.Unauthorized(w, "No session found")
		return
	}

	// Find session
	session, exists := h.sessions[sessionID]
	if !exists {
		response.Unauthorized(w, "Invalid session")
		return
	}

	// Delete old session
	delete(h.sessions, sessionID)

	// Create new session
	newSession, err := h.createSession(session.UserID)
	if err != nil {
		response.InternalError(w)
		return
	}

	// Find user
	var user *User
	for _, u := range h.users {
		if u.ID == session.UserID {
			user = u
			break
		}
	}

	if user == nil {
		response.Unauthorized(w, "User not found")
		return
	}

	// Set new cookie
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

	h.sessions[sessionID] = session
	return session, nil
}

// GetUserFromSession retrieves the user from a request's session
// This is useful for protected routes
func (h *Handler) GetUserFromSession(r *http.Request) *User {
	sessionID := GetSessionFromCookie(r)
	if sessionID == "" {
		return nil
	}

	session, exists := h.sessions[sessionID]
	if !exists || time.Now().After(session.ExpiresAt) {
		return nil
	}

	for _, u := range h.users {
		if u.ID == session.UserID {
			return u
		}
	}

	return nil
}

