// Package auth provides authentication functionality
package auth

import "time"

// User represents a user in the system
type User struct {
	ID                string    `json:"id"`
	Email             string    `json:"email"`
	EmailVerified     bool      `json:"emailVerified"`
	PasswordHash      string    `json:"-"` // Never expose in JSON
	DisplayName       string    `json:"displayName"`
	AvatarURL         *string   `json:"avatarUrl,omitempty"`
	Role              string    `json:"role"` // "user" or "admin"
	PreferredLanguage string    `json:"preferredLanguage"`
	Theme             string    `json:"theme"`
	SubscriptionTier  string    `json:"subscriptionTier"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
	LastLoginAt       *time.Time `json:"lastLoginAt,omitempty"`
}

// UserPublic is the public representation of a user (safe to expose)
type UserPublic struct {
	ID                string    `json:"id"`
	Email             string    `json:"email"`
	EmailVerified     bool      `json:"emailVerified"`
	DisplayName       string    `json:"displayName"`
	AvatarURL         *string   `json:"avatarUrl,omitempty"`
	Role              string    `json:"role"`
	PreferredLanguage string    `json:"preferredLanguage"`
	Theme             string    `json:"theme"`
	SubscriptionTier  string    `json:"subscriptionTier"`
	CreatedAt         time.Time `json:"createdAt"`
	LastLoginAt       *time.Time `json:"lastLoginAt,omitempty"`
}

// ToPublic converts a User to UserPublic (safe to expose)
func (u *User) ToPublic() UserPublic {
	role := u.Role
	if role == "" {
		role = "user" // Default role
	}
	return UserPublic{
		ID:                u.ID,
		Email:             u.Email,
		EmailVerified:     u.EmailVerified,
		DisplayName:       u.DisplayName,
		AvatarURL:         u.AvatarURL,
		Role:              role,
		PreferredLanguage: u.PreferredLanguage,
		Theme:             u.Theme,
		SubscriptionTier:  u.SubscriptionTier,
		CreatedAt:         u.CreatedAt,
		LastLoginAt:       u.LastLoginAt,
	}
}

// Session represents an active user session
type Session struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}

// RegisterRequest is the request body for registration
type RegisterRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName"`
}

// LoginRequest is the request body for login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse is the response for successful authentication
type AuthResponse struct {
	User      UserPublic `json:"user"`
	ExpiresAt time.Time  `json:"expiresAt"`
}

// Validation error messages
var (
	ErrEmailRequired       = "Email is required"
	ErrEmailInvalid        = "Please enter a valid email address"
	ErrPasswordRequired    = "Password is required"
	ErrPasswordTooShort    = "Password must be at least 8 characters"
	ErrPasswordNoUpper     = "Password must contain at least one uppercase letter"
	ErrPasswordNoLower     = "Password must contain at least one lowercase letter"
	ErrPasswordNoNumber    = "Password must contain at least one number"
	ErrDisplayNameRequired = "Display name is required"
	ErrDisplayNameTooShort = "Display name must be at least 2 characters"
)

