// ProgramPrimitives API - Fly.io Native Go Server
// Full-stack Go API with SQLite + static file serving
package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

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

	// Run migrations (fail fast on errors)
	if err := db.RunMigrations(database, "./migrations"); err != nil {
		log.Fatalf("❌ Migration failed: %v", err)
	}
	log.Println("✅ All migrations applied successfully")

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
	mux.HandleFunc("GET /api/progress/lessons", app.handleGetLessonProgress)
	mux.HandleFunc("GET /api/progress/lessons/{toolId}", app.handleGetToolLessonProgress)
	mux.HandleFunc("POST /api/lessons/{id}/complete", app.handleCompleteLesson)

	// Gamification routes
	mux.HandleFunc("GET /api/achievements", app.handleListAchievements)
	mux.HandleFunc("GET /api/leaderboard/{period}", app.handleLeaderboard)

	// Funnel analytics routes (public - tracks anonymous users too)
	mux.HandleFunc("POST /api/funnel/track", app.handleTrackFunnelEvent)

	// Admin routes (protected by admin middleware)
	adminMw := app.adminHandler.GetMiddleware()
	
	// Admin funnel analytics
	mux.HandleFunc("GET /api/admin/funnel/stats", adminMw.RequireAdmin(app.handleGetFunnelStats))
	
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
	
	// Admin - Lessons CRUD
	mux.HandleFunc("GET /api/admin/lessons", adminMw.RequireAdmin(app.adminHandler.HandleListLessons))
	mux.HandleFunc("GET /api/admin/lessons/{id}", adminMw.RequireAdmin(app.adminHandler.HandleGetLesson))
	mux.HandleFunc("POST /api/admin/lessons", adminMw.RequireAdmin(app.adminHandler.HandleCreateLesson))
	mux.HandleFunc("PUT /api/admin/lessons/{id}", adminMw.RequireAdmin(app.adminHandler.HandleUpdateLesson))
	mux.HandleFunc("DELETE /api/admin/lessons/{id}", adminMw.RequireAdmin(app.adminHandler.HandleDeleteLesson))
	
	// Admin - Tool Metaphors
	mux.HandleFunc("GET /api/admin/metaphors", adminMw.RequireAdmin(app.adminHandler.HandleListMetaphors))
	mux.HandleFunc("GET /api/admin/metaphors/{toolId}", adminMw.RequireAdmin(app.adminHandler.HandleGetMetaphor))
	
	// Admin - Language Docs
	mux.HandleFunc("GET /api/admin/docs", adminMw.RequireAdmin(app.adminHandler.HandleListDocs))
	
	// Public Lessons routes (for users)
	mux.HandleFunc("GET /api/lessons", app.handleListLessons)
	mux.HandleFunc("GET /api/lessons/{id}", app.handleGetLesson)
	mux.HandleFunc("GET /api/tools/{toolId}/lessons", app.handleGetToolLessons)
	mux.HandleFunc("GET /api/tools/{toolId}/metaphor", app.handleGetToolMetaphor)
	mux.HandleFunc("GET /api/tools/{toolId}/docs", app.handleGetToolDocs)
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
// Lesson Progress Handlers
// ============================================

