// ProgramPrimitives API - Fly.io Native Go Server
// Full-stack Go API with SQLite + static file serving
package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/programprimitives/api/internal/admin"
	"github.com/programprimitives/api/internal/auth"
	"github.com/programprimitives/api/internal/db"
	"github.com/programprimitives/api/internal/response"
	"github.com/programprimitives/api/internal/sandbox"

	_ "github.com/mattn/go-sqlite3"
)

// Config holds application configuration
type Config struct {
	Port         string
	Environment  string
	DatabasePath string
	CORSOrigin   string
}

// App holds application dependencies
type App struct {
	config         Config
	db             *sql.DB
	authHandler    *auth.Handler
	sandboxHandler *sandbox.Handler
	adminHandler   *admin.Handler
}

func main() {
	// Load configuration from environment
	config := Config{
		Port:         getEnv("PORT", "8080"),
		Environment:  getEnv("ENVIRONMENT", "development"),
		DatabasePath: getEnv("DATABASE_PATH", "./data/programprimitives.db"),
		CORSOrigin:   getEnv("CORS_ORIGIN", "*"),
	}

	// Initialize database
	database, err := db.Initialize(config.DatabasePath)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.Close()

	// Run migrations
	if err := db.RunMigrations(database, "./migrations"); err != nil {
		log.Printf("Warning: Migration error: %v", err)
	}

	// Initialize handlers
	authHandler := auth.NewHandlerWithDB(database)
	
	// Initialize app
	app := &App{
		config:         config,
		db:             database,
		authHandler:    authHandler,
		sandboxHandler: sandbox.NewHandler(),
		adminHandler:   admin.NewHandler(database, authHandler),
	}

	// Create router
	mux := http.NewServeMux()

	// API routes
	app.registerAPIRoutes(mux)

	// Static file serving (SvelteKit build)
	app.registerStaticRoutes(mux)

	// Wrap with middleware
	handler := app.corsMiddleware(mux)
	handler = app.loggingMiddleware(handler)

	// Start server
	addr := ":" + config.Port
	log.Printf("🚀 ProgramPrimitives API starting on %s", addr)
	log.Printf("📦 Environment: %s", config.Environment)
	log.Printf("💾 Database: %s", config.DatabasePath)

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// registerAPIRoutes sets up all API endpoints
func (app *App) registerAPIRoutes(mux *http.ServeMux) {
	// Health check
	mux.HandleFunc("GET /api/health", app.handleHealth)

	// Auth routes
	mux.HandleFunc("POST /api/auth/register", app.authHandler.HandleRegister)
	mux.HandleFunc("POST /api/auth/login", app.authHandler.HandleLogin)
	mux.HandleFunc("POST /api/auth/logout", app.authHandler.HandleLogout)
	mux.HandleFunc("POST /api/auth/refresh", app.authHandler.HandleRefresh)
	mux.HandleFunc("GET /api/auth/me", app.authHandler.HandleMe)

	// Primitives routes
	mux.HandleFunc("GET /api/primitives", app.handleListPrimitives)
	mux.HandleFunc("GET /api/primitives/{id}", app.handleGetPrimitive)
	mux.HandleFunc("GET /api/primitives/{id}/syntax/{lang}", app.handleGetSyntax)

	// Exercise routes
	mux.HandleFunc("GET /api/exercises", app.handleListExercises)
	mux.HandleFunc("GET /api/exercises/{id}", app.handleGetExercise)
	mux.HandleFunc("POST /api/exercises/{id}/run", app.handleRunCode)
	mux.HandleFunc("POST /api/exercises/{id}/submit", app.handleSubmitSolution)

	// Sandbox routes
	mux.HandleFunc("POST /api/sandbox/run", app.sandboxHandler.HandleRun)
	mux.HandleFunc("POST /api/sandbox/test", app.sandboxHandler.HandleTest)
	mux.HandleFunc("POST /api/sandbox/submit", app.sandboxHandler.HandleSubmit)

	// Progress routes
	mux.HandleFunc("GET /api/progress", app.handleGetProgress)
	mux.HandleFunc("GET /api/progress/primitives", app.handleGetMastery)

	// Gamification routes
	mux.HandleFunc("GET /api/achievements", app.handleListAchievements)
	mux.HandleFunc("GET /api/leaderboard/{period}", app.handleLeaderboard)

	// Admin routes (protected by admin middleware)
	adminMw := app.adminHandler.GetMiddleware()
	
	// Admin dashboard
	mux.HandleFunc("GET /api/admin/stats", adminMw.RequireAdmin(app.adminHandler.HandleDashboardStats))
	mux.HandleFunc("GET /api/admin/audit-log", adminMw.RequireAdmin(app.adminHandler.HandleListAuditLog))
	
	// Admin - Primitives CRUD
	mux.HandleFunc("GET /api/admin/primitives", adminMw.RequireAdmin(app.adminHandler.HandleListPrimitives))
	mux.HandleFunc("POST /api/admin/primitives", adminMw.RequireAdmin(app.adminHandler.HandleCreatePrimitive))
	mux.HandleFunc("PUT /api/admin/primitives/{id}", adminMw.RequireAdmin(app.adminHandler.HandleUpdatePrimitive))
	mux.HandleFunc("DELETE /api/admin/primitives/{id}", adminMw.RequireAdmin(app.adminHandler.HandleDeletePrimitive))
	
	// Admin - Primitive Syntax
	mux.HandleFunc("GET /api/admin/primitives/{primitiveId}/syntax", adminMw.RequireAdmin(app.adminHandler.HandleListSyntax))
	mux.HandleFunc("POST /api/admin/primitives/{primitiveId}/syntax", adminMw.RequireAdmin(app.adminHandler.HandleUpsertSyntax))
	
	// Admin - Exercises CRUD
	mux.HandleFunc("GET /api/admin/exercises", adminMw.RequireAdmin(app.adminHandler.HandleListExercises))
	mux.HandleFunc("POST /api/admin/exercises", adminMw.RequireAdmin(app.adminHandler.HandleCreateExercise))
	mux.HandleFunc("PUT /api/admin/exercises/{id}", adminMw.RequireAdmin(app.adminHandler.HandleUpdateExercise))
	mux.HandleFunc("DELETE /api/admin/exercises/{id}", adminMw.RequireAdmin(app.adminHandler.HandleDeleteExercise))
	
	// Admin - Exercise Starter Code
	mux.HandleFunc("GET /api/admin/exercises/{exerciseId}/starter-code", adminMw.RequireAdmin(app.adminHandler.HandleListStarterCode))
	mux.HandleFunc("POST /api/admin/exercises/{exerciseId}/starter-code", adminMw.RequireAdmin(app.adminHandler.HandleUpsertStarterCode))
	
	// Admin - Exercise Test Cases
	mux.HandleFunc("GET /api/admin/exercises/{exerciseId}/test-cases", adminMw.RequireAdmin(app.adminHandler.HandleListTestCases))
	mux.HandleFunc("POST /api/admin/exercises/{exerciseId}/test-cases", adminMw.RequireAdmin(app.adminHandler.HandleCreateTestCase))
	mux.HandleFunc("DELETE /api/admin/test-cases/{id}", adminMw.RequireAdmin(app.adminHandler.HandleDeleteTestCase))
	
	// Admin - Users
	mux.HandleFunc("GET /api/admin/users", adminMw.RequireAdmin(app.adminHandler.HandleListUsers))
	mux.HandleFunc("PUT /api/admin/users/{id}/role", adminMw.RequireAdmin(app.adminHandler.HandleUpdateUserRole))
}

// registerStaticRoutes serves the SvelteKit frontend
func (app *App) registerStaticRoutes(mux *http.ServeMux) {
	// Serve static files from /app/static (Docker) or ./static (dev)
	staticDir := getEnv("STATIC_DIR", "./static")
	
	fileServer := http.FileServer(http.Dir(staticDir))
	
	// Catch-all for SPA routing - serve index.html for non-API, non-file routes
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Skip API routes
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}

		// Try to serve the file directly
		path := staticDir + r.URL.Path
		if _, err := os.Stat(path); err == nil {
			fileServer.ServeHTTP(w, r)
			return
		}

		// For SPA routing, serve index.html
		http.ServeFile(w, r, staticDir+"/index.html")
	})
}

