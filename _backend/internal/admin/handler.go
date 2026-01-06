// Package admin provides admin CRUD handlers for content management
package admin

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/programprimitives/api/internal/auth"
	"github.com/programprimitives/api/internal/response"
)

// Handler manages admin operations
type Handler struct {
	db          *sql.DB
	middleware  *Middleware
	authHandler *auth.Handler
}

// NewHandler creates a new admin handler
func NewHandler(db *sql.DB, authHandler *auth.Handler) *Handler {
	return &Handler{
		db:          db,
		middleware:  NewMiddleware(db, authHandler),
		authHandler: authHandler,
	}
}

// GetMiddleware returns the admin middleware
func (h *Handler) GetMiddleware() *Middleware {
	return h.middleware
}

// ============================================
// Dashboard Stats
// ============================================

type DashboardStats struct {
	TotalUsers          int `json:"totalUsers"`
	TotalPrimitives     int `json:"totalPrimitives"`
	TotalExercises      int `json:"totalExercises"`
	TotalCompletions    int `json:"totalCompletions"`
	ActiveUsersToday    int `json:"activeUsersToday"`
	ActiveUsersWeek     int `json:"activeUsersWeek"`
	NewUsersToday       int `json:"newUsersToday"`
	NewUsersWeek        int `json:"newUsersWeek"`
	PremiumSubscribers  int `json:"premiumSubscribers"`
}

func (h *Handler) HandleDashboardStats(w http.ResponseWriter, r *http.Request) {
	stats := DashboardStats{}

	// Get counts - using COALESCE to handle empty tables
	h.db.QueryRow("SELECT COUNT(*) FROM users").Scan(&stats.TotalUsers)
	h.db.QueryRow("SELECT COUNT(*) FROM primitives").Scan(&stats.TotalPrimitives)
	h.db.QueryRow("SELECT COUNT(*) FROM exercises").Scan(&stats.TotalExercises)
	h.db.QueryRow("SELECT COUNT(*) FROM exercise_completions").Scan(&stats.TotalCompletions)
	
	// Active users (last 24h and last 7 days)
	h.db.QueryRow("SELECT COUNT(*) FROM users WHERE last_login_at > datetime('now', '-1 day')").Scan(&stats.ActiveUsersToday)
	h.db.QueryRow("SELECT COUNT(*) FROM users WHERE last_login_at > datetime('now', '-7 days')").Scan(&stats.ActiveUsersWeek)
	
	// New users
	h.db.QueryRow("SELECT COUNT(*) FROM users WHERE created_at > datetime('now', '-1 day')").Scan(&stats.NewUsersToday)
	h.db.QueryRow("SELECT COUNT(*) FROM users WHERE created_at > datetime('now', '-7 days')").Scan(&stats.NewUsersWeek)
	
	// Premium subscribers
	h.db.QueryRow("SELECT COUNT(*) FROM users WHERE subscription_tier != 'free'").Scan(&stats.PremiumSubscribers)

	response.JSON(w, http.StatusOK, stats)
}

// ============================================
// Primitive CRUD
// ============================================

type PrimitiveInput struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Category      string   `json:"category"`
	Subcategory   string   `json:"subcategory"`
	Description   string   `json:"description"`
	WhyItMatters  string   `json:"whyItMatters"`
	BestPractices []string `json:"bestPractices"`
	Pitfalls      []string `json:"pitfalls"`
	Difficulty    int      `json:"difficulty"`
	Prerequisites []string `json:"prerequisites"`
	Related       []string `json:"related"`
	Icon          string   `json:"icon"`
	CategoryOrder int      `json:"categoryOrder"`
	IsPremium     bool     `json:"isPremium"`
	IsPublished   bool     `json:"isPublished"`
}

