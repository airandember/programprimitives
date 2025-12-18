// Package handlers provides HTTP handlers for sandbox code execution
package handlers

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strings"
	"time"
)

// Supported languages
const (
	LangJavaScript = "javascript"
	LangPython     = "python"
	LangGo         = "go"
)

// Error types for categorization
const (
	ErrorTypeSyntax   = "syntax"
	ErrorTypeRuntime  = "runtime"
	ErrorTypeLogic    = "logic"
	ErrorTypeTimeout  = "timeout"
	ErrorTypeEdgeCase = "edge-case"
)

// RunRequest represents a code execution request
type RunRequest struct {
	Code     string `json:"code"`
	Language string `json:"language"`
	Input    string `json:"input,omitempty"`
}

// RunResponse represents code execution result
type RunResponse struct {
	Success     bool   `json:"success"`
	Output      string `json:"output"`
	Error       string `json:"error,omitempty"`
	ErrorType   string `json:"errorType,omitempty"`
	ExecutionMs int64  `json:"executionMs"`
}

// TestCase represents a single test case
type TestCase struct {
	ID       string      `json:"id"`
	Name     string      `json:"name"`
	Input    interface{} `json:"input"`
	Expected interface{} `json:"expected"`
	Hidden   bool        `json:"hidden"`
	Timeout  int         `json:"timeout,omitempty"`
}

// TestRequest represents a test execution request
type TestRequest struct {
	Code       string     `json:"code"`
	Language   string     `json:"language"`
	ExerciseID string     `json:"exerciseId"`
	TestCases  []TestCase `json:"testCases,omitempty"`
}

// TestResult represents a single test result
type TestResult struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Passed   bool   `json:"passed"`
	Expected string `json:"expected,omitempty"`
	Actual   string `json:"actual,omitempty"`
	Message  string `json:"message,omitempty"`
	Hidden   bool   `json:"hidden"`
}

// TestResponse represents test suite results
type TestResponse struct {
	Success     bool         `json:"success"`
	Passed      int          `json:"passed"`
	Failed      int          `json:"failed"`
	Results     []TestResult `json:"results"`
	ExecutionMs int64        `json:"executionMs"`
	ErrorType   string       `json:"errorType,omitempty"`
}

// SubmitRequest represents a solution submission
type SubmitRequest struct {
	Code             string     `json:"code"`
	Language         string     `json:"language"`
	ExerciseID       string     `json:"exerciseId"`
	TestCases        []TestCase `json:"testCases,omitempty"`
	HintsUsed        int        `json:"hintsUsed"`
	TimeSpentSeconds int        `json:"timeSpentSeconds"`
	ExpectedMinutes  int        `json:"expectedMinutes"`
}

// SubmitResponse represents submission result
type SubmitResponse struct {
	Success      bool         `json:"success"`
	Score        int          `json:"score"`
	Passed       bool         `json:"passed"`
	TestResults  []TestResult `json:"testResults"`
	XPEarned     int          `json:"xpEarned"`
	Achievements []string     `json:"achievements,omitempty"`
	Feedback     string       `json:"feedback,omitempty"`
	ErrorType    string       `json:"errorType,omitempty"`
}

// Blocked patterns for security
var blockedPatterns = map[string][]*regexp.Regexp{
	LangJavaScript: {
		regexp.MustCompile(`(?i)\beval\s*\(`),
		regexp.MustCompile(`(?i)\bFunction\s*\(`),
		regexp.MustCompile(`(?i)\brequire\s*\(`),
		regexp.MustCompile(`(?i)\bimport\s+`),
		regexp.MustCompile(`(?i)\bfetch\s*\(`),
		regexp.MustCompile(`(?i)\bXMLHttpRequest`),
		regexp.MustCompile(`(?i)\bprocess\.`),
	},
	LangPython: {
		regexp.MustCompile(`(?i)\bimport\s+os\b`),
		regexp.MustCompile(`(?i)\bimport\s+subprocess\b`),
		regexp.MustCompile(`(?i)\bimport\s+sys\b`),
		regexp.MustCompile(`(?i)\bfrom\s+os\b`),
		regexp.MustCompile(`(?i)\bexec\s*\(`),
		regexp.MustCompile(`(?i)\beval\s*\(`),
		regexp.MustCompile(`(?i)\bopen\s*\(`),
		regexp.MustCompile(`(?i)\b__import__`),
	},
	LangGo: {
		regexp.MustCompile(`(?i)\bimport\s+"os"`),
		regexp.MustCompile(`(?i)\bimport\s+"net`),
		regexp.MustCompile(`(?i)\bimport\s+"os/exec"`),
		regexp.MustCompile(`(?i)\bimport\s+"io/ioutil"`),
	},
}