// handleGetLessonProgress returns all lesson progress for the current user
func (app *App) handleGetLessonProgress(w http.ResponseWriter, r *http.Request) {
	user := app.authHandler.GetUserFromSession(r)
	if user == nil {
		response.Unauthorized(w, "Please log in to view progress")
		return
	}

	rows, err := app.db.Query(`
		SELECT 
			ulp.lesson_id, ulp.status, ulp.started_at, ulp.completed_at,
			ulp.time_spent_minutes,
			l.tool_id, l.title, l.phase
		FROM user_lesson_progress ulp
		JOIN lessons l ON ulp.lesson_id = l.id
		WHERE ulp.user_id = ?
		ORDER BY l.tool_id, l.sequence_order
	`, user.ID)

	if err != nil {
		response.JSON(w, http.StatusOK, []map[string]interface{}{})
		return
	}
	defer rows.Close()

	progress := []map[string]interface{}{}
	for rows.Next() {
		var lessonID, status, toolID, title, phase string
		var startedAt, completedAt sql.NullString
		var timeSpentMinutes int

		if err := rows.Scan(&lessonID, &status, &startedAt, &completedAt, &timeSpentMinutes, &toolID, &title, &phase); err != nil {
			continue
		}

		p := map[string]interface{}{
			"lessonId":         lessonID,
			"status":           status,
			"timeSpentMinutes": timeSpentMinutes,
			"toolId":           toolID,
			"title":            title,
			"phase":            phase,
		}
		if startedAt.Valid {
			p["startedAt"] = startedAt.String
		}
		if completedAt.Valid {
			p["completedAt"] = completedAt.String
		}
		progress = append(progress, p)
	}

	response.JSON(w, http.StatusOK, progress)
}

// handleGetToolLessonProgress returns lesson progress for a specific tool
func (app *App) handleGetToolLessonProgress(w http.ResponseWriter, r *http.Request) {
	toolID := r.PathValue("toolId")
	user := app.authHandler.GetUserFromSession(r)
	
	// Get all lessons for this tool
	lessonsRows, err := app.db.Query(`
		SELECT id, slug, title, phase, sequence_order, estimated_minutes
		FROM lessons
		WHERE tool_id = ? AND is_published = 1
		ORDER BY sequence_order
	`, toolID)
	if err != nil {
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"toolId":    toolID,
			"lessons":   []interface{}{},
			"completed": 0,
			"total":     0,
		})
		return
	}
	defer lessonsRows.Close()

	type lessonInfo struct {
		ID               string `json:"id"`
		Slug             string `json:"slug"`
		Title            string `json:"title"`
		Phase            string `json:"phase"`
		SequenceOrder    int    `json:"sequenceOrder"`
		EstimatedMinutes int    `json:"estimatedMinutes"`
		Status           string `json:"status"`
		CompletedAt      string `json:"completedAt,omitempty"`
	}

	lessons := []lessonInfo{}
	for lessonsRows.Next() {
		var l lessonInfo
		if err := lessonsRows.Scan(&l.ID, &l.Slug, &l.Title, &l.Phase, &l.SequenceOrder, &l.EstimatedMinutes); err != nil {
			continue
		}
		l.Status = "locked"
		lessons = append(lessons, l)
	}

	// If user is logged in, get their progress
	completedCount := 0
	if user != nil {
		progressRows, err := app.db.Query(`
			SELECT lesson_id, status, completed_at
			FROM user_lesson_progress
			WHERE user_id = ?
		`, user.ID)
		if err == nil {
			defer progressRows.Close()
			
			progressMap := make(map[string]struct {
				Status      string
				CompletedAt sql.NullString
			})
			for progressRows.Next() {
				var lessonID, status string
				var completedAt sql.NullString
				if err := progressRows.Scan(&lessonID, &status, &completedAt); err == nil {
					progressMap[lessonID] = struct {
						Status      string
						CompletedAt sql.NullString
					}{status, completedAt}
				}
			}

			// Update lesson statuses
			for i := range lessons {
				if p, ok := progressMap[lessons[i].ID]; ok {
					lessons[i].Status = p.Status
					if p.CompletedAt.Valid {
						lessons[i].CompletedAt = p.CompletedAt.String
					}
					if p.Status == "completed" {
						completedCount++
					}
				}
			}
		}
	}

	// Set first unlocked lesson to "available" if nothing is in progress
	hasInProgress := false
	for _, l := range lessons {
		if l.Status == "in_progress" {
			hasInProgress = true
			break
		}
	}
	if !hasInProgress {
		for i := range lessons {
			if lessons[i].Status == "locked" {
				lessons[i].Status = "available"
				break
			}
		}
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"toolId":    toolID,
		"lessons":   lessons,
		"completed": completedCount,
		"total":     len(lessons),
	})
}