// corsMiddleware adds CORS headers
func (app *App) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := app.config.CORSOrigin
		if origin == "" {
			origin = "*"
		}

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

// loggingMiddleware logs requests
func (app *App) loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

// ============================================
// Health Check Handler
// ============================================

func (app *App) handleHealth(w http.ResponseWriter, r *http.Request) {
	// Check database connectivity
	dbStatus := "healthy"
	if err := app.db.Ping(); err != nil {
		dbStatus = "unhealthy"
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"status":      "healthy",
		"service":     "programprimitives-api",
		"version":     "0.1.0",
		"environment": app.config.Environment,
		"database":    dbStatus,
	})
}

// ============================================
// Primitives Handlers
// ============================================

func (app *App) handleListPrimitives(w http.ResponseWriter, r *http.Request) {
	rows, err := app.db.Query(`
		SELECT id, name, category, description, difficulty, icon, is_premium 
		FROM primitives 
		WHERE is_published = 1 
		ORDER BY category_order, difficulty
	`)
	if err != nil {
		// Fallback to static data if DB not ready
		app.handleListPrimitivesStatic(w, r)
		return
	}
	defer rows.Close()

	var primitives []map[string]interface{}
	for rows.Next() {
		var id, name, category, description, icon string
		var difficulty int
		var isPremium bool
		if err := rows.Scan(&id, &name, &category, &description, &difficulty, &icon, &isPremium); err != nil {
			continue
		}
		primitives = append(primitives, map[string]interface{}{
			"id":          id,
			"name":        name,
			"category":    category,
			"description": description,
			"difficulty":  difficulty,
			"icon":        icon,
			"isPremium":   isPremium,
		})
	}

	if len(primitives) == 0 {
		app.handleListPrimitivesStatic(w, r)
		return
	}

	response.JSON(w, http.StatusOK, primitives)
}