func (h *Handler) HandleListPrimitives(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(`
		SELECT id, name, category, subcategory, description, why_it_matters, 
		       best_practices, pitfalls, difficulty, prerequisites, related, 
		       icon, category_order, is_premium, is_published, created_at, updated_at
		FROM primitives ORDER BY category_order, name
	`)
	if err != nil {
		log.Printf("Error listing primitives: %v", err)
		response.JSON(w, http.StatusOK, []interface{}{})
		return
	}
	defer rows.Close()

	var primitives []map[string]interface{}
	for rows.Next() {
		var id, name, category, description, whyItMatters, icon, createdAt, updatedAt string
		var subcategory, bestPractices, pitfalls, prerequisites, related sql.NullString
		var difficulty, categoryOrder int
		var isPremium, isPublished bool

		err := rows.Scan(&id, &name, &category, &subcategory, &description, &whyItMatters,
			&bestPractices, &pitfalls, &difficulty, &prerequisites, &related,
			&icon, &categoryOrder, &isPremium, &isPublished, &createdAt, &updatedAt)
		if err != nil {
			continue
		}

		primitives = append(primitives, map[string]interface{}{
			"id":            id,
			"name":          name,
			"category":      category,
			"subcategory":   nullStringToString(subcategory),
			"description":   description,
			"whyItMatters":  whyItMatters,
			"bestPractices": parseJSONArray(bestPractices),
			"pitfalls":      parseJSONArray(pitfalls),
			"difficulty":    difficulty,
			"prerequisites": parseJSONArray(prerequisites),
			"related":       parseJSONArray(related),
			"icon":          icon,
			"categoryOrder": categoryOrder,
			"isPremium":     isPremium,
			"isPublished":   isPublished,
			"createdAt":     createdAt,
			"updatedAt":     updatedAt,
		})
	}

	response.JSON(w, http.StatusOK, primitives)
}

