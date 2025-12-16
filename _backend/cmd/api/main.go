// ProgramPrimitives API - Cloudflare Workers Entry Point
// Built with Go + syumai/workers for WASM compilation
package main

import (
	"encoding/json"
	"net/http"

	"github.com/syumai/workers"
)

func main() {
	// Create router
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /api/health", handleHealth)

	// Auth routes
	mux.HandleFunc("POST /api/auth/register", handleRegister)
	mux.HandleFunc("POST /api/auth/login", handleLogin)
	mux.HandleFunc("POST /api/auth/logout", handleLogout)
	mux.HandleFunc("GET /api/auth/me", handleMe)

	// Primitives routes
	mux.HandleFunc("GET /api/primitives", handleListPrimitives)
	mux.HandleFunc("GET /api/primitives/{id}", handleGetPrimitive)
	mux.HandleFunc("GET /api/primitives/{id}/syntax/{lang}", handleGetSyntax)

	// Exercise routes
	mux.HandleFunc("GET /api/exercises", handleListExercises)
	mux.HandleFunc("GET /api/exercises/{id}", handleGetExercise)
	mux.HandleFunc("POST /api/exercises/{id}/run", handleRunCode)
	mux.HandleFunc("POST /api/exercises/{id}/submit", handleSubmitSolution)

	// Progress routes
	mux.HandleFunc("GET /api/progress", handleGetProgress)
	mux.HandleFunc("GET /api/progress/primitives", handleGetMastery)

	// Gamification routes
	mux.HandleFunc("GET /api/achievements", handleListAchievements)
	mux.HandleFunc("GET /api/leaderboard/{period}", handleLeaderboard)

	// Wrap with CORS middleware
	handler := corsMiddleware(mux)

	// Start Cloudflare Workers server
	workers.Serve(handler)
}

// corsMiddleware adds CORS headers for frontend communication
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get origin from environment (set in wrangler.toml)
		origin := "http://localhost:5173" // Default for dev

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Response helpers
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(APIResponse{Success: true, Data: data})
}

func jsonError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(APIResponse{Success: false, Error: message})
}

// ============================================
// Health Check Handler
// ============================================

func handleHealth(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, http.StatusOK, map[string]string{
		"status":  "healthy",
		"service": "programprimitives-api",
		"version": "0.1.0",
	})
}

// ============================================
// Auth Handlers (Stubs)
// ============================================

func handleRegister(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement registration
	jsonResponse(w, http.StatusOK, map[string]string{"message": "Registration endpoint"})
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement login
	jsonResponse(w, http.StatusOK, map[string]string{"message": "Login endpoint"})
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement logout
	jsonResponse(w, http.StatusOK, map[string]string{"message": "Logout endpoint"})
}

func handleMe(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement user info
	jsonResponse(w, http.StatusOK, map[string]string{"message": "User info endpoint"})
}

// ============================================
// Primitives Handlers (Stubs)
// ============================================

func handleListPrimitives(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement listing
	primitives := []map[string]interface{}{
		{
			"id":          "for-loop",
			"name":        "For Loop",
			"category":    "fundamentals",
			"difficulty":  2,
			"description": "Execute code a specific number of times",
		},
		{
			"id":          "while-loop",
			"name":        "While Loop",
			"category":    "fundamentals",
			"difficulty":  2,
			"description": "Execute code while a condition is true",
		},
		{
			"id":          "if-else",
			"name":        "If/Else Conditional",
			"category":    "fundamentals",
			"difficulty":  1,
			"description": "Execute different code based on conditions",
		},
	}
	jsonResponse(w, http.StatusOK, primitives)
}

func handleGetPrimitive(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: Fetch from database
	primitive := map[string]interface{}{
		"id":            id,
		"name":          "For Loop",
		"category":      "fundamentals",
		"description":   "Execute code a specific number of times",
		"why_it_matters": "For loops are fundamental to processing data...",
		"best_practices": []string{
			"Use meaningful iterator names",
			"Avoid modifying loop variable inside the loop",
		},
		"pitfalls": []string{
			"Off-by-one errors",
			"Infinite loops",
		},
	}
	jsonResponse(w, http.StatusOK, primitive)
}

func handleGetSyntax(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	lang := r.PathValue("lang")
	// TODO: Fetch from database
	syntax := map[string]interface{}{
		"primitive_id": id,
		"language":     lang,
		"syntax":       "for (let i = 0; i < n; i++) {\n  // code\n}",
		"example":      "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}",
	}
	jsonResponse(w, http.StatusOK, syntax)
}

// ============================================
// Exercise Handlers (Stubs)
// ============================================

func handleListExercises(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement listing
	exercises := []map[string]interface{}{
		{
			"id":           "ex-001",
			"primitive_id": "for-loop",
			"title":        "Sum of Numbers",
			"difficulty":   2,
		},
	}
	jsonResponse(w, http.StatusOK, exercises)
}

func handleGetExercise(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: Fetch from database
	exercise := map[string]interface{}{
		"id":           id,
		"primitive_id": "for-loop",
		"title":        "Sum of Numbers",
		"description":  "Calculate the sum of numbers from 1 to n",
		"instructions": "Write a function sumToN(n) that returns the sum...",
		"starter_code": "function sumToN(n) {\n  // Your code here\n}",
	}
	jsonResponse(w, http.StatusOK, exercise)
}

func handleRunCode(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement code execution sandbox
	jsonResponse(w, http.StatusOK, map[string]interface{}{
		"output": "5\n",
		"errors": nil,
		"time":   "23ms",
	})
}

func handleSubmitSolution(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement solution submission
	jsonResponse(w, http.StatusOK, map[string]interface{}{
		"passed":     true,
		"score":      95,
		"tests":      []string{"Basic case: PASS", "Edge case: PASS"},
		"xp_earned":  25,
		"completion": "first_completion",
	})
}

// ============================================
// Progress Handlers (Stubs)
// ============================================

func handleGetProgress(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement progress retrieval
	jsonResponse(w, http.StatusOK, map[string]interface{}{
		"total_exercises":   15,
		"current_streak":    7,
		"total_xp":          1250,
		"level":             5,
		"primitives_started": 8,
	})
}

func handleGetMastery(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement mastery retrieval
	mastery := []map[string]interface{}{
		{"primitive_id": "for-loop", "language": "javascript", "level": 4},
		{"primitive_id": "while-loop", "language": "javascript", "level": 3},
	}
	jsonResponse(w, http.StatusOK, mastery)
}

// ============================================
// Gamification Handlers (Stubs)
// ============================================

func handleListAchievements(w http.ResponseWriter, r *http.Request) {
	achievements := []map[string]interface{}{
		{"id": "first-steps", "name": "First Steps", "unlocked": true},
		{"id": "streak-7", "name": "Week Warrior", "unlocked": true},
		{"id": "streak-30", "name": "Month Master", "unlocked": false},
	}
	jsonResponse(w, http.StatusOK, achievements)
}

func handleLeaderboard(w http.ResponseWriter, r *http.Request) {
	period := r.PathValue("period")
	leaderboard := []map[string]interface{}{
		{"rank": 1, "user": "codemaster", "xp": 15000, "period": period},
		{"rank": 2, "user": "loopninja", "xp": 12500, "period": period},
		{"rank": 3, "user": "functionfan", "xp": 11000, "period": period},
	}
	jsonResponse(w, http.StatusOK, leaderboard)
}