func (app *App) handleListPrimitivesStatic(w http.ResponseWriter, r *http.Request) {
	primitives := []map[string]interface{}{
		{"id": "variables", "name": "Variables", "category": "fundamentals", "difficulty": 1, "description": "Named storage locations that hold data values", "icon": "📦", "isPremium": false},
		{"id": "for-loop", "name": "For Loop", "category": "fundamentals", "difficulty": 2, "description": "Execute code a specific number of times with a counter", "icon": "🔄", "isPremium": false},
		{"id": "conditionals", "name": "Conditionals", "category": "fundamentals", "difficulty": 1, "description": "Execute different code based on whether conditions are true or false", "icon": "🔀", "isPremium": false},
		{"id": "while-loop", "name": "While Loop", "category": "fundamentals", "difficulty": 2, "description": "Execute code repeatedly while a condition remains true", "icon": "🔁", "isPremium": false},
		{"id": "functions", "name": "Functions", "category": "fundamentals", "difficulty": 2, "description": "Reusable blocks of code that perform specific tasks", "icon": "⚡", "isPremium": false},
		{"id": "arrays", "name": "Arrays", "category": "data-structures", "difficulty": 2, "description": "Ordered collections of elements accessed by index", "icon": "📊", "isPremium": false},
	}
	response.JSON(w, http.StatusOK, primitives)
}

func (app *App) handleGetPrimitive(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var name, category, description, whyItMatters, bestPractices, pitfalls, icon string
	var difficulty int
	var isPremium bool

	err := app.db.QueryRow(`
		SELECT name, category, description, why_it_matters, best_practices, pitfalls, difficulty, icon, is_premium
		FROM primitives WHERE id = ?
	`, id).Scan(&name, &category, &description, &whyItMatters, &bestPractices, &pitfalls, &difficulty, &icon, &isPremium)

	if err != nil {
		// Fallback to static
		primitive := map[string]interface{}{
			"id": id, "name": "For Loop", "category": "fundamentals",
			"description":  "Execute code a specific number of times with a counter",
			"whyItMatters": "For loops are essential for processing collections and repeating operations.",
			"bestPractices": []string{"Use meaningful iterator variable names", "Avoid modifying loop variable inside the loop"},
			"pitfalls":      []string{"Off-by-one errors", "Infinite loops"},
			"difficulty": 2, "icon": "🔄", "isPremium": false,
		}
		response.JSON(w, http.StatusOK, primitive)
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"id": id, "name": name, "category": category, "description": description,
		"whyItMatters": whyItMatters, "bestPractices": bestPractices, "pitfalls": pitfalls,
		"difficulty": difficulty, "icon": icon, "isPremium": isPremium,
	})
}

