// Package admin - Lesson CRUD handlers for content management
package admin

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/programprimitives/api/internal/response"
)

// ============================================
// Lesson Types
// ============================================

type Lesson struct {
	ID               string  `json:"id"`
	ToolID           string  `json:"toolId"`
	Slug             string  `json:"slug"`
	Title            string  `json:"title"`
	Description      string  `json:"description"`
	Phase            string  `json:"phase"`
	PhaseOrder       int     `json:"phaseOrder"`
	SequenceOrder    int     `json:"sequenceOrder"`
	MetaphorProgress string  `json:"metaphorProgress,omitempty"`
	ContentMarkdown  string  `json:"contentMarkdown,omitempty"`
	VisualElements   string  `json:"visualElements,omitempty"`
	EstimatedMinutes int     `json:"estimatedMinutes"`
	DifficultyMod    float64 `json:"difficultyModifier"`
	XpReward         int     `json:"xpReward"`
	IsPremium        bool    `json:"isPremium"`
	IsPublished      bool    `json:"isPublished"`
	LastEditedBy     string  `json:"lastEditedBy,omitempty"`
	LastEditedAt     string  `json:"lastEditedAt,omitempty"`
	Version          int     `json:"version"`
	CreatedAt        string  `json:"createdAt"`
	UpdatedAt        string  `json:"updatedAt"`
}

type LessonInput struct {
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
	XpReward         int     `json:"xpReward"`
	IsPremium        bool    `json:"isPremium"`
	IsPublished      bool    `json:"isPublished"`
}

type ToolMetaphor struct {
	ID                string `json:"id"`
	ToolID            string `json:"toolId"`
	MetaphorName      string `json:"metaphorName"`
	MetaphorIcon      string `json:"metaphorIcon"`
	Stage1Name        string `json:"stage1Name"`
	Stage1Description string `json:"stage1Description,omitempty"`
	Stage2Name        string `json:"stage2Name"`
	Stage2Description string `json:"stage2Description,omitempty"`
	Stage3Name        string `json:"stage3Name"`
	Stage3Description string `json:"stage3Description,omitempty"`
	BlueprintVisual   string `json:"blueprintVisual,omitempty"`
	CraftingVisual    string `json:"craftingVisual,omitempty"`
	MasteryVisual     string `json:"masteryVisual,omitempty"`
}

type LanguageDoc struct {
	ID             string `json:"id"`
	LanguageID     string `json:"languageId"`
	ToolID         string `json:"toolId"`
	DocURL         string `json:"docUrl"`
	DocTitle       string `json:"docTitle"`
	DocSource      string `json:"docSource"`
	OfficialSyntax string `json:"officialSyntax,omitempty"`
	Notes          string `json:"notes,omitempty"`
	DisplayOrder   int    `json:"displayOrder"`
}

// ============================================
// List Lessons (with optional tool filter)
// ============================================

