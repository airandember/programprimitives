# SANDBOX Braid

## Purpose
Provides secure code execution for user-submitted code. This is the engine that runs exercises and validates solutions.

## Scope
- Secure code execution
- Multi-language runtime support
- Resource limiting (time, memory)
- Input/output handling
- Error capture and formatting

## Dependencies
- **External**: 
  - Cloudflare Workers (execution environment)
  - Language runtimes (QuickJS for JS, Pyodide for Python, etc.)
- **Internal**: 
  - core (types)
  - exercises (test cases)

## Current Status
- [ ] JavaScript runner (QuickJS)
- [ ] Python runner (Pyodide)
- [ ] Go runner (Phase 2)
- [ ] Security sandbox
- [ ] Resource limits
- [ ] Output parsing
- [ ] Error formatting
- [ ] API endpoints

## Strands

### 1. runner
Code execution engine
- Language-specific runtime
- Timeout handling
- Memory limits
- Output capture

### 2. security
Sandbox isolation
- Block network access
- Block file system
- Block dangerous APIs
- Input sanitization

### 3. languages
Runtime configuration
- JavaScript (QuickJS in Workers)
- Python (Pyodide WASM)
- Go (TinyGo WASM - Phase 2)

### 4. output
Result handling
- stdout/stderr capture
- Error formatting
- Execution time
- Memory usage

## API Endpoints

```
POST   /api/sandbox/run            - Execute code
GET    /api/sandbox/languages      - Available languages
GET    /api/sandbox/status         - Health check
```

## Execution Flow

```
User Code
    │
    ▼
┌───────────────┐
│  Validation   │  - Check syntax
│               │  - Check length
│               │  - Sanitize input
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Runtime     │  - QuickJS (JS)
│   Selection   │  - Pyodide (Python)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Sandbox     │  - Isolated VM
│   Execution   │  - Resource limits
│               │  - Timeout: 5s
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Test Case   │  - Run against inputs
│   Validation  │  - Compare outputs
└───────┬───────┘
        │
        ▼
    Results
```

## Security Constraints

```javascript
// Blocked APIs (JavaScript)
const BLOCKED = [
    'fetch',
    'XMLHttpRequest',
    'WebSocket',
    'eval',
    'Function',
    'require',
    'import',
    'process',
    '__dirname',
    '__filename'
];

// Resource Limits
const LIMITS = {
    timeout_ms: 5000,
    memory_mb: 64,
    output_bytes: 65536,
    stack_size_kb: 256
};
```

## Request/Response

### Run Code Request
```typescript
interface RunCodeRequest {
    exerciseId?: string;     // Optional, for tracking
    language: Language;
    code: string;
    input?: string;          // stdin
}
```

### Run Code Response
```typescript
interface RunCodeResponse {
    success: boolean;
    output: string;          // stdout
    error?: string;          // stderr or error message
    executionTimeMs: number;
    memoryUsedKb?: number;
}
```

### Validate Solution Request
```typescript
interface ValidateRequest {
    exerciseId: string;
    language: Language;
    code: string;
}
```

### Validate Solution Response
```typescript
interface ValidateResponse {
    passed: boolean;
    score: number;
    testResults: {
        testId: string;
        name: string;
        passed: boolean;
        expected?: string;
        actual?: string;
        error?: string;
        timeMs: number;
    }[];
}
```

