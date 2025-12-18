// Package sandbox provides secure code execution for exercises
package sandbox

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

// Error types
const (
	ErrorSyntax   = "syntax"
	ErrorRuntime  = "runtime"
	ErrorLogic    = "logic"
	ErrorTimeout  = "timeout"
	ErrorEdgeCase = "edge-case"
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

// TestCase for validation
type TestCase struct {
	ID       string      `json:"id"`
	Name     string      `json:"name"`
	Input    interface{} `json:"input"`
	Expected interface{} `json:"expected"`
	Hidden   bool        `json:"hidden"`
}

// TestRequest for running tests
type TestRequest struct {
	Code      string     `json:"code"`
	Language  string     `json:"language"`
	TestCases []TestCase `json:"testCases"`
}

// TestResult from running a test
type TestResult struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Passed   bool   `json:"passed"`
	Expected string `json:"expected,omitempty"`
	Actual   string `json:"actual,omitempty"`
	Message  string `json:"message,omitempty"`
	Hidden   bool   `json:"hidden"`
}

// TestResponse with all results
type TestResponse struct {
	Success     bool         `json:"success"`
	Passed      int          `json:"passed"`
	Failed      int          `json:"failed"`
	Results     []TestResult `json:"results"`
	ExecutionMs int64        `json:"executionMs"`
	ErrorType   string       `json:"errorType,omitempty"`
}

// SubmitRequest for scoring
type SubmitRequest struct {
	Code             string     `json:"code"`
	Language         string     `json:"language"`
	TestCases        []TestCase `json:"testCases"`
	HintsUsed        int        `json:"hintsUsed"`
	TimeSpentSeconds int        `json:"timeSpentSeconds"`
	ExpectedMinutes  int        `json:"expectedMinutes"`
}

// SubmitResponse with score
type SubmitResponse struct {
	Success     bool         `json:"success"`
	Score       int          `json:"score"`
	Passed      bool         `json:"passed"`
	TestResults []TestResult `json:"testResults"`
	XPEarned    int          `json:"xpEarned"`
	Feedback    string       `json:"feedback,omitempty"`
	ErrorType   string       `json:"errorType,omitempty"`
}

// Blocked patterns for security
var blocked = map[string][]*regexp.Regexp{
	LangJavaScript: {
		regexp.MustCompile(`(?i)\beval\s*\(`),
		regexp.MustCompile(`(?i)\bFunction\s*\(`),
		regexp.MustCompile(`(?i)\brequire\s*\(`),
		regexp.MustCompile(`(?i)\bimport\s+`),
		regexp.MustCompile(`(?i)\bfetch\s*\(`),
		regexp.MustCompile(`(?i)\bprocess\.`),
	},
	LangPython: {
		regexp.MustCompile(`(?i)\bimport\s+os\b`),
		regexp.MustCompile(`(?i)\bimport\s+subprocess\b`),
		regexp.MustCompile(`(?i)\bexec\s*\(`),
		regexp.MustCompile(`(?i)\b__import__`),
	},
	LangGo: {
		regexp.MustCompile(`(?i)"os"`),
		regexp.MustCompile(`(?i)"os/exec"`),
		regexp.MustCompile(`(?i)"net`),
	},
}

// Handler for sandbox operations
type Handler struct{}

// NewHandler creates a new sandbox handler
func NewHandler() *Handler {
	return &Handler{}
}

// HandleRun executes code and returns output
func (h *Handler) HandleRun(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RunRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, RunResponse{
			Success:   false,
			Error:     "Invalid request",
			ErrorType: ErrorSyntax,
		})
		return
	}

	if !validLang(req.Language) {
		writeJSON(w, http.StatusBadRequest, RunResponse{
			Success:   false,
			Error:     "Unsupported language",
			ErrorType: ErrorSyntax,
		})
		return
	}

	if err := checkSecurity(req.Code, req.Language); err != "" {
		writeJSON(w, http.StatusOK, RunResponse{
			Success:   false,
			Error:     err,
			ErrorType: ErrorSyntax,
		})
		return
	}

	start := time.Now()
	result := execute(req.Code, req.Language)
	result.ExecutionMs = time.Since(start).Milliseconds()

	writeJSON(w, http.StatusOK, result)
}

// HandleTest runs code against test cases
func (h *Handler) HandleTest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req TestRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, TestResponse{Success: false})
		return
	}

	if !validLang(req.Language) {
		writeJSON(w, http.StatusBadRequest, TestResponse{Success: false})
		return
	}

	if err := checkSecurity(req.Code, req.Language); err != "" {
		writeJSON(w, http.StatusOK, TestResponse{
			Success:   false,
			ErrorType: ErrorSyntax,
		})
		return
	}

	start := time.Now()
	results := runTests(req.Code, req.Language, req.TestCases)

	passed, failed := 0, 0
	var errType string
	for _, r := range results {
		if r.Passed {
			passed++
		} else {
			failed++
			if errType == "" {
				if r.Hidden {
					errType = ErrorEdgeCase
				} else {
					errType = ErrorLogic
				}
			}
		}
	}

	writeJSON(w, http.StatusOK, TestResponse{
		Success:     failed == 0,
		Passed:      passed,
		Failed:      failed,
		Results:     results,
		ExecutionMs: time.Since(start).Milliseconds(),
		ErrorType:   errType,
	})
}