// SandboxHandler handles sandbox-related requests
type SandboxHandler struct{}

// NewSandboxHandler creates a new sandbox handler
func NewSandboxHandler() *SandboxHandler {
	return &SandboxHandler{}
}

// HandleRun executes code and returns output
func (h *SandboxHandler) HandleRun(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RunRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, RunResponse{
			Success:   false,
			Error:     "Invalid request body",
			ErrorType: ErrorTypeSyntax,
		})
		return
	}

	// Validate language
	if !isValidLanguage(req.Language) {
		writeJSON(w, http.StatusBadRequest, RunResponse{
			Success:   false,
			Error:     "Unsupported language",
			ErrorType: ErrorTypeSyntax,
		})
		return
	}

	// Security check
	if err := checkSecurity(req.Code, req.Language); err != "" {
		writeJSON(w, http.StatusOK, RunResponse{
			Success:   false,
			Error:     err,
			ErrorType: ErrorTypeSyntax,
		})
		return
	}

	// Execute code (simulated for now)
	startTime := time.Now()
	result := simulateExecution(req.Code, req.Language, req.Input)
	result.ExecutionMs = time.Since(startTime).Milliseconds()

	writeJSON(w, http.StatusOK, result)
}

// HandleTest runs code against test cases
func (h *SandboxHandler) HandleTest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req TestRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, TestResponse{
			Success:   false,
			ErrorType: ErrorTypeSyntax,
		})
		return
	}

	// Validate
	if !isValidLanguage(req.Language) {
		writeJSON(w, http.StatusBadRequest, TestResponse{
			Success:   false,
			ErrorType: ErrorTypeSyntax,
		})
		return
	}

	// Security check
	if err := checkSecurity(req.Code, req.Language); err != "" {
		writeJSON(w, http.StatusOK, TestResponse{
			Success:   false,
			ErrorType: ErrorTypeSyntax,
		})
		return
	}

	// Run tests
	startTime := time.Now()
	results := runTests(req.Code, req.Language, req.TestCases)
	
	passed := 0
	failed := 0
	var errorType string
	
	for _, r := range results {
		if r.Passed {
			passed++
		} else {
			failed++
			if errorType == "" {
				if r.Hidden {
					errorType = ErrorTypeEdgeCase
				} else {
					errorType = ErrorTypeLogic
				}
			}
		}
	}

	writeJSON(w, http.StatusOK, TestResponse{
		Success:     failed == 0,
		Passed:      passed,
		Failed:      failed,
		Results:     results,
		ExecutionMs: time.Since(startTime).Milliseconds(),
		ErrorType:   errorType,
	})
}

// HandleSubmit processes a solution submission
func (h *SandboxHandler) HandleSubmit(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SubmitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, SubmitResponse{
			Success: false,
		})
		return
	}

	// Validate
	if !isValidLanguage(req.Language) {
		writeJSON(w, http.StatusBadRequest, SubmitResponse{
			Success: false,
		})
		return
	}

	// Security check
	if err := checkSecurity(req.Code, req.Language); err != "" {
		writeJSON(w, http.StatusOK, SubmitResponse{
			Success:   false,
			Score:     0,
			Passed:    false,
			ErrorType: ErrorTypeSyntax,
			Feedback:  "Security check failed",
		})
		return
	}

	// Run tests
	results := runTests(req.Code, req.Language, req.TestCases)
	
	passed := 0
	failed := 0
	var errorType string
	
	for _, r := range results {
		if r.Passed {
			passed++
		} else {
			failed++
			if errorType == "" {
				if r.Hidden {
					errorType = ErrorTypeEdgeCase
				} else {
					errorType = ErrorTypeLogic
				}
			}
		}
	}

	// Calculate score
	score := calculateScore(passed, len(req.TestCases), req.HintsUsed, req.TimeSpentSeconds, req.ExpectedMinutes)
	
	// Calculate XP
	xp := calculateXP(score, failed == 0)
	
	// Generate feedback
	feedback := generateFeedback(passed, failed, score)

	writeJSON(w, http.StatusOK, SubmitResponse{
		Success:     true,
		Score:       score,
		Passed:      failed == 0,
		TestResults: results,
		XPEarned:    xp,
		Feedback:    feedback,
		ErrorType:   errorType,
	})
}

