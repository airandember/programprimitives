# Primitives Braid

## Purpose
The heart of ProgramPrimitives.com - this braid manages all programming primitive content, their definitions, explanations, and cross-language implementations. It's the educational content engine that powers the "tool-first, language-second" approach.

## Scope
- Primitive definitions and taxonomies
- Educational content for each primitive
- Cross-language syntax mappings
- Difficulty progression system
- Best practices and anti-patterns
- Related primitive linking
- Content versioning and updates

## Primitive Categories
```
FUNDAMENTALS
├── Variables & Data Types
├── Operators (arithmetic, logical, comparison)
├── Conditionals (if/else, switch/match)
└── Loops (for, while, do-while, foreach)

DATA STRUCTURES
├── Arrays & Lists
├── Objects & Dictionaries/Maps
├── Sets
├── Stacks & Queues
└── Trees & Graphs (advanced)

FUNCTIONS & MODULARITY
├── Function Declaration & Invocation
├── Parameters & Arguments
├── Return Values
├── Scope & Closures
├── Higher-Order Functions
└── Recursion

ADVANCED CONSTRUCTS
├── Error Handling (try/catch)
├── Asynchronous Programming
├── Iterators & Generators
├── Classes & OOP Basics
├── Modules & Imports
└── Concurrency Primitives
```

## Dependencies
- **External**: None
- **Internal**: None (foundational content braid)

## Current Status
- [ ] Persistence Layer (primitive schema)
- [ ] Data Access Layer (content retrieval)
- [ ] Business Logic Layer (difficulty progression)
- [ ] Application Layer (content API)
- [ ] Frontend Integration
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **primitive-definitions** - Core primitive content and explanations
2. **language-mappings** - Syntax for each language per primitive
3. **difficulty-progression** - Ordering and prerequisite logic
4. **best-practices** - Do's and Don'ts for each primitive
5. **related-linking** - Cross-references between primitives

## Supported Languages (Initial Set)
- Python
- JavaScript
- HTML/CSS
- Go
- C++
- Node.js
- TypeScript

## Content Structure (per Primitive)
```
primitive/
├── definition      - What is it?
├── why_it_matters  - Real-world importance
├── syntax/         - Language-specific implementations
│   ├── python
│   ├── javascript
│   ├── go
│   └── ...
├── examples/       - Working code examples
├── pitfalls        - Common mistakes to avoid
├── best_practices  - Industry standards
├── related         - Links to related primitives
└── exercises       - Reference to exercise IDs
```

## API Endpoints (Planned)
```
GET    /api/primitives                    - List all primitives
GET    /api/primitives/:id                - Get primitive details
GET    /api/primitives/:id/syntax/:lang   - Get language-specific syntax
GET    /api/primitives/category/:cat      - Get primitives by category
GET    /api/primitives/:id/related        - Get related primitives
GET    /api/languages                     - List supported languages
```