func (app *App) handleGetSyntax(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	lang := r.PathValue("lang")

	var syntaxTemplate, fullExample, explanation string
	err := app.db.QueryRow(`
		SELECT syntax_template, full_example, explanation
		FROM primitive_syntax WHERE primitive_id = ? AND language = ?
	`, id, lang).Scan(&syntaxTemplate, &fullExample, &explanation)

	if err != nil {
		// Static fallback
		syntaxMap := map[string]map[string]interface{}{
			"javascript": {"primitiveId": id, "language": "javascript", "syntaxTemplate": "for (let i = 0; i < n; i++) {\n  // code\n}", "fullExample": "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}", "explanation": "Standard for loop with initialization, condition, and increment."},
			"python":     {"primitiveId": id, "language": "python", "syntaxTemplate": "for i in range(n):\n    # code", "fullExample": "for i in range(5):\n    print(i)", "explanation": "Python uses range() to generate a sequence."},
			"go":         {"primitiveId": id, "language": "go", "syntaxTemplate": "for i := 0; i < n; i++ {\n    // code\n}", "fullExample": "for i := 0; i < 5; i++ {\n    fmt.Println(i)\n}", "explanation": "Go only has for loops (no while)."},
		}
		if syntax, ok := syntaxMap[lang]; ok {
			response.JSON(w, http.StatusOK, syntax)
		} else {
			response.JSON(w, http.StatusOK, syntaxMap["javascript"])
		}
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"primitiveId": id, "language": lang, "syntaxTemplate": syntaxTemplate,
		"fullExample": fullExample, "explanation": explanation,
	})
}

// ============================================
// Exercise Handlers
// ============================================

func (app *App) handleListExercises(w http.ResponseWriter, r *http.Request) {
	exercises := []map[string]interface{}{
		{"id": "ex-001", "primitiveId": "for-loop", "title": "Sum of Numbers", "description": "Calculate the sum of all numbers from 1 to n", "difficulty": 2, "estimatedMinutes": 5, "isPremium": false},
		{"id": "ex-002", "primitiveId": "for-loop", "title": "Array Sum", "description": "Calculate the sum of all elements in an array", "difficulty": 2, "estimatedMinutes": 5, "isPremium": false},
		{"id": "ex-003", "primitiveId": "variables", "title": "Variable Swap", "description": "Swap the values of two variables", "difficulty": 1, "estimatedMinutes": 3, "isPremium": false},
	}
	response.JSON(w, http.StatusOK, exercises)
}

func (app *App) handleGetExercise(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	exercise := map[string]interface{}{
		"id": id, "primitiveId": "for-loop", "title": "Sum of Numbers",
		"description":  "Calculate the sum of all numbers from 1 to n using a for loop",
		"instructions": "## Your Task\n\nCreate a function `sumToN(n)` that returns the sum of all integers from 1 to n.\n\n### Examples\n```\nsumToN(5)  → 15\nsumToN(10) → 55\n```",
		"hints":        []string{"Start with a total variable", "Loop from 1 to n", "Add each number to total"},
		"difficulty":   2, "estimatedMinutes": 5, "isPremium": false,
		"starterCode": map[string]string{
			"javascript": "function sumToN(n) {\n  // Your code here\n}",
			"python":     "def sum_to_n(n):\n    # Your code here\n    pass",
			"go":         "func sumToN(n int) int {\n    // Your code here\n    return 0\n}",
		},
	}
	response.JSON(w, http.StatusOK, exercise)
}

func (app *App) handleRunCode(w http.ResponseWriter, r *http.Request) {
	response.JSON(w, http.StatusOK, map[string]interface{}{
		"output": "15\n", "error": nil, "executionTimeMs": 23,
	})
}

func (app *App) handleSubmitSolution(w http.ResponseWriter, r *http.Request) {
	response.JSON(w, http.StatusOK, map[string]interface{}{
		"passed": true, "score": 95, "xpEarned": 25, "isFirstCompletion": true,
		"testResults": []map[string]interface{}{
			{"testCaseId": "1", "name": "Basic case", "passed": true},
			{"testCaseId": "2", "name": "Edge case", "passed": true},
		},
	})
}