func (h *Handler) HandleCreatePrimitive(w http.ResponseWriter, r *http.Request) {
	var input PrimitiveInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	// Validate required fields
	if input.ID == "" || input.Name == "" || input.Category == "" {
		response.BadRequest(w, "ID, name, and category are required")
		return
	}

	// Slugify ID if needed
	input.ID = slugify(input.ID)

	now := time.Now().UTC().Format(time.RFC3339)
	_, err := h.db.Exec(`
		INSERT INTO primitives (id, name, category, subcategory, description, why_it_matters, 
		                        best_practices, pitfalls, difficulty, prerequisites, related, 
		                        icon, category_order, is_premium, is_published, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		input.ID, input.Name, input.Category, input.Subcategory, input.Description, input.WhyItMatters,
		toJSONArray(input.BestPractices), toJSONArray(input.Pitfalls), input.Difficulty,
		toJSONArray(input.Prerequisites), toJSONArray(input.Related),
		input.Icon, input.CategoryOrder, input.IsPremium, input.IsPublished, now, now,
	)

	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE") {
			response.BadRequest(w, "Primitive with this ID already exists")
			return
		}
		log.Printf("Error creating primitive: %v", err)
		response.InternalErrorWithMessage(w, "Failed to create primitive")
		return
	}

	// Log action
	user := h.authHandler.GetUserFromSession(r)
	if user != nil {
		h.middleware.LogAction(user.ID, "create", "primitive", input.ID, "", input.Name, r.RemoteAddr)
	}

	response.JSON(w, http.StatusCreated, map[string]interface{}{
		"id":      input.ID,
		"message": "Primitive created successfully",
	})
}

func (h *Handler) HandleUpdatePrimitive(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.BadRequest(w, "Primitive ID required")
		return
	}

	var input PrimitiveInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)
	result, err := h.db.Exec(`
		UPDATE primitives SET 
			name = ?, category = ?, subcategory = ?, description = ?, why_it_matters = ?,
			best_practices = ?, pitfalls = ?, difficulty = ?, prerequisites = ?, related = ?,
			icon = ?, category_order = ?, is_premium = ?, is_published = ?, updated_at = ?
		WHERE id = ?
	`,
		input.Name, input.Category, input.Subcategory, input.Description, input.WhyItMatters,
		toJSONArray(input.BestPractices), toJSONArray(input.Pitfalls), input.Difficulty,
		toJSONArray(input.Prerequisites), toJSONArray(input.Related),
		input.Icon, input.CategoryOrder, input.IsPremium, input.IsPublished, now, id,
	)

	if err != nil {
		log.Printf("Error updating primitive: %v", err)
		response.InternalErrorWithMessage(w, "Failed to update primitive")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		response.NotFound(w, "Primitive not found")
		return
	}

	// Log action
	user := h.authHandler.GetUserFromSession(r)
	if user != nil {
		h.middleware.LogAction(user.ID, "update", "primitive", id, "", input.Name, r.RemoteAddr)
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Primitive updated successfully",
	})
}

func (h *Handler) HandleDeletePrimitive(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.BadRequest(w, "Primitive ID required")
		return
	}

	result, err := h.db.Exec("DELETE FROM primitives WHERE id = ?", id)
	if err != nil {
		log.Printf("Error deleting primitive: %v", err)
		response.InternalErrorWithMessage(w, "Failed to delete primitive")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		response.NotFound(w, "Primitive not found")
		return
	}

	// Log action
	user := h.authHandler.GetUserFromSession(r)
	if user != nil {
		h.middleware.LogAction(user.ID, "delete", "primitive", id, "", "", r.RemoteAddr)
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Primitive deleted successfully",
	})
}

// ============================================
// Exercise CRUD
// ============================================

type ExerciseInput struct {
	ID               string   `json:"id"`
	PrimitiveID      string   `json:"primitiveId"`
	Title            string   `json:"title"`
	Slug             string   `json:"slug"`
	Description      string   `json:"description"`
	Difficulty       int      `json:"difficulty"`
	EstimatedMinutes int      `json:"estimatedMinutes"`
	Instructions     string   `json:"instructions"`
	Hints            []string `json:"hints"`
	SequenceOrder    int      `json:"sequenceOrder"`
	IsPremium        bool     `json:"isPremium"`
	IsPublished      bool     `json:"isPublished"`
}

func (h *Handler) HandleListExercises(w http.ResponseWriter, r *http.Request) {
	primitiveFilter := r.URL.Query().Get("primitive")
	
	query := `
		SELECT e.id, e.primitive_id, e.title, e.slug, e.description, e.difficulty, 
		       e.estimated_minutes, e.instructions, e.hints, e.sequence_order, 
		       e.is_premium, e.is_published, e.created_at, e.updated_at,
		       p.name as primitive_name
		FROM exercises e
		LEFT JOIN primitives p ON e.primitive_id = p.id
	`
	
	args := []interface{}{}
	if primitiveFilter != "" {
		query += " WHERE e.primitive_id = ?"
		args = append(args, primitiveFilter)
	}
	query += " ORDER BY e.primitive_id, e.sequence_order, e.title"

	rows, err := h.db.Query(query, args...)
	if err != nil {
		log.Printf("Error listing exercises: %v", err)
		response.JSON(w, http.StatusOK, []interface{}{})
		return
	}
	defer rows.Close()

	var exercises []map[string]interface{}
	for rows.Next() {
		var id, primitiveID, title, slug, description, instructions, createdAt, updatedAt string
		var hints sql.NullString
		var primitiveName sql.NullString
		var difficulty, estimatedMinutes, sequenceOrder int
		var isPremium, isPublished bool

		err := rows.Scan(&id, &primitiveID, &title, &slug, &description, &difficulty,
			&estimatedMinutes, &instructions, &hints, &sequenceOrder,
			&isPremium, &isPublished, &createdAt, &updatedAt, &primitiveName)
		if err != nil {
			continue
		}

		exercises = append(exercises, map[string]interface{}{
			"id":               id,
			"primitiveId":      primitiveID,
			"primitiveName":    nullStringToString(primitiveName),
			"title":            title,
			"slug":             slug,
			"description":      description,
			"difficulty":       difficulty,
			"estimatedMinutes": estimatedMinutes,
			"instructions":     instructions,
			"hints":            parseJSONArray(hints),
			"sequenceOrder":    sequenceOrder,
			"isPremium":        isPremium,
			"isPublished":      isPublished,
			"createdAt":        createdAt,
			"updatedAt":        updatedAt,
		})
	}

	response.JSON(w, http.StatusOK, exercises)
}

func (h *Handler) HandleCreateExercise(w http.ResponseWriter, r *http.Request) {
	var input ExerciseInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	if input.PrimitiveID == "" || input.Title == "" {
		response.BadRequest(w, "Primitive ID and title are required")
		return
	}

	// Generate ID and slug if not provided
	if input.ID == "" {
		input.ID = generateID()
	}
	if input.Slug == "" {
		input.Slug = slugify(input.Title)
	}

	now := time.Now().UTC().Format(time.RFC3339)
	_, err := h.db.Exec(`
		INSERT INTO exercises (id, primitive_id, title, slug, description, difficulty, 
		                       estimated_minutes, instructions, hints, sequence_order, 
		                       is_premium, is_published, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		input.ID, input.PrimitiveID, input.Title, input.Slug, input.Description,
		input.Difficulty, input.EstimatedMinutes, input.Instructions,
		toJSONArray(input.Hints), input.SequenceOrder, input.IsPremium, input.IsPublished, now, now,
	)

	if err != nil {
		log.Printf("Error creating exercise: %v", err)
		response.InternalErrorWithMessage(w, "Failed to create exercise")
		return
	}

	// Log action
	user := h.authHandler.GetUserFromSession(r)
	if user != nil {
		h.middleware.LogAction(user.ID, "create", "exercise", input.ID, "", input.Title, r.RemoteAddr)
	}

	response.JSON(w, http.StatusCreated, map[string]interface{}{
		"id":      input.ID,
		"message": "Exercise created successfully",
	})
}

func (h *Handler) HandleUpdateExercise(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.BadRequest(w, "Exercise ID required")
		return
	}

	var input ExerciseInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)
	result, err := h.db.Exec(`
		UPDATE exercises SET 
			primitive_id = ?, title = ?, slug = ?, description = ?, difficulty = ?,
			estimated_minutes = ?, instructions = ?, hints = ?, sequence_order = ?,
			is_premium = ?, is_published = ?, updated_at = ?
		WHERE id = ?
	`,
		input.PrimitiveID, input.Title, input.Slug, input.Description, input.Difficulty,
		input.EstimatedMinutes, input.Instructions, toJSONArray(input.Hints),
		input.SequenceOrder, input.IsPremium, input.IsPublished, now, id,
	)

	if err != nil {
		log.Printf("Error updating exercise: %v", err)
		response.InternalErrorWithMessage(w, "Failed to update exercise")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		response.NotFound(w, "Exercise not found")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Exercise updated successfully",
	})
}