// Helper functions

func isValidLanguage(lang string) bool {
	return lang == LangJavaScript || lang == LangPython || lang == LangGo
}

func checkSecurity(code, language string) string {
	patterns, ok := blockedPatterns[language]
	if !ok {
		return ""
	}

	for _, pattern := range patterns {
		if pattern.MatchString(code) {
			return "Security violation: Blocked pattern detected"
		}
	}

	return ""
}

func simulateExecution(code, language, input string) RunResponse {
	// Simulated execution - in production, this would use actual runners
	var output string

	switch language {
	case LangJavaScript:
		// Look for console.log
		re := regexp.MustCompile(`console\.log\s*\(\s*["']([^"']+)["']\s*\)`)
		matches := re.FindAllStringSubmatch(code, -1)
		for _, m := range matches {
			if len(m) > 1 {
				output += m[1] + "\n"
			}
		}
	case LangPython:
		// Look for print
		re := regexp.MustCompile(`print\s*\(\s*["']([^"']+)["']\s*\)`)
		matches := re.FindAllStringSubmatch(code, -1)
		for _, m := range matches {
			if len(m) > 1 {
				output += m[1] + "\n"
			}
		}
	case LangGo:
		// Look for fmt.Println
		re := regexp.MustCompile(`fmt\.Println\s*\(\s*"([^"]+)"\s*\)`)
		matches := re.FindAllStringSubmatch(code, -1)
		for _, m := range matches {
			if len(m) > 1 {
				output += m[1] + "\n"
			}
		}
	}

	if output == "" {
		output = "[Code executed successfully]\n"
	}

	return RunResponse{
		Success: true,
		Output:  strings.TrimSpace(output),
	}
}

func runTests(code, language string, testCases []TestCase) []TestResult {
	results := make([]TestResult, len(testCases))

	for i, tc := range testCases {
		// Simulated test execution
		// In production, this would actually run the code
		
		// Simple heuristic for demo
		hasFunction := strings.Contains(code, "function") || 
		               strings.Contains(code, "def ") || 
		               strings.Contains(code, "func ")
		hasReturn := strings.Contains(code, "return")
		
		passed := hasFunction && hasReturn
		
		results[i] = TestResult{
			ID:       tc.ID,
			Name:     tc.Name,
			Passed:   passed,
			Hidden:   tc.Hidden,
			Expected: formatValue(tc.Expected),
			Actual:   formatValue(tc.Expected), // Simulated
			Message:  "Test executed",
		}
		
		if !passed {
			results[i].Message = "Test failed - check your implementation"
			results[i].Actual = "[simulated output]"
		}
	}

	return results
}

func formatValue(v interface{}) string {
	b, _ := json.Marshal(v)
	return string(b)
}

func calculateScore(passed, total, hints, timeSpent, expectedMinutes int) int {
	if total == 0 {
		return 0
	}

	// Base score from pass rate
	passRate := float64(passed) / float64(total)
	score := passRate * 100

	// Hint penalty
	hintPenalty := float64(hints * 10)
	if hintPenalty > 30 {
		hintPenalty = 30
	}
	score -= hintPenalty

	// Time bonus
	expectedSeconds := expectedMinutes * 60
	if timeSpent < expectedSeconds/2 {
		score += 10
	}

	// Perfect bonus
	if passRate == 1 && hints == 0 {
		score += 5
	}

	if score < 0 {
		score = 0
	}
	if score > 100 {
		score = 100
	}

	return int(score)
}

func calculateXP(score int, passed bool) int {
	xp := 10 // Base XP

	if passed {
		xp += 40
	}

	xp += (score / 10) * 5

	if score == 100 {
		xp += 25
	}

	return xp
}

func generateFeedback(passed, failed, score int) string {
	if failed == 0 {
		if score == 100 {
			return "🎉 Perfect score! Excellent work!"
		}
		return "✅ All tests passed! Great job!"
	}

	if passed == 0 {
		return "Keep trying! Check your logic and try again."
	}

	return "Almost there! Some tests need attention."
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

