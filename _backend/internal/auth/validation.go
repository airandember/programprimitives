package auth

import (
	"regexp"
	"strings"
	"unicode"
)

// ValidationErrors holds field-specific errors
type ValidationErrors map[string][]string

// Add adds an error for a field
func (v ValidationErrors) Add(field, message string) {
	v[field] = append(v[field], message)
}

// HasErrors returns true if there are any errors
func (v ValidationErrors) HasErrors() bool {
	return len(v) > 0
}

// ValidateRegisterRequest validates registration input
func ValidateRegisterRequest(req *RegisterRequest) ValidationErrors {
	errors := make(ValidationErrors)

	// Validate email
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" {
		errors.Add("email", ErrEmailRequired)
	} else if !isValidEmail(req.Email) {
		errors.Add("email", ErrEmailInvalid)
	}

	// Validate password
	if req.Password == "" {
		errors.Add("password", ErrPasswordRequired)
	} else {
		if len(req.Password) < 8 {
			errors.Add("password", ErrPasswordTooShort)
		}
		if !hasUpperCase(req.Password) {
			errors.Add("password", ErrPasswordNoUpper)
		}
		if !hasLowerCase(req.Password) {
			errors.Add("password", ErrPasswordNoLower)
		}
		if !hasDigit(req.Password) {
			errors.Add("password", ErrPasswordNoNumber)
		}
	}

	// Validate display name
	req.DisplayName = strings.TrimSpace(req.DisplayName)
	if req.DisplayName == "" {
		errors.Add("displayName", ErrDisplayNameRequired)
	} else if len(req.DisplayName) < 2 {
		errors.Add("displayName", ErrDisplayNameTooShort)
	}

	return errors
}

// ValidateLoginRequest validates login input
func ValidateLoginRequest(req *LoginRequest) ValidationErrors {
	errors := make(ValidationErrors)

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" {
		errors.Add("email", ErrEmailRequired)
	}

	if req.Password == "" {
		errors.Add("password", ErrPasswordRequired)
	}

	return errors
}

// Email validation regex
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

func isValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

func hasUpperCase(s string) bool {
	for _, r := range s {
		if unicode.IsUpper(r) {
			return true
		}
	}
	return false
}

func hasLowerCase(s string) bool {
	for _, r := range s {
		if unicode.IsLower(r) {
			return true
		}
	}
	return false
}

func hasDigit(s string) bool {
	for _, r := range s {
		if unicode.IsDigit(r) {
			return true
		}
	}
	return false
}

