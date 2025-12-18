// ProgramPrimitives API - Cloudflare Workers Entry Point
// Built with Go + syumai/workers for WASM compilation
package main

import (
	"encoding/json"
	"net/http"

	"github.com/programprimitives/api/internal/auth"
	"github.com/programprimitives/api/internal/response"
	"github.com/programprimitives/api/internal/sandbox"
	"github.com/syumai/workers"
)

// Global handlers (in production, use dependency injection)
var authHandler = auth.NewHandler()
var sandboxHandler = sandbox.NewHandler()

func main() {
	// Create router
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /api/health", handleHealth)

	// Auth routes
	mux.HandleFunc("POST /api/auth/register", authHandler.HandleRegister)
	mux.HandleFunc("POST /api/auth/login", authHandler.HandleLogin)
	mux.HandleFunc("POST /api/auth/logout", authHandler.HandleLogout)
	mux.HandleFunc("POST /api/auth/refresh", authHandler.HandleRefresh)
	mux.HandleFunc("GET /api/auth/me", authHandler.HandleMe)

	// Primitives routes
	mux.HandleFunc("GET /api/primitives", handleListPrimitives)
	mux.HandleFunc("GET /api/primitives/{id}", handleGetPrimitive)
	mux.HandleFunc("GET /api/primitives/{id}/syntax/{lang}", handleGetSyntax)

	// Exercise routes
	mux.HandleFunc("GET /api/exercises", handleListExercises)
	mux.HandleFunc("GET /api/exercises/{id}", handleGetExercise)
	mux.HandleFunc("POST /api/exercises/{id}/run", handleRunCode)
	mux.HandleFunc("POST /api/exercises/{id}/submit", handleSubmitSolution)

	// Sandbox routes - code execution engine
	mux.HandleFunc("POST /api/sandbox/run", sandboxHandler.HandleRun)
	mux.HandleFunc("POST /api/sandbox/test", sandboxHandler.HandleTest)
	mux.HandleFunc("POST /api/sandbox/submit", sandboxHandler.HandleSubmit)

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

// ============================================
// Health Check Handler
// ============================================

func handleHealth(w http.ResponseWriter, r *http.Request) {
	response.JSON(w, http.StatusOK, map[string]string{
		"status":  "healthy",
		"service": "programprimitives-api",
		"version": "0.1.0",
	})
}

// ============================================
// Primitives Handlers (Stubs)
// ============================================

func handleListPrimitives(w http.ResponseWriter, r *http.Request) {
	// TODO: Fetch from database
	primitives := []map[string]interface{}{
		{
			"id":          "variables",
			"name":        "Variables",
			"category":    "fundamentals",
			"difficulty":  1,
			"description": "Named storage locations that hold data values",
			"icon":        "📦",
			"isPremium":   false,
		},
		{
			"id":          "for-loop",
			"name":        "For Loop",
			"category":    "fundamentals",
			"difficulty":  2,
			"description": "Execute code a specific number of times with a counter",
			"icon":        "🔄",
			"isPremium":   false,
		},
		{
			"id":          "conditionals",
			"name":        "Conditionals",
			"category":    "fundamentals",
			"difficulty":  1,
			"description": "Execute different code based on whether conditions are true or false",
			"icon":        "🔀",
			"isPremium":   false,
		},
		{
			"id":          "while-loop",
			"name":        "While Loop",
			"category":    "fundamentals",
			"difficulty":  2,
			"description": "Execute code repeatedly while a condition remains true",
			"icon":        "🔁",
			"isPremium":   false,
		},
		{
			"id":          "functions",
			"name":        "Functions",
			"category":    "fundamentals",
			"difficulty":  2,
			"description": "Reusable blocks of code that perform specific tasks",
			"icon":        "⚡",
			"isPremium":   false,
		},
		{
			"id":          "arrays",
			"name":        "Arrays",
			"category":    "data-structures",
			"difficulty":  2,
			"description": "Ordered collections of elements accessed by index",
			"icon":        "📊",
			"isPremium":   false,
		},
	}
	response.JSON(w, http.StatusOK, primitives)
}

func handleGetPrimitive(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	// TODO: Fetch from database
	primitive := map[string]interface{}{
		"id":            id,
		"name":          "For Loop",
		"category":      "fundamentals",
		"description":   "Execute code a specific number of times with a counter",
		"whyItMatters":  "For loops are essential for processing collections and repeating operations. They're one of the most frequently used constructs in programming.",
		"bestPractices": []string{
			"Use meaningful iterator variable names",
			"Avoid modifying loop variable inside the loop",
			"Consider forEach/map for array iteration",
		},
		"pitfalls": []string{
			"Off-by-one errors (i <= n vs i < n)",
			"Infinite loops when condition never becomes false",
			"Modifying array length while iterating",
		},
		"difficulty":    2,
		"icon":          "🔄",
		"isPremium":     false,
		"prerequisites": []string{},
		"related":       []string{"while-loop", "arrays"},
	}
	response.JSON(w, http.StatusOK, primitive)
}

func handleGetSyntax(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	lang := r.PathValue("lang")
	
	syntaxMap := map[string]map[string]interface{}{
		"javascript": {
			"primitiveId":    id,
			"language":       lang,
			"syntaxTemplate": "for (let i = 0; i < n; i++) {\n  // code to repeat\n}",
			"fullExample":    "// Print numbers 1 to 5\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n// Output: 1, 2, 3, 4, 5",
			"explanation":    "The for loop has three parts: initialization (let i = 0), condition (i < n), and increment (i++). The loop continues while the condition is true.",
		},
		"python": {
			"primitiveId":    id,
			"language":       lang,
			"syntaxTemplate": "for i in range(n):\n    # code to repeat",
			"fullExample":    "# Print numbers 1 to 5\nfor i in range(1, 6):\n    print(i)\n# Output: 1, 2, 3, 4, 5",
			"explanation":    "Python uses range() to generate a sequence. range(1, 6) creates numbers 1 through 5 (end is exclusive).",
		},
		"go": {
			"primitiveId":    id,
			"language":       lang,
			"syntaxTemplate": "for i := 0; i < n; i++ {\n    // code to repeat\n}",
			"fullExample":    "// Print numbers 1 to 5\nfor i := 1; i <= 5; i++ {\n    fmt.Println(i)\n}\n// Output: 1, 2, 3, 4, 5",
			"explanation":    "Go only has the for loop (no while). It uses := for short variable declaration within the loop.",
		},
	}

	if syntax, ok := syntaxMap[lang]; ok {
		response.JSON(w, http.StatusOK, syntax)
	} else {
		// Default to JavaScript
		response.JSON(w, http.StatusOK, syntaxMap["javascript"])
	}
}

// ============================================
// Exercise Handlers (Stubs)
// ============================================

func handleListExercises(w http.ResponseWriter, r *http.Request) {
	exercises := []map[string]interface{}{
		{
			"id":               "ex-001",
			"primitiveId":      "for-loop",
			"title":            "Sum of Numbers",
			"description":      "Calculate the sum of all numbers from 1 to n using a for loop",
			"difficulty":       2,
			"estimatedMinutes": 5,
			"isPremium":        false,
		},
		{
			"id":               "ex-002",
			"primitiveId":      "for-loop",
			"title":            "Array Sum",
			"description":      "Calculate the sum of all elements in an array",
			"difficulty":       2,
			"estimatedMinutes": 5,
			"isPremium":        false,
		},
		{
			"id":               "ex-003",
			"primitiveId":      "variables",
			"title":            "Variable Swap",
			"description":      "Swap the values of two variables",
			"difficulty":       1,
			"estimatedMinutes": 3,
			"isPremium":        false,
		},
	}
	response.JSON(w, http.StatusOK, exercises)
}

func handleGetExercise(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	exercise := map[string]interface{}{
		"id":               id,
		"primitiveId":      "for-loop",
		"title":            "Sum of Numbers",
		"description":      "Calculate the sum of all numbers from 1 to n using a for loop",
		"instructions":     "## Your Task\n\nCreate a function `sumToN(n)` that returns the sum of all integers from 1 to n.\n\n### Requirements\n- Use a for loop (not a mathematical formula)\n- Handle edge cases (n < 1 should return 0)\n\n### Examples\n```\nsumToN(5)  → 15   // 1+2+3+4+5 = 15\nsumToN(10) → 55\nsumToN(0)  → 0\n```",
		"hints": []string{
			"Start with a variable to store your running total, initialized to 0",
			"Loop from 1 to n (inclusive) using i <= n",
			"Add each number i to your total inside the loop",
		},
		"difficulty":       2,
		"estimatedMinutes": 5,
		"isPremium":        false,
		"starterCode": map[string]string{
			"javascript": "function sumToN(n) {\n  // Your code here\n  \n}",
			"python":     "def sum_to_n(n):\n    # Your code here\n    pass",
			"go":         "func sumToN(n int) int {\n    // Your code here\n    return 0\n}",
		},
	}
	response.JSON(w, http.StatusOK, exercise)
}

func handleRunCode(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement code execution sandbox
	response.JSON(w, http.StatusOK, map[string]interface{}{
		"output": "15\n",
		"error":  nil,
		"executionTimeMs": 23,
	})
}

func handleSubmitSolution(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement solution submission
	response.JSON(w, http.StatusOK, map[string]interface{}{
		"passed":            true,
		"score":             95,
		"xpEarned":          25,
		"isFirstCompletion": true,
		"testResults": []map[string]interface{}{
			{"testCaseId": "1", "name": "Basic case", "passed": true},
			{"testCaseId": "2", "name": "Edge case n=0", "passed": true},
			{"testCaseId": "3", "name": "Large number", "passed": true},
		},
	})
}

// ============================================
// Progress Handlers (Stubs)
// ============================================

func handleGetProgress(w http.ResponseWriter, r *http.Request) {
	// Check if user is authenticated
	user := authHandler.GetUserFromSession(r)
	if user == nil {
		response.Unauthorized(w, "Please log in to view progress")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"userId":                    user.ID,
		"totalExercisesCompleted":   15,
		"totalPrimitivesMastered":   3,
		"totalTimeSpentMinutes":     245,
		"totalXp":                   1250,
		"currentLevel":              5,
		"currentDailyStreak":        7,
		"longestDailyStreak":        14,
	})
}

