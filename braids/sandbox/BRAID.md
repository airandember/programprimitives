# SANDBOX Braid

## Purpose
Secure code execution engine that runs user-submitted code in isolated environments, validates solutions against test cases, and returns results.

## Core Philosophy
> **Execute safely, validate thoroughly, respond quickly.**
> 
> User code is untrusted. We sandbox everything, enforce timeouts, limit resources, and never trust output until validated.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      SANDBOX SERVICE                        │
├─────────────────────────────────────────────────────────────┤
│  Request → Validate → Execute → Test → Score → Response     │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Input   │→ │ Runner  │→ │ Tester  │→ │ Scorer  │        │
│  │ Sanity  │  │ JS/Py/Go│  │ Compare │  │ Points  │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Scope
- Code execution in multiple languages (JS, Python, Go)
- Secure sandboxing with resource limits
- Test case validation
- Output capture (stdout, stderr)
- Timeout enforcement
- Error detection and categorization
- Score calculation

## Security Model

### Execution Constraints
| Constraint | Limit | Reason |
|------------|-------|--------|
| Timeout | 5 seconds | Prevent infinite loops |
| Memory | 128 MB | Prevent memory bombs |
| Output | 10 KB | Prevent log floods |
| Network | Disabled | Prevent exfiltration |
| Filesystem | Disabled | Prevent persistence |
| Subprocess | Disabled | Prevent escape |

### Code Sanitization
- No `eval()` or `exec()` with user input
- No `import os`, `subprocess`, `sys.exit()`
- No network APIs (`fetch`, `requests`, `http`)
- No file system APIs (`fs`, `open()`, `os.path`)

## Supported Languages

### JavaScript (Node.js style)
```javascript
// Allowed: console.log, Math, Array, Object, String, etc.
// Blocked: require, import, fetch, process, fs
```

### Python
```python
# Allowed: print, len, range, list, dict, str, math
# Blocked: import os, subprocess, open, exec, eval
```

### Go
```go
// Allowed: fmt, math, strings, strconv
// Blocked: os, net, io/ioutil, exec
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sandbox/run` | Execute code, return output |
| `POST` | `/api/sandbox/test` | Run code against test cases |
| `POST` | `/api/sandbox/submit` | Submit for scoring |

## Request/Response Types

### Run Code
```typescript
// POST /api/sandbox/run
interface RunRequest {
  code: string;
  language: 'javascript' | 'python' | 'go';
  input?: string;  // stdin input
}

interface RunResponse {
  success: boolean;
  output: string;    // stdout
  error?: string;    // stderr or runtime error
  executionMs: number;
}
```

### Test Code
```typescript
// POST /api/sandbox/test
interface TestRequest {
  code: string;
  language: 'javascript' | 'python' | 'go';
  exerciseId: string;
}

interface TestResponse {
  success: boolean;
  passed: number;
  failed: number;
  results: TestResult[];
  executionMs: number;
}

interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  message?: string;
}
```

### Submit Solution
```typescript
// POST /api/sandbox/submit
interface SubmitRequest {
  code: string;
  language: 'javascript' | 'python' | 'go';
  exerciseId: string;
  hintsUsed: number;
  timeSpentSeconds: number;
}

interface SubmitResponse {
  success: boolean;
  score: number;        // 0-100
  passed: boolean;
  testResults: TestResult[];
  xpEarned: number;
  achievements?: string[];  // Newly unlocked
  feedback?: string;    // AI-generated feedback
}
```

## Execution Strategies

### Strategy 1: Client-Side Execution (Current)
For JavaScript, we can execute directly in the browser using Web Workers with strict CSP:

```typescript
// Browser-based JS execution
const worker = new Worker('sandbox-worker.js');
worker.postMessage({ code, input });
worker.onmessage = (e) => handleResult(e.data);
setTimeout(() => worker.terminate(), 5000);
```

**Pros**: No server cost, instant feedback
**Cons**: Only JS, can't fully sandbox

### Strategy 2: WASM Interpreters
Use WebAssembly-compiled interpreters:
- **Pyodide** for Python
- **GopherJS** for Go

**Pros**: Runs in browser securely
**Cons**: Large bundle size, some limitations

### Strategy 3: Backend Execution Service
Dedicated execution service (future):
- **Piston API** (open source)
- **Judge0** (hosted service)
- **Custom Docker containers**

**Pros**: Full language support, real execution
**Cons**: Cost, latency, infrastructure

## Current Implementation

### Phase 1: Simulated Execution ✅
- Parse code and detect common patterns
- Match against expected outputs
- Provide realistic-looking results
- Good for MVP and demo

### Phase 2: Client-Side JS ✅
- Real JavaScript execution in Web Workers
- Sandboxed with CSP
- Actual test validation

### Phase 3: WASM Python (Planned)
- Integrate Pyodide
- Real Python execution
- Memory-limited

### Phase 4: Backend Service (Future)
- Deploy Piston/Judge0
- Real multi-language execution
- Full test suite support

## Test Case Format

```typescript
interface TestCase {
  id: string;
  name: string;
  input: any;           // Function arguments or stdin
  expected: any;        // Expected return value or stdout
  hidden: boolean;      // Don't show to user
  timeout: number;      // ms, default 1000
  validator?: string;   // Custom validation function
}
```

## Scoring Algorithm

```typescript
function calculateScore(params: {
  testsPassed: number;
  totalTests: number;
  hintsUsed: number;
  timeSpentSeconds: number;
  expectedMinutes: number;
}): number {
  // Base score from test pass rate
  const passRate = testsPassed / totalTests;
  let score = passRate * 100;
  
  // Hint penalty: -10% per hint, max -30%
  const hintPenalty = Math.min(hintsUsed * 10, 30);
  score -= hintPenalty;
  
  // Time bonus: +10% if under expected time
  const expectedSeconds = expectedMinutes * 60;
  if (timeSpentSeconds < expectedSeconds * 0.5) {
    score += 10;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}
```

## Error Detection

Categorize errors to help progress tracking:

| Error Type | Detection | Example |
|------------|-----------|---------|
| `syntax` | Parse error | `SyntaxError: Unexpected token` |
| `logic` | Wrong output | Expected 5, got 4 (off-by-one) |
| `runtime` | Exception | `TypeError: undefined is not a function` |
| `timeout` | Exceeded limit | Execution time > 5000ms |
| `edge-case` | Hidden test fail | Empty array handling |

## Current Status
- [x] BRAID documentation
- [x] Type definitions
- [x] Sandbox worker (client-side JS)
- [x] Test runner logic
- [x] Score calculation
- [x] Error categorization
- [x] Frontend integration
- [ ] Python WASM (Pyodide)
- [ ] Backend execution service
- [ ] Rate limiting

## ✅ PILOT COMPLETE (Client-Side JS)
