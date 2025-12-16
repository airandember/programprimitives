# Exercises Braid

## Purpose
Manages all interactive coding exercises, the sandbox execution environment, and real-time code evaluation. This braid brings the primitives to life through hands-on practice.

## Scope
- Exercise definitions and content
- Multi-language sandbox execution
- Code validation and testing
- Real-time feedback and hints
- Solution verification
- Error handling and messaging
- Exercise difficulty calibration
- Template/starter code management

## Dependencies
- **External**: 
  - Secure code execution sandbox (isolated runtime)
  - Language runtimes (Python, Node.js, Go, etc.)
- **Internal**: 
  - Primitives Braid (exercise-primitive relationships)
  - Progress Braid (completion tracking)

## Current Status
- [ ] Persistence Layer
- [ ] Data Access Layer
- [ ] Business Logic Layer
- [ ] Application Layer (Sandbox)
- [ ] Frontend Integration
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **exercise-content** - Exercise definitions, instructions, tests
2. **sandbox-execution** - Secure multi-language code runner
3. **validation-engine** - Test cases and solution verification
4. **feedback-system** - Hints, error messages, suggestions
5. **code-templates** - Starter code and boilerplate

## Exercise Structure
```
exercise/
├── id
├── primitive_id      - Links to primitive being practiced
├── title
├── description       - What to accomplish
├── difficulty        - 1-5 scale
├── instructions      - Step-by-step guide
├── hints[]           - Progressive hints
├── starter_code{}    - Per-language templates
├── test_cases[]      - Validation tests
├── solution{}        - Reference solutions (hidden)
├── time_estimate     - Expected completion time
└── tags[]            - Searchable tags
```

## Sandbox Architecture
```
┌─────────────────────────────────────────┐
│           Cloudflare Worker             │
│  ┌─────────────────────────────────┐   │
│  │      Request Handler            │   │
│  └─────────────────────────────────┘   │
│              │                          │
│  ┌─────────────────────────────────┐   │
│  │    Language Router              │   │
│  └─────────────────────────────────┘   │
│      │        │        │               │
│  ┌──────┐ ┌──────┐ ┌──────┐           │
│  │Python│ │ JS   │ │ Go   │  ...      │
│  │Runner│ │Runner│ │Runner│           │
│  └──────┘ └──────┘ └──────┘           │
│              │                          │
│  ┌─────────────────────────────────┐   │
│  │    Output Sanitizer             │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Security Considerations
- Execution timeout limits (5 seconds default)
- Memory limits per execution
- No file system access
- No network access from user code
- Input sanitization
- Output size limits

## API Endpoints (Planned)
```
GET    /api/exercises                     - List exercises
GET    /api/exercises/:id                 - Get exercise details
GET    /api/exercises/primitive/:pid      - Exercises for a primitive
POST   /api/exercises/:id/run             - Execute user code
POST   /api/exercises/:id/submit          - Submit solution
GET    /api/exercises/:id/hints/:level    - Get progressive hint
```