// ============================================
// Progress Handlers
// ============================================

func (app *App) handleGetProgress(w http.ResponseWriter, r *http.Request) {
	user := app.authHandler.GetUserFromSession(r)
	if user == nil {
		response.Unauthorized(w, "Please log in to view progress")
		return
	}

	// Try to get progress from user_progress table
	var totalExercisesCompleted, totalPrimitivesMastered, totalTimeSpentMinutes, totalXp, currentLevel int
	var currentDailyStreak, longestDailyStreak int
	var lastActivityAt sql.NullString

	err := app.db.QueryRow(`
		SELECT 
			total_exercises_completed, total_primitives_mastered, total_time_spent_minutes,
			total_xp, current_level, current_daily_streak, longest_daily_streak, last_activity_at
		FROM user_progress WHERE user_id = ?
	`, user.ID).Scan(
		&totalExercisesCompleted, &totalPrimitivesMastered, &totalTimeSpentMinutes,
		&totalXp, &currentLevel, &currentDailyStreak, &longestDailyStreak, &lastActivityAt,
	)

	if err != nil {
		// User has no progress record yet - return defaults
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"userId":                  user.ID,
			"totalExercisesCompleted": 0,
			"totalPrimitivesMastered": 0,
			"totalTimeSpentMinutes":   0,
			"totalXp":                 0,
			"currentLevel":            1,
			"currentDailyStreak":      0,
			"longestDailyStreak":      0,
			"lastActivityAt":          nil,
		})
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"userId":                  user.ID,
		"totalExercisesCompleted": totalExercisesCompleted,
		"totalPrimitivesMastered": totalPrimitivesMastered,
		"totalTimeSpentMinutes":   totalTimeSpentMinutes,
		"totalXp":                 totalXp,
		"currentLevel":            currentLevel,
		"currentDailyStreak":      currentDailyStreak,
		"longestDailyStreak":      longestDailyStreak,
		"lastActivityAt":          lastActivityAt.String,
	})
}

func (app *App) handleGetMastery(w http.ResponseWriter, r *http.Request) {
	user := app.authHandler.GetUserFromSession(r)
	if user == nil {
		response.Unauthorized(w, "Please log in to view mastery")
		return
	}

	// Get mastery from primitive_mastery table joined with primitives
	rows, err := app.db.Query(`
		SELECT 
			pm.primitive_id, p.name, pm.language, pm.mastery_level,
			pm.exercises_completed, pm.exercises_available, pm.average_score
		FROM primitive_mastery pm
		JOIN primitives p ON pm.primitive_id = p.id
		WHERE pm.user_id = ?
		ORDER BY pm.mastery_level DESC, p.name ASC
	`, user.ID)

	if err != nil {
		response.JSON(w, http.StatusOK, []map[string]interface{}{})
		return
	}
	defer rows.Close()

	mastery := []map[string]interface{}{}
	for rows.Next() {
		var primitiveId, primitiveName, language string
		var level, exercisesCompleted, exercisesAvailable int
		var averageScore float64

		if err := rows.Scan(&primitiveId, &primitiveName, &language, &level, &exercisesCompleted, &exercisesAvailable, &averageScore); err != nil {
			continue
		}

		mastery = append(mastery, map[string]interface{}{
			"primitiveId":        primitiveId,
			"primitiveName":      primitiveName,
			"language":           language,
			"level":              level,
			"exercisesCompleted": exercisesCompleted,
			"exercisesAvailable": exercisesAvailable,
			"averageScore":       averageScore,
		})
	}

	response.JSON(w, http.StatusOK, mastery)
}

// ============================================
// Gamification Handlers
// ============================================