// handleCompleteLesson marks a lesson as completed for the current user
func (app *App) handleCompleteLesson(w http.ResponseWriter, r *http.Request) {
	lessonID := r.PathValue("id")
	user := app.authHandler.GetUserFromSession(r)
	if user == nil {
		response.Unauthorized(w, "Please log in to track progress")
		return
	}

	// Verify lesson exists and get its XP reward
	var toolID string
	var xpReward int
	err := app.db.QueryRow("SELECT tool_id, COALESCE(xp_reward, 25) FROM lessons WHERE id = ?", lessonID).Scan(&toolID, &xpReward)
	if err != nil {
		response.NotFound(w, "Lesson not found")
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)
	id := user.ID + "-" + lessonID

	// Upsert progress record
	_, err = app.db.Exec(`
		INSERT INTO user_lesson_progress (id, user_id, lesson_id, status, started_at, completed_at, created_at, updated_at)
		VALUES (?, ?, ?, 'completed', ?, ?, ?, ?)
		ON CONFLICT(user_id, lesson_id) DO UPDATE SET
			status = 'completed',
			completed_at = excluded.completed_at,
			updated_at = excluded.updated_at
	`, id, user.ID, lessonID, now, now, now, now)

	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to save progress")
		return
	}

	// Update user_tool_mastery
	masteryID := user.ID + "-" + toolID
	_, _ = app.db.Exec(`
		INSERT INTO user_tool_mastery (id, user_id, tool_id, lessons_completed, last_studied_at, created_at, updated_at)
		VALUES (?, ?, ?, 1, ?, ?, ?)
		ON CONFLICT(user_id, tool_id) DO UPDATE SET
			lessons_completed = lessons_completed + 1,
			last_studied_at = excluded.last_studied_at,
			updated_at = excluded.updated_at
	`, masteryID, user.ID, toolID, now, now, now)

	// Update user_progress total XP
	_, _ = app.db.Exec(`
		INSERT INTO user_progress (id, user_id, total_xp, current_level, total_exercises_completed, last_activity_at, created_at, updated_at)
		VALUES (?, ?, ?, 1, 0, ?, ?, ?)
		ON CONFLICT(user_id) DO UPDATE SET
			total_xp = total_xp + ?,
			last_activity_at = excluded.last_activity_at,
			updated_at = excluded.updated_at
	`, user.ID, user.ID, xpReward, now, now, now, xpReward)

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"success":   true,
		"lessonId":  lessonID,
		"xpAwarded": xpReward,
	})
}

// ============================================
// Funnel Analytics Handlers
// ============================================

// FunnelEventInput represents an incoming tracking event
type FunnelEventInput struct {
	SessionID   string                 `json:"sessionId"`
	EventType   string                 `json:"eventType"`
	FunnelName  string                 `json:"funnelName"`
	Touchpoint  string                 `json:"touchpoint"`
	SourcePage  string                 `json:"sourcePage"`
	ExerciseID  string                 `json:"exerciseId"`
	LessonID    string                 `json:"lessonId"`
	PrimitiveID string                 `json:"primitiveId"`
	DeviceType  string                 `json:"deviceType"`
	Browser     string                 `json:"browser"`
	Metadata    map[string]interface{} `json:"metadata"`
	Timestamp   string                 `json:"timestamp"`
}