func (h *Handler) HandleDeleteExercise(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.BadRequest(w, "Exercise ID required")
		return
	}

	result, err := h.db.Exec("DELETE FROM exercises WHERE id = ?", id)
	if err != nil {
		log.Printf("Error deleting exercise: %v", err)
		response.InternalErrorWithMessage(w, "Failed to delete exercise")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		response.NotFound(w, "Exercise not found")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Exercise deleted successfully",
	})
}

// ============================================
// Starter Code CRUD
// ============================================

type StarterCodeInput struct {
	ExerciseID   string `json:"exerciseId"`
	Language     string `json:"language"`
	StarterCode  string `json:"starterCode"`
	SolutionCode string `json:"solutionCode"`
}

func (h *Handler) HandleListStarterCode(w http.ResponseWriter, r *http.Request) {
	exerciseID := r.PathValue("exerciseId")
	
	rows, err := h.db.Query(`
		SELECT id, exercise_id, language, starter_code, solution_code, created_at, updated_at
		FROM exercise_starter_code WHERE exercise_id = ?
	`, exerciseID)
	if err != nil {
		response.JSON(w, http.StatusOK, []interface{}{})
		return
	}
	defer rows.Close()

	var codes []map[string]interface{}
	for rows.Next() {
		var id, exerciseID, language, starterCode, solutionCode, createdAt, updatedAt string
		rows.Scan(&id, &exerciseID, &language, &starterCode, &solutionCode, &createdAt, &updatedAt)
		codes = append(codes, map[string]interface{}{
			"id": id, "exerciseId": exerciseID, "language": language,
			"starterCode": starterCode, "solutionCode": solutionCode,
			"createdAt": createdAt, "updatedAt": updatedAt,
		})
	}

	response.JSON(w, http.StatusOK, codes)
}

func (h *Handler) HandleUpsertStarterCode(w http.ResponseWriter, r *http.Request) {
	var input StarterCodeInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)
	
	// Try update first
	result, err := h.db.Exec(`
		UPDATE exercise_starter_code SET starter_code = ?, solution_code = ?, updated_at = ?
		WHERE exercise_id = ? AND language = ?
	`, input.StarterCode, input.SolutionCode, now, input.ExerciseID, input.Language)

	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to update starter code")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		// Insert new
		_, err = h.db.Exec(`
			INSERT INTO exercise_starter_code (id, exercise_id, language, starter_code, solution_code, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`, generateID(), input.ExerciseID, input.Language, input.StarterCode, input.SolutionCode, now, now)
		
		if err != nil {
			response.InternalErrorWithMessage(w, "Failed to create starter code")
			return
		}
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Starter code saved successfully",
	})
}

// ============================================
// Test Cases CRUD
// ============================================