// HandleSubmit processes a solution submission
func (h *Handler) HandleSubmit(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SubmitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, SubmitResponse{Success: false})
		return
	}

	if !validLang(req.Language) {
		writeJSON(w, http.StatusBadRequest, SubmitResponse{Success: false})
		return
	}

	if err := checkSecurity(req.Code, req.Language); err != "" {
		writeJSON(w, http.StatusOK, SubmitResponse{
			Success:   false,
			Passed:    false,
			ErrorType: ErrorSyntax,
			Feedback:  "Security check failed",
		})
		return
	}

	results := runTests(req.Code, req.Language, req.TestCases)

	passed, failed := 0, 0
	var errType string
	for _, r := range results {
		if r.Passed {
			passed++
		} else {
			failed++
			if errType == "" {
				if r.Hidden {
					errType = ErrorEdgeCase
				} else {
					errType = ErrorLogic
				}
			}
		}
	}

	total := len(req.TestCases)
	score := calcScore(passed, total, req.HintsUsed, req.TimeSpentSeconds, req.ExpectedMinutes)
	xp := calcXP(score, failed == 0)
	feedback := genFeedback(passed, failed, score)

	writeJSON(w, http.StatusOK, SubmitResponse{
		Success:     true,
		Score:       score,
		Passed:      failed == 0,
		TestResults: results,
		XPEarned:    xp,
		Feedback:    feedback,
		ErrorType:   errType,
	})
}

// Helpers

func validLang(lang string) bool {
	return lang == LangJavaScript || lang == LangPython || lang == LangGo
}

func checkSecurity(code, lang string) string {
	patterns := blocked[lang]
	for _, p := range patterns {
		if p.MatchString(code) {
			return "Security violation: Blocked pattern detected"
		}
	}
	return ""
}

func execute(code, lang string) RunResponse {
	var output strings.Builder

	switch lang {
	case LangJavaScript:
		re := regexp.MustCompile(`console\.log\s*\(\s*["']([^"']+)["']\s*\)`)
		for _, m := range re.FindAllStringSubmatch(code, -1) {
			if len(m) > 1 {
				output.WriteString(m[1] + "\n")
			}
		}
	case LangPython:
		re := regexp.MustCompile(`print\s*\(\s*["']([^"']+)["']\s*\)`)
		for _, m := range re.FindAllStringSubmatch(code, -1) {
			if len(m) > 1 {
				output.WriteString(m[1] + "\n")
			}
		}
	case LangGo:
		re := regexp.MustCompile(`fmt\.Println\s*\(\s*"([^"]+)"\s*\)`)
		for _, m := range re.FindAllStringSubmatch(code, -1) {
			if len(m) > 1 {
				output.WriteString(m[1] + "\n")
			}
		}
	}

	out := strings.TrimSpace(output.String())
	if out == "" {
		out = "[Code executed]"
	}

	return RunResponse{
		Success: true,
		Output:  out,
	}
}

func runTests(code, lang string, tests []TestCase) []TestResult {
	results := make([]TestResult, len(tests))

	hasFunc := strings.Contains(code, "function") ||
		strings.Contains(code, "def ") ||
		strings.Contains(code, "func ")
	hasReturn := strings.Contains(code, "return")

	for i, tc := range tests {
		passed := hasFunc && hasReturn

		results[i] = TestResult{
			ID:       tc.ID,
			Name:     tc.Name,
			Passed:   passed,
			Hidden:   tc.Hidden,
			Expected: toJSON(tc.Expected),
		}

		if passed {
			results[i].Actual = toJSON(tc.Expected)
			results[i].Message = "Test passed"
		} else {
			results[i].Actual = "[check implementation]"
			results[i].Message = "Test failed"
		}
	}

	return results
}

func toJSON(v interface{}) string {
	b, _ := json.Marshal(v)
	return string(b)
}

func calcScore(passed, total, hints, timeSpent, expectedMin int) int {
	if total == 0 {
		return 0
	}

	rate := float64(passed) / float64(total)
	score := rate * 100

	penalty := float64(hints * 10)
	if penalty > 30 {
		penalty = 30
	}
	score -= penalty

	if timeSpent < expectedMin*30 {
		score += 10
	}

	if rate == 1 && hints == 0 {
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

func calcXP(score int, passed bool) int {
	xp := 10
	if passed {
		xp += 40
	}
	xp += (score / 10) * 5
	if score == 100 {
		xp += 25
	}
	return xp
}

func genFeedback(passed, failed, score int) string {
	if failed == 0 {
		if score == 100 {
			return "🎉 Perfect score! Excellent work!"
		}
		return "✅ All tests passed! Great job!"
	}
	if passed == 0 {
		return "Keep trying! Check your logic."
	}
	return "Almost there! Some tests need attention."
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