func (app *App) handleListAchievements(w http.ResponseWriter, r *http.Request) {
	user := app.authHandler.GetUserFromSession(r)
	
	// Get all achievements with user unlock status
	rows, err := app.db.Query(`
		SELECT 
			a.id, a.name, a.description, a.icon, a.category, a.rarity, a.xp_reward,
			CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as is_unlocked,
			ua.unlocked_at
		FROM achievements a
		LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
		ORDER BY a.category, a.rarity DESC
	`, func() string {
		if user != nil {
			return user.ID
		}
		return ""
	}())

	if err != nil {
		// Return empty array if query fails
		response.JSON(w, http.StatusOK, []map[string]interface{}{})
		return
	}
	defer rows.Close()

	achievements := []map[string]interface{}{}
	for rows.Next() {
		var id, name, description, icon, category, rarity string
		var xpReward, isUnlocked int
		var unlockedAt sql.NullString

		if err := rows.Scan(&id, &name, &description, &icon, &category, &rarity, &xpReward, &isUnlocked, &unlockedAt); err != nil {
			continue
		}

		ach := map[string]interface{}{
			"id":          id,
			"name":        name,
			"description": description,
			"icon":        icon,
			"category":    category,
			"rarity":      rarity,
			"xpReward":    xpReward,
			"isUnlocked":  isUnlocked == 1,
		}
		if unlockedAt.Valid {
			ach["unlockedAt"] = unlockedAt.String
		}
		achievements = append(achievements, ach)
	}

	// If no achievements in DB, return catalog defaults
	if len(achievements) == 0 {
		achievements = getDefaultAchievementCatalog()
	}

	response.JSON(w, http.StatusOK, achievements)
}

func (app *App) handleLeaderboard(w http.ResponseWriter, r *http.Request) {
	period := r.PathValue("period")
	
	// Build query based on period
	var query string
	switch period {
	case "weekly":
		query = `
			SELECT u.display_name, up.total_xp, up.current_level
			FROM user_progress up
			JOIN users u ON up.user_id = u.id
			WHERE up.last_activity_at >= datetime('now', '-7 days')
			ORDER BY up.total_xp DESC
			LIMIT 10
		`
	case "monthly":
		query = `
			SELECT u.display_name, up.total_xp, up.current_level
			FROM user_progress up
			JOIN users u ON up.user_id = u.id
			WHERE up.last_activity_at >= datetime('now', '-30 days')
			ORDER BY up.total_xp DESC
			LIMIT 10
		`
	default: // all-time
		query = `
			SELECT u.display_name, up.total_xp, up.current_level
			FROM user_progress up
			JOIN users u ON up.user_id = u.id
			ORDER BY up.total_xp DESC
			LIMIT 10
		`
	}

	rows, err := app.db.Query(query)
	if err != nil {
		response.JSON(w, http.StatusOK, []map[string]interface{}{})
		return
	}
	defer rows.Close()

	leaderboard := []map[string]interface{}{}
	rank := 1
	for rows.Next() {
		var displayName string
		var xp, level int

		if err := rows.Scan(&displayName, &xp, &level); err != nil {
			continue
		}

		leaderboard = append(leaderboard, map[string]interface{}{
			"rank":        rank,
			"displayName": displayName,
			"xp":          xp,
			"level":       level,
			"period":      period,
		})
		rank++
	}

	response.JSON(w, http.StatusOK, leaderboard)
}

// getDefaultAchievementCatalog returns the static achievement list
func getDefaultAchievementCatalog() []map[string]interface{} {
	return []map[string]interface{}{
		{"id": "first-steps", "name": "First Steps", "description": "Complete your first exercise", "icon": "🎯", "category": "completion", "rarity": "common", "xpReward": 50, "isUnlocked": false},
		{"id": "on-fire", "name": "On Fire", "description": "Complete 5 exercises in one day", "icon": "🔥", "category": "completion", "rarity": "uncommon", "xpReward": 100, "isUnlocked": false},
		{"id": "week-warrior", "name": "Week Warrior", "description": "7-day streak", "icon": "📆", "category": "streak", "rarity": "uncommon", "xpReward": 100, "isUnlocked": false},
		{"id": "monthly-master", "name": "Monthly Master", "description": "30-day streak", "icon": "🗓️", "category": "streak", "rarity": "epic", "xpReward": 500, "isUnlocked": false},
		{"id": "scholar", "name": "Scholar", "description": "Master 3 primitives", "icon": "📚", "category": "mastery", "rarity": "rare", "xpReward": 300, "isUnlocked": false},
		{"id": "master", "name": "Master", "description": "Reach level 5 mastery on any primitive", "icon": "👑", "category": "mastery", "rarity": "rare", "xpReward": 250, "isUnlocked": false},
	}
}