type TestCaseInput struct {
	ID             string `json:"id"`
	ExerciseID     string `json:"exerciseId"`
	Name           string `json:"name"`
	Description    string `json:"description"`
	Input          string `json:"input"`
	ExpectedOutput string `json:"expectedOutput"`
	IsHidden       bool   `json:"isHidden"`
	TimeoutMs      int    `json:"timeoutMs"`
	SequenceOrder  int    `json:"sequenceOrder"`
}

func (h *Handler) HandleListTestCases(w http.ResponseWriter, r *http.Request) {
	exerciseID := r.PathValue("exerciseId")
	
	rows, err := h.db.Query(`
		SELECT id, exercise_id, name, description, input, expected_output, is_hidden, timeout_ms, sequence_order
		FROM exercise_test_cases WHERE exercise_id = ? ORDER BY sequence_order
	`, exerciseID)
	if err != nil {
		response.JSON(w, http.StatusOK, []interface{}{})
		return
	}
	defer rows.Close()

	var tests []map[string]interface{}
	for rows.Next() {
		var id, exerciseID, name, input, expectedOutput string
		var description sql.NullString
		var isHidden bool
		var timeoutMs, sequenceOrder int
		rows.Scan(&id, &exerciseID, &name, &description, &input, &expectedOutput, &isHidden, &timeoutMs, &sequenceOrder)
		tests = append(tests, map[string]interface{}{
			"id": id, "exerciseId": exerciseID, "name": name, "description": nullStringToString(description),
			"input": input, "expectedOutput": expectedOutput, "isHidden": isHidden,
			"timeoutMs": timeoutMs, "sequenceOrder": sequenceOrder,
		})
	}

	response.JSON(w, http.StatusOK, tests)
}

func (h *Handler) HandleCreateTestCase(w http.ResponseWriter, r *http.Request) {
	var input TestCaseInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	if input.ID == "" {
		input.ID = generateID()
	}
	if input.TimeoutMs == 0 {
		input.TimeoutMs = 5000
	}

	now := time.Now().UTC().Format(time.RFC3339)
	_, err := h.db.Exec(`
		INSERT INTO exercise_test_cases (id, exercise_id, name, description, input, expected_output, is_hidden, timeout_ms, sequence_order, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, input.ID, input.ExerciseID, input.Name, input.Description, input.Input, input.ExpectedOutput, input.IsHidden, input.TimeoutMs, input.SequenceOrder, now)

	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to create test case")
		return
	}

	response.JSON(w, http.StatusCreated, map[string]interface{}{
		"id":      input.ID,
		"message": "Test case created successfully",
	})
}

func (h *Handler) HandleDeleteTestCase(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	h.db.Exec("DELETE FROM exercise_test_cases WHERE id = ?", id)
	response.JSON(w, http.StatusOK, map[string]interface{}{"message": "Test case deleted"})
}

// ============================================
// Syntax CRUD
// ============================================

type SyntaxInput struct {
	PrimitiveID    string `json:"primitiveId"`
	Language       string `json:"language"`
	SyntaxTemplate string `json:"syntaxTemplate"`
	FullExample    string `json:"fullExample"`
	Explanation    string `json:"explanation"`
	Variations     string `json:"variations"`
	IsPrimary      bool   `json:"isPrimary"`
}

func (h *Handler) HandleListSyntax(w http.ResponseWriter, r *http.Request) {
	primitiveID := r.PathValue("primitiveId")
	
	rows, err := h.db.Query(`
		SELECT id, primitive_id, language, syntax_template, full_example, explanation, variations, is_primary
		FROM primitive_syntax WHERE primitive_id = ?
	`, primitiveID)
	if err != nil {
		response.JSON(w, http.StatusOK, []interface{}{})
		return
	}
	defer rows.Close()

	var syntaxes []map[string]interface{}
	for rows.Next() {
		var id, primitiveID, language, syntaxTemplate, fullExample string
		var explanation, variations sql.NullString
		var isPrimary bool
		rows.Scan(&id, &primitiveID, &language, &syntaxTemplate, &fullExample, &explanation, &variations, &isPrimary)
		syntaxes = append(syntaxes, map[string]interface{}{
			"id": id, "primitiveId": primitiveID, "language": language,
			"syntaxTemplate": syntaxTemplate, "fullExample": fullExample,
			"explanation": nullStringToString(explanation), "variations": nullStringToString(variations),
			"isPrimary": isPrimary,
		})
	}

	response.JSON(w, http.StatusOK, syntaxes)
}

func (h *Handler) HandleUpsertSyntax(w http.ResponseWriter, r *http.Request) {
	var input SyntaxInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)
	
	// Try update first
	result, err := h.db.Exec(`
		UPDATE primitive_syntax SET syntax_template = ?, full_example = ?, explanation = ?, variations = ?, is_primary = ?, updated_at = ?
		WHERE primitive_id = ? AND language = ?
	`, input.SyntaxTemplate, input.FullExample, input.Explanation, input.Variations, input.IsPrimary, now, input.PrimitiveID, input.Language)

	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to update syntax")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		// Insert new
		_, err = h.db.Exec(`
			INSERT INTO primitive_syntax (id, primitive_id, language, syntax_template, full_example, explanation, variations, is_primary, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, generateID(), input.PrimitiveID, input.Language, input.SyntaxTemplate, input.FullExample, input.Explanation, input.Variations, input.IsPrimary, now, now)
		
		if err != nil {
			response.InternalErrorWithMessage(w, "Failed to create syntax")
			return
		}
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Syntax saved successfully",
	})
}