func (h *Handler) HandleListLessons(w http.ResponseWriter, r *http.Request) {
	toolID := r.URL.Query().Get("toolId")
	phase := r.URL.Query().Get("phase")

	query := `
		SELECT id, tool_id, slug, title, description, phase, 
		       COALESCE(phase_order, 1), sequence_order, 
		       COALESCE(metaphor_progress, ''), 
		       COALESCE(content_markdown, ''),
		       COALESCE(visual_elements, ''),
		       estimated_minutes, 
		       COALESCE(difficulty_modifier, 0),
		       COALESCE(xp_reward, 25),
		       is_premium, is_published,
		       COALESCE(last_edited_by, ''),
		       COALESCE(last_edited_at, ''),
		       COALESCE(version, 1),
		       created_at, updated_at
		FROM lessons
		WHERE 1=1
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

	rows, err := h.db.Query(query, args...)
	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to fetch lessons")
		return
	}
	defer rows.Close()

	lessons := []Lesson{}
	for rows.Next() {
		var l Lesson
		err := rows.Scan(
			&l.ID, &l.ToolID, &l.Slug, &l.Title, &l.Description, &l.Phase,
			&l.PhaseOrder, &l.SequenceOrder, &l.MetaphorProgress,
			&l.ContentMarkdown, &l.VisualElements, &l.EstimatedMinutes,
			&l.DifficultyMod, &l.XpReward, &l.IsPremium, &l.IsPublished,
			&l.LastEditedBy, &l.LastEditedAt, &l.Version,
			&l.CreatedAt, &l.UpdatedAt,
		)
		if err != nil {
			continue
		}
		lessons = append(lessons, l)
	}

	response.JSON(w, http.StatusOK, lessons)
}

// ============================================
// Get Single Lesson
// ============================================

func (h *Handler) HandleGetLesson(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.BadRequest(w, "Lesson ID required")
		return
	}

	var l Lesson
	err := h.db.QueryRow(`
		SELECT id, tool_id, slug, title, description, phase, 
		       COALESCE(phase_order, 1), sequence_order, 
		       COALESCE(metaphor_progress, ''), 
		       COALESCE(content_markdown, ''),
		       COALESCE(visual_elements, ''),
		       estimated_minutes, 
		       COALESCE(difficulty_modifier, 0),
		       COALESCE(xp_reward, 25),
		       is_premium, is_published,
		       COALESCE(last_edited_by, ''),
		       COALESCE(last_edited_at, ''),
		       COALESCE(version, 1),
		       created_at, updated_at
		FROM lessons
		WHERE id = ?
	`, id).Scan(
		&l.ID, &l.ToolID, &l.Slug, &l.Title, &l.Description, &l.Phase,
		&l.PhaseOrder, &l.SequenceOrder, &l.MetaphorProgress,
		&l.ContentMarkdown, &l.VisualElements, &l.EstimatedMinutes,
		&l.DifficultyMod, &l.XpReward, &l.IsPremium, &l.IsPublished,
		&l.LastEditedBy, &l.LastEditedAt, &l.Version,
		&l.CreatedAt, &l.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		response.NotFound(w, "Lesson not found")
		return
	}
	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to fetch lesson")
		return
	}

	response.JSON(w, http.StatusOK, l)
}

// ============================================
// Create Lesson
// ============================================

func (h *Handler) HandleCreateLesson(w http.ResponseWriter, r *http.Request) {
	var input LessonInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	// Validate required fields
	if input.ToolID == "" || input.Slug == "" || input.Title == "" {
		response.BadRequest(w, "toolId, slug, and title are required")
		return
	}

	// Validate phase
	if input.Phase != "blueprint" && input.Phase != "crafting" && input.Phase != "mastery" {
		response.BadRequest(w, "phase must be blueprint, crafting, or mastery")
		return
	}

	// Get admin user from session
	adminID := ""
	if user := h.authHandler.GetUserFromSession(r); user != nil {
		adminID = user.ID
	}

	// Generate ID
	id := strings.ToLower(input.ToolID + "-" + input.Slug)
	now := time.Now().UTC().Format(time.RFC3339)

	// Default XP reward to 25 if not set
	xpReward := input.XpReward
	if xpReward == 0 {
		xpReward = 25
	}

	_, err := h.db.Exec(`
		INSERT INTO lessons (
			id, tool_id, slug, title, description, phase, phase_order,
			sequence_order, metaphor_progress, content_markdown, visual_elements,
			estimated_minutes, difficulty_modifier, xp_reward, is_premium, is_published,
			last_edited_by, last_edited_at, version, created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
	`,
		id, input.ToolID, input.Slug, input.Title, input.Description,
		input.Phase, input.PhaseOrder, input.SequenceOrder, input.MetaphorProgress,
		input.ContentMarkdown, input.VisualElements, input.EstimatedMinutes,
		input.DifficultyMod, xpReward, input.IsPremium, input.IsPublished,
		adminID, now, now, now,
	)

	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint") {
			response.Error(w, http.StatusConflict, response.ErrValidation, "Lesson with this slug already exists for this tool")
			return
		}
		response.InternalErrorWithMessage(w, "Failed to create lesson")
		return
	}

	// Log audit
	h.logAudit(adminID, "CREATE", "lesson", id, "Created lesson: "+input.Title)

	response.JSON(w, http.StatusCreated, map[string]string{"id": id, "message": "Lesson created"})
}

// ============================================
// Update Lesson
// ============================================

func (h *Handler) HandleUpdateLesson(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.BadRequest(w, "Lesson ID required")
		return
	}

	var input LessonInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.BadRequest(w, "Invalid JSON")
		return
	}

	// Get current version
	var currentVersion int
	err := h.db.QueryRow("SELECT COALESCE(version, 1) FROM lessons WHERE id = ?", id).Scan(&currentVersion)
	if err == sql.ErrNoRows {
		response.NotFound(w, "Lesson not found")
		return
	}

	// Get admin user from session
	adminID := ""
	if user := h.authHandler.GetUserFromSession(r); user != nil {
		adminID = user.ID
	}

	now := time.Now().UTC().Format(time.RFC3339)
	newVersion := currentVersion + 1

	// Default XP reward to 25 if not set
	xpReward := input.XpReward
	if xpReward == 0 {
		xpReward = 25
	}

	_, err = h.db.Exec(`
		UPDATE lessons SET
			title = ?, description = ?, phase = ?, phase_order = ?,
			sequence_order = ?, metaphor_progress = ?, content_markdown = ?,
			visual_elements = ?, estimated_minutes = ?, difficulty_modifier = ?,
			xp_reward = ?, is_premium = ?, is_published = ?, last_edited_by = ?,
			last_edited_at = ?, version = ?, updated_at = ?
		WHERE id = ?
	`,
		input.Title, input.Description, input.Phase, input.PhaseOrder,
		input.SequenceOrder, input.MetaphorProgress, input.ContentMarkdown,
		input.VisualElements, input.EstimatedMinutes, input.DifficultyMod,
		xpReward, input.IsPremium, input.IsPublished, adminID, now, newVersion, now, id,
	)

	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to update lesson")
		return
	}

	// Log audit
	h.logAudit(adminID, "UPDATE", "lesson", id, "Updated lesson: "+input.Title)

	response.JSON(w, http.StatusOK, map[string]interface{}{
		"message": "Lesson updated",
		"version": newVersion,
	})
}

// ============================================
// Delete Lesson
// ============================================

func (h *Handler) HandleDeleteLesson(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		response.BadRequest(w, "Lesson ID required")
		return
	}

	// Get lesson title for audit
	var title string
	h.db.QueryRow("SELECT title FROM lessons WHERE id = ?", id).Scan(&title)

	result, err := h.db.Exec("DELETE FROM lessons WHERE id = ?", id)
	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to delete lesson")
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		response.NotFound(w, "Lesson not found")
		return
	}

	// Log audit
	adminID := ""
	if user := h.authHandler.GetUserFromSession(r); user != nil {
		adminID = user.ID
	}
	h.logAudit(adminID, "DELETE", "lesson", id, "Deleted lesson: "+title)

	response.JSON(w, http.StatusOK, map[string]string{"message": "Lesson deleted"})
}

// ============================================
// Tool Metaphors CRUD
// ============================================

func (h *Handler) HandleListMetaphors(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(`
		SELECT id, tool_id, metaphor_name, metaphor_icon,
		       stage_1_name, COALESCE(stage_1_description, ''),
		       stage_2_name, COALESCE(stage_2_description, ''),
		       stage_3_name, COALESCE(stage_3_description, ''),
		       COALESCE(blueprint_visual, ''),
		       COALESCE(crafting_visual, ''),
		       COALESCE(mastery_visual, '')
		FROM tool_metaphors
		ORDER BY tool_id
	`)
	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to fetch metaphors")
		return
	}
	defer rows.Close()

	metaphors := []ToolMetaphor{}
	for rows.Next() {
		var m ToolMetaphor
		err := rows.Scan(
			&m.ID, &m.ToolID, &m.MetaphorName, &m.MetaphorIcon,
			&m.Stage1Name, &m.Stage1Description,
			&m.Stage2Name, &m.Stage2Description,
			&m.Stage3Name, &m.Stage3Description,
			&m.BlueprintVisual, &m.CraftingVisual, &m.MasteryVisual,
		)
		if err != nil {
			continue
		}
		metaphors = append(metaphors, m)
	}

	response.JSON(w, http.StatusOK, metaphors)
}

func (h *Handler) HandleGetMetaphor(w http.ResponseWriter, r *http.Request) {
	toolID := r.PathValue("toolId")
	if toolID == "" {
		response.BadRequest(w, "Tool ID required")
		return
	}

	var m ToolMetaphor
	err := h.db.QueryRow(`
		SELECT id, tool_id, metaphor_name, metaphor_icon,
		       stage_1_name, COALESCE(stage_1_description, ''),
		       stage_2_name, COALESCE(stage_2_description, ''),
		       stage_3_name, COALESCE(stage_3_description, ''),
		       COALESCE(blueprint_visual, ''),
		       COALESCE(crafting_visual, ''),
		       COALESCE(mastery_visual, '')
		FROM tool_metaphors
		WHERE tool_id = ?
	`, toolID).Scan(
		&m.ID, &m.ToolID, &m.MetaphorName, &m.MetaphorIcon,
		&m.Stage1Name, &m.Stage1Description,
		&m.Stage2Name, &m.Stage2Description,
		&m.Stage3Name, &m.Stage3Description,
		&m.BlueprintVisual, &m.CraftingVisual, &m.MasteryVisual,
	)

	if err == sql.ErrNoRows {
		response.NotFound(w, "Metaphor not found")
		return
	}
	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to fetch metaphor")
		return
	}

	response.JSON(w, http.StatusOK, m)
}

// ============================================
// Language Documentation CRUD
// ============================================

func (h *Handler) HandleListDocs(w http.ResponseWriter, r *http.Request) {
	toolID := r.URL.Query().Get("toolId")
	languageID := r.URL.Query().Get("languageId")

	query := `
		SELECT id, language_id, tool_id, doc_url, doc_title, doc_source,
		       COALESCE(official_syntax, ''), COALESCE(notes, ''), display_order
		FROM language_docs
		WHERE 1=1
	`
	args := []interface{}{}

	if toolID != "" {
		query += " AND tool_id = ?"
		args = append(args, toolID)
	}
	if languageID != "" {
		query += " AND language_id = ?"
		args = append(args, languageID)
	}

	query += " ORDER BY tool_id, language_id, display_order"

	rows, err := h.db.Query(query, args...)
	if err != nil {
		response.InternalErrorWithMessage(w, "Failed to fetch docs")
		return
	}
	defer rows.Close()

	docs := []LanguageDoc{}
	for rows.Next() {
		var d LanguageDoc
		err := rows.Scan(
			&d.ID, &d.LanguageID, &d.ToolID, &d.DocURL, &d.DocTitle,
			&d.DocSource, &d.OfficialSyntax, &d.Notes, &d.DisplayOrder,
		)
		if err != nil {
			continue
		}
		docs = append(docs, d)
	}

	response.JSON(w, http.StatusOK, docs)
}

// ============================================
// Helper: Log audit entry
// ============================================

func (h *Handler) logAudit(userID, action, resourceType, resourceID, details string) {
	h.db.Exec(`
		INSERT INTO admin_audit_log (id, user_id, action, resource_type, resource_id, details, created_at)
		VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, datetime('now'))
	`, userID, action, resourceType, resourceID, details)
}
