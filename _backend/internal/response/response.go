// Package response provides standardized API response helpers
package response

import (
	"encoding/json"
	"net/http"
)

// APIResponse is the standard response wrapper
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
	Meta    *APIMeta    `json:"meta,omitempty"`
}

// APIError represents an error response
type APIError struct {
	Code    string              `json:"code"`
	Message string              `json:"message"`
	Details map[string][]string `json:"details,omitempty"`
}

// APIMeta contains pagination and other metadata
type APIMeta struct {
	Page    int  `json:"page,omitempty"`
	Limit   int  `json:"limit,omitempty"`
	Total   int  `json:"total,omitempty"`
	HasMore bool `json:"hasMore,omitempty"`
}

// Error codes
const (
	ErrInternal           = "INTERNAL_ERROR"
	ErrValidation         = "VALIDATION_ERROR"
	ErrNotFound           = "NOT_FOUND"
	ErrForbidden          = "FORBIDDEN"
	ErrUnauthorized       = "UNAUTHORIZED"
	ErrInvalidCredentials = "INVALID_CREDENTIALS"
	ErrEmailTaken         = "EMAIL_TAKEN"
	ErrSessionExpired     = "SESSION_EXPIRED"
	ErrInvalidToken       = "INVALID_TOKEN"
)

// JSON sends a successful JSON response
func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    data,
	})
}

// JSONWithMeta sends a successful JSON response with metadata
func JSONWithMeta(w http.ResponseWriter, status int, data interface{}, meta *APIMeta) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(APIResponse{
		Success: true,
		Data:    data,
		Meta:    meta,
	})
}

// Error sends an error JSON response
func Error(w http.ResponseWriter, status int, code, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(APIResponse{
		Success: false,
		Error: &APIError{
			Code:    code,
			Message: message,
		},
	})
}

// ValidationError sends a validation error response with field details
func ValidationError(w http.ResponseWriter, message string, details map[string][]string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(APIResponse{
		Success: false,
		Error: &APIError{
			Code:    ErrValidation,
			Message: message,
			Details: details,
		},
	})
}

// Unauthorized sends a 401 unauthorized response
func Unauthorized(w http.ResponseWriter, message string) {
	Error(w, http.StatusUnauthorized, ErrUnauthorized, message)
}

// Forbidden sends a 403 forbidden response
func Forbidden(w http.ResponseWriter, message string) {
	Error(w, http.StatusForbidden, ErrForbidden, message)
}

// NotFound sends a 404 not found response
func NotFound(w http.ResponseWriter, message string) {
	Error(w, http.StatusNotFound, ErrNotFound, message)
}

// InternalError sends a 500 internal server error response
func InternalError(w http.ResponseWriter) {
	Error(w, http.StatusInternalServerError, ErrInternal, "An unexpected error occurred")
}

// InternalErrorWithMessage sends a 500 error with custom message
func InternalErrorWithMessage(w http.ResponseWriter, message string) {
	Error(w, http.StatusInternalServerError, ErrInternal, message)
}

// BadRequest sends a 400 bad request response
func BadRequest(w http.ResponseWriter, message string) {
	Error(w, http.StatusBadRequest, ErrValidation, message)
}