// ============================================
// User Management
// ============================================

func (h *Handler) HandleListUsers(w http.ResponseWriter, r *http.Request) {
	limit := 50
	offset := 0
	
	rows, err := h.db.Query(`
		SELECT id, email, display_name, role, subscription_tier, created_at, last_login_at
		FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?
	`, limit, offset)
	if err != nil {
		response.JSON(w, http.StatusOK, []interface{}{})
		return
	}
	defer rows.Close()

	var users []map[string]interface{}
	for rows.Next() {
		var id, email, displayName, role, subscriptionTier, createdAt string
		var lastLoginAt sql.NullString
		rows.Scan(&id, &email, &displayName, &role, &subscriptionTier, &createdAt, &lastLoginAt)
		users = append(users, map[string]interface{}{
			"id": id, "email": email, "displayName": displayName, "role": role,
			"subscriptionTier": subscriptionTier, "createdAt": createdAt,
			"lastLoginAt": nullStringToString(lastLoginAt),
		})
	}

	response.JSON(w, http.StatusOK, users)
}

func (h *Handler) HandleUpdateUserRole(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	
	var input struct {
		Role string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	if input.Role != "user" && input.Role != "admin" {
		response.BadRequest(w, "Role must be 'user' or 'admin'")
		return
	}

	result, err := h.db.Exec("UPDATE users SET role = ? WHERE id = ?", input.Role, id)
	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to update user role")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		response.NotFound(w, "User not found")
		return
	}

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "User role updated",
	})
}

// ============================================
// Audit Log
// ============================================

func (h *Handler) HandleListAuditLog(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(`
		SELECT a.id, a.action, a.entity_type, a.entity_id, a.created_at, u.display_name
		FROM admin_audit_log a
		LEFT JOIN users u ON a.admin_user_id = u.id
		ORDER BY a.created_at DESC LIMIT 100
	`)
	if err != nil {
		response.JSON(w, http.StatusOK, []interface{}{})
		return
	}
	defer rows.Close()

	var logs []map[string]interface{}
	for rows.Next() {
		var id, action, entityType, entityID, createdAt string
		var adminName sql.NullString
		rows.Scan(&id, &action, &entityType, &entityID, &createdAt, &adminName)
		logs = append(logs, map[string]interface{}{
			"id": id, "action": action, "entityType": entityType, "entityId": entityID,
			"createdAt": createdAt, "adminName": nullStringToString(adminName),
		})
	}

	response.JSON(w, http.StatusOK, logs)
}

// ============================================
// Helper Functions
// ============================================

func slugify(s string) string {
	s = strings.ToLower(s)
	s = strings.ReplaceAll(s, " ", "-")
	return s
}

func toJSONArray(arr []string) string {
	if len(arr) == 0 {
		return "[]"
	}
	b, _ := json.Marshal(arr)
	return string(b)
}

func parseJSONArray(ns sql.NullString) []string {
	if !ns.Valid || ns.String == "" || ns.String == "null" {
		return []string{}
	}
	var arr []string
	json.Unmarshal([]byte(ns.String), &arr)
	return arr
}

func nullStringToString(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}