func (app *App) handleTrackFunnelEvent(w http.ResponseWriter, r *http.Request) {
	var input FunnelEventInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	// Validate required fields
	if input.SessionID == "" || input.FunnelName == "" || input.Touchpoint == "" {
		response.BadRequest(w, "sessionId, funnelName, and touchpoint are required")
		return
	}

	// Get user ID if logged in
	var userID *string
	if user := app.authHandler.GetUserFromSession(r); user != nil {
		userID = &user.ID
	}

	// Generate event ID
	id := "fe_" + time.Now().Format("20060102150405") + "_" + input.SessionID[:8]
	now := time.Now().UTC().Format(time.RFC3339)

	// Serialize metadata
	metadataJSON := "{}"
	if input.Metadata != nil {
		if data, err := json.Marshal(input.Metadata); err == nil {
			metadataJSON = string(data)
		}
	}

	// Insert event
	_, err := app.db.Exec(`
		INSERT INTO funnel_events (
			id, user_id, session_id, event_type, funnel_name, touchpoint,
			source_page, exercise_id, lesson_id, primitive_id, metadata,
			device_type, browser, created_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		id, userID, input.SessionID, input.EventType, input.FunnelName, input.Touchpoint,
		input.SourcePage, nilIfEmpty(input.ExerciseID), nilIfEmpty(input.LessonID),
		nilIfEmpty(input.PrimitiveID), metadataJSON, input.DeviceType, input.Browser, now,
	)

	if err != nil {
		// Log but don't fail - analytics shouldn't break UX
		log.Printf("Failed to track funnel event: %v", err)
	}

	// Update daily stats (async in production, sync here for simplicity)
	app.updateFunnelDailyStats(input.FunnelName, input.Touchpoint, input.EventType, input.SessionID, userID)

	response.JSON(w, http.StatusOK, map[string]bool{"tracked": true})
}

func (app *App) updateFunnelDailyStats(funnelName, touchpoint, eventType, sessionID string, userID *string) {
	today := time.Now().UTC().Format("2006-01-02")
	statsID := today + "_" + funnelName + "_" + touchpoint
	now := time.Now().UTC().Format(time.RFC3339)

	// Try to update existing record, or insert new one
	var column string
	switch eventType {
	case "view":
		column = "views"
	case "click":
		column = "clicks"
	case "dismiss":
		column = "dismisses"
	case "convert":
		column = "conversions"
	default:
		return
	}

	// Upsert the daily stats
	_, _ = app.db.Exec(`
		INSERT INTO funnel_daily_stats (id, date, funnel_name, touchpoint, `+column+`, unique_sessions, created_at, updated_at)
		VALUES (?, ?, ?, ?, 1, 1, ?, ?)
		ON CONFLICT(date, funnel_name, touchpoint) DO UPDATE SET
			`+column+` = `+column+` + 1,
			updated_at = excluded.updated_at
	`, statsID, today, funnelName, touchpoint, now, now)
}

func nilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func (app *App) handleGetFunnelStats(w http.ResponseWriter, r *http.Request) {
	// Get date range from query params
	daysBack := 30
	if d := r.URL.Query().Get("days"); d != "" {
		if parsed, err := strconv.Atoi(d); err == nil && parsed > 0 && parsed <= 90 {
			daysBack = parsed
		}
	}

	startDate := time.Now().AddDate(0, 0, -daysBack).Format("2006-01-02")

	// Get daily stats
	rows, err := app.db.Query(`
		SELECT date, funnel_name, touchpoint, views, clicks, dismisses, conversions
		FROM funnel_daily_stats
		WHERE date >= ?
		ORDER BY date DESC, funnel_name, touchpoint
	`, startDate)
	if err != nil {
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"daily":   []interface{}{},
			"summary": map[string]interface{}{},
		})
		return
	}
	defer rows.Close()

	daily := []map[string]interface{}{}
	summaryByFunnel := make(map[string]map[string]int)

	for rows.Next() {
		var date, funnelName, touchpoint string
		var views, clicks, dismisses, conversions int

		if err := rows.Scan(&date, &funnelName, &touchpoint, &views, &clicks, &dismisses, &conversions); err != nil {
			continue
		}

		daily = append(daily, map[string]interface{}{
			"date":        date,
			"funnelName":  funnelName,
			"touchpoint":  touchpoint,
			"views":       views,
			"clicks":      clicks,
			"dismisses":   dismisses,
			"conversions": conversions,
			"clickRate":   safePercent(clicks, views),
			"convRate":    safePercent(conversions, views),
		})

		// Aggregate by funnel
		if _, ok := summaryByFunnel[funnelName]; !ok {
			summaryByFunnel[funnelName] = map[string]int{"views": 0, "clicks": 0, "dismisses": 0, "conversions": 0}
		}
		summaryByFunnel[funnelName]["views"] += views
		summaryByFunnel[funnelName]["clicks"] += clicks
		summaryByFunnel[funnelName]["dismisses"] += dismisses
		summaryByFunnel[funnelName]["conversions"] += conversions
	}

	// Build summary with rates
	summary := make(map[string]interface{})
	for funnel, counts := range summaryByFunnel {
		summary[funnel] = map[string]interface{}{
			"views":       counts["views"],
			"clicks":      counts["clicks"],
			"dismisses":   counts["dismisses"],
			"conversions": counts["conversions"],
			"clickRate":   safePercent(counts["clicks"], counts["views"]),
			"convRate":    safePercent(counts["conversions"], counts["views"]),
		}
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"daily":   daily,
		"summary": summary,
		"period":  daysBack,
	})
}

func safePercent(numerator, denominator int) float64 {
	if denominator == 0 {
		return 0
	}
	return float64(numerator) / float64(denominator) * 100
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

// ============================================
// Public Lesson Handlers
// ============================================

// handleListLessons returns all published lessons
func (app *App) handleListLessons(w http.ResponseWriter, r *http.Request) {
	toolID := r.URL.Query().Get("toolId")
	phase := r.URL.Query().Get("phase")
	
	query := `
		SELECT id, tool_id, slug, title, description, phase, 
		       COALESCE(phase_order, 1), sequence_order, 
		       COALESCE(metaphor_progress, ''),
		       estimated_minutes, 
		       COALESCE(difficulty_modifier, 0),
		       is_premium
		FROM lessons
		WHERE is_published = 1
	`
	args := []interface{}{}
	
	if toolID != "" {
		query += " AND tool_id = ?"
		args = append(args, toolID)
	}
	if phase != "" {
		query += " AND phase = ?"
		args = append(args, phase)
	}
	
	query += " ORDER BY tool_id, sequence_order"
	
	rows, err := app.db.Query(query, args...)
	if err != nil {
		response.JSON(w, http.StatusOK, []map[string]interface{}{})
		return
	}
	defer rows.Close()
	
	lessons := []map[string]interface{}{}
	for rows.Next() {
		var id, toolID, slug, title, description, phase, metaphorProgress string
		var phaseOrder, sequenceOrder, estimatedMinutes int
		var difficultyMod float64
		var isPremium bool
		
		err := rows.Scan(&id, &toolID, &slug, &title, &description, &phase,
			&phaseOrder, &sequenceOrder, &metaphorProgress, &estimatedMinutes,
			&difficultyMod, &isPremium)
		if err != nil {
			continue
		}
		
		lessons = append(lessons, map[string]interface{}{
			"id":               id,
			"toolId":           toolID,
			"slug":             slug,
			"title":            title,
			"description":      description,
			"phase":            phase,
			"phaseOrder":       phaseOrder,
			"sequenceOrder":    sequenceOrder,
			"metaphorProgress": metaphorProgress,
			"estimatedMinutes": estimatedMinutes,
			"difficultyModifier": difficultyMod,
			"isPremium":        isPremium,
		})
	}
	
	response.JSON(w, http.StatusOK, lessons)
}

// handleGetLesson returns a single lesson with full content
func (app *App) handleGetLesson(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.BadRequest(w, "Lesson ID required")
		return
	}
	
	var lesson struct {
		ID               string  `json:"id"`
		ToolID           string  `json:"toolId"`
		Slug             string  `json:"slug"`
		Title            string  `json:"title"`
		Description      string  `json:"description"`
		Phase            string  `json:"phase"`
		PhaseOrder       int     `json:"phaseOrder"`
		SequenceOrder    int     `json:"sequenceOrder"`
		MetaphorProgress string  `json:"metaphorProgress"`
		ContentMarkdown  string  `json:"contentMarkdown"`
		VisualElements   string  `json:"visualElements"`
		EstimatedMinutes int     `json:"estimatedMinutes"`
		DifficultyMod    float64 `json:"difficultyModifier"`
		IsPremium        bool    `json:"isPremium"`
	}
	
	err := app.db.QueryRow(`
		SELECT id, tool_id, slug, title, description, phase, 
		       COALESCE(phase_order, 1), sequence_order, 
		       COALESCE(metaphor_progress, ''),
		       COALESCE(content_markdown, ''),
		       COALESCE(visual_elements, ''),
		       estimated_minutes, 
		       COALESCE(difficulty_modifier, 0),
		       is_premium
		FROM lessons
		WHERE id = ? AND is_published = 1
	`, id).Scan(
		&lesson.ID, &lesson.ToolID, &lesson.Slug, &lesson.Title,
		&lesson.Description, &lesson.Phase, &lesson.PhaseOrder,
		&lesson.SequenceOrder, &lesson.MetaphorProgress, &lesson.ContentMarkdown,
		&lesson.VisualElements, &lesson.EstimatedMinutes, &lesson.DifficultyMod,
		&lesson.IsPremium,
	)
	
	if err != nil {
		response.NotFound(w, "Lesson not found")
		return
	}
	
	response.JSON(w, http.StatusOK, lesson)
}

// handleGetToolLessons returns all lessons for a specific tool, grouped by phase
func (app *App) handleGetToolLessons(w http.ResponseWriter, r *http.Request) {
	toolID := r.PathValue("toolId")
	if toolID == "" {
		response.BadRequest(w, "Tool ID required")
		return
	}
	
	rows, err := app.db.Query(`
		SELECT id, slug, title, description, phase, 
		       COALESCE(phase_order, 1), sequence_order, 
		       COALESCE(metaphor_progress, ''),
		       estimated_minutes, 
		       COALESCE(difficulty_modifier, 0),
		       is_premium
		FROM lessons
		WHERE tool_id = ? AND is_published = 1
		ORDER BY sequence_order
	`, toolID)
	if err != nil {
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"blueprint": []interface{}{},
			"crafting":  []interface{}{},
			"mastery":   []interface{}{},
		})
		return
	}
	defer rows.Close()
	
	blueprint := []map[string]interface{}{}
	crafting := []map[string]interface{}{}
	mastery := []map[string]interface{}{}
	
	for rows.Next() {
		var id, slug, title, description, phase, metaphorProgress string
		var phaseOrder, sequenceOrder, estimatedMinutes int
		var difficultyMod float64
		var isPremium bool
		
		err := rows.Scan(&id, &slug, &title, &description, &phase,
			&phaseOrder, &sequenceOrder, &metaphorProgress, &estimatedMinutes,
			&difficultyMod, &isPremium)
		if err != nil {
			continue
		}
		
		lesson := map[string]interface{}{
			"id":               id,
			"slug":             slug,
			"title":            title,
			"description":      description,
			"phase":            phase,
			"phaseOrder":       phaseOrder,
			"sequenceOrder":    sequenceOrder,
			"metaphorProgress": metaphorProgress,
			"estimatedMinutes": estimatedMinutes,
			"difficultyModifier": difficultyMod,
			"isPremium":        isPremium,
		}
		
		switch phase {
		case "blueprint":
			blueprint = append(blueprint, lesson)
		case "crafting":
			crafting = append(crafting, lesson)
		case "mastery":
			mastery = append(mastery, lesson)
		}
	}
	
	response.JSON(w, http.StatusOK, map[string]interface{}{
		"toolId":    toolID,
		"blueprint": blueprint,
		"crafting":  crafting,
		"mastery":   mastery,
		"total":     len(blueprint) + len(crafting) + len(mastery),
	})
}

// handleGetToolMetaphor returns the metaphor for a tool
func (app *App) handleGetToolMetaphor(w http.ResponseWriter, r *http.Request) {
	toolID := r.PathValue("toolId")
	if toolID == "" {
		response.BadRequest(w, "Tool ID required")
		return
	}
	
	var metaphor struct {
		ToolID            string `json:"toolId"`
		MetaphorName      string `json:"metaphorName"`
		MetaphorIcon      string `json:"metaphorIcon"`
		Stage1Name        string `json:"stage1Name"`
		Stage1Description string `json:"stage1Description"`
		Stage2Name        string `json:"stage2Name"`
		Stage2Description string `json:"stage2Description"`
		Stage3Name        string `json:"stage3Name"`
		Stage3Description string `json:"stage3Description"`
		BlueprintVisual   string `json:"blueprintVisual"`
		CraftingVisual    string `json:"craftingVisual"`
		MasteryVisual     string `json:"masteryVisual"`
	}
	
	err := app.db.QueryRow(`
		SELECT tool_id, metaphor_name, metaphor_icon,
		       stage_1_name, COALESCE(stage_1_description, ''),
		       stage_2_name, COALESCE(stage_2_description, ''),
		       stage_3_name, COALESCE(stage_3_description, ''),
		       COALESCE(blueprint_visual, ''),
		       COALESCE(crafting_visual, ''),
		       COALESCE(mastery_visual, '')
		FROM tool_metaphors
		WHERE tool_id = ?
	`, toolID).Scan(
		&metaphor.ToolID, &metaphor.MetaphorName, &metaphor.MetaphorIcon,
		&metaphor.Stage1Name, &metaphor.Stage1Description,
		&metaphor.Stage2Name, &metaphor.Stage2Description,
		&metaphor.Stage3Name, &metaphor.Stage3Description,
		&metaphor.BlueprintVisual, &metaphor.CraftingVisual, &metaphor.MasteryVisual,
	)
	
	if err != nil {
		// Return default if no metaphor found
		response.JSON(w, http.StatusOK, map[string]interface{}{
			"toolId":       toolID,
			"metaphorName": "Tool",
			"metaphorIcon": "🔧",
		})
		return
	}
	
	response.JSON(w, http.StatusOK, metaphor)
}

// handleGetToolDocs returns language documentation for a tool
func (app *App) handleGetToolDocs(w http.ResponseWriter, r *http.Request) {
	toolID := r.PathValue("toolId")
	if toolID == "" {
		response.BadRequest(w, "Tool ID required")
		return
	}
	
	rows, err := app.db.Query(`
		SELECT language_id, doc_url, doc_title, doc_source,
		       COALESCE(official_syntax, ''), COALESCE(notes, '')
		FROM language_docs
		WHERE tool_id = ?
		ORDER BY language_id, display_order
	`, toolID)
	if err != nil {
		response.JSON(w, http.StatusOK, map[string]interface{}{})
		return
	}
	defer rows.Close()
	
	// Group by language
	docs := map[string][]map[string]interface{}{}
	
	for rows.Next() {
		var langID, docURL, docTitle, docSource, syntax, notes string
		err := rows.Scan(&langID, &docURL, &docTitle, &docSource, &syntax, &notes)
		if err != nil {
			continue
		}
		
		if docs[langID] == nil {
			docs[langID] = []map[string]interface{}{}
		}
		
		docs[langID] = append(docs[langID], map[string]interface{}{
			"url":            docURL,
			"title":          docTitle,
			"source":         docSource,
			"officialSyntax": syntax,
			"notes":          notes,
		})
	}
	
	response.JSON(w, http.StatusOK, docs)
}