func handleGetMastery(w http.ResponseWriter, r *http.Request) {
	mastery := []map[string]interface{}{
		{"primitiveId": "for-loop", "primitiveName": "For Loop", "language": "javascript", "level": 4, "exercisesCompleted": 5, "exercisesAvailable": 6},
		{"primitiveId": "variables", "primitiveName": "Variables", "language": "javascript", "level": 5, "exercisesCompleted": 4, "exercisesAvailable": 4},
		{"primitiveId": "conditionals", "primitiveName": "Conditionals", "language": "javascript", "level": 3, "exercisesCompleted": 3, "exercisesAvailable": 5},
	}
	response.JSON(w, http.StatusOK, mastery)
}

// ============================================
// Gamification Handlers (Stubs)
// ============================================

func handleListAchievements(w http.ResponseWriter, r *http.Request) {
	achievements := []map[string]interface{}{
		{"id": "first-blood", "name": "First Blood", "description": "Complete your first exercise", "icon": "🎯", "rarity": "common", "xpReward": 25, "isUnlocked": true},
		{"id": "streak-7", "name": "Week Warrior", "description": "Maintain a 7-day streak", "icon": "🔥", "rarity": "common", "xpReward": 100, "isUnlocked": true},
		{"id": "streak-30", "name": "Month Master", "description": "Maintain a 30-day streak", "icon": "🏆", "rarity": "rare", "xpReward": 500, "isUnlocked": false},
		{"id": "polyglot", "name": "Polyglot", "description": "Complete exercises in 3 different languages", "icon": "🌍", "rarity": "rare", "xpReward": 200, "isUnlocked": false},
	}
	response.JSON(w, http.StatusOK, achievements)
}

func handleLeaderboard(w http.ResponseWriter, r *http.Request) {
	period := r.PathValue("period")
	leaderboard := []map[string]interface{}{
		{"rank": 1, "displayName": "CodeMaster", "xp": 15000, "level": 42, "period": period},
		{"rank": 2, "displayName": "LoopNinja", "xp": 12500, "level": 38, "period": period},
		{"rank": 3, "displayName": "FunctionFan", "xp": 11000, "level": 35, "period": period},
		{"rank": 4, "displayName": "ArrayAce", "xp": 9500, "level": 32, "period": period},
		{"rank": 5, "displayName": "RecursionRuler", "xp": 8000, "level": 29, "period": period},
	}
	response.JSON(w, http.StatusOK, leaderboard)
}
