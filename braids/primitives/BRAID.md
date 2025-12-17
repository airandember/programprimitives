# PRIMITIVES Braid

## Purpose
Manages the educational content - the programming primitives themselves. This is the core product: explanations, best practices, pitfalls, and language-specific syntax for each programming concept.

## Scope
- Primitive catalog (list, filter, search)
- Primitive detail (full content)
- Language-specific syntax examples
- Best practices and pitfalls
- Category organization
- Search functionality

## Dependencies
- **External**: None
- **Internal**: 
  - core (types)
  - auth (premium access)
  - subscription (tier-gating)

## Current Status
- [ ] Database schema
- [ ] Seed data for initial primitives
- [ ] Catalog API
- [ ] Detail API
- [ ] Syntax API
- [ ] Frontend catalog page
- [ ] Frontend detail page
- [ ] Search functionality
- [ ] Premium gating

## Strands

### 1. catalog
List and filter primitives
- Query by category
- Filter by difficulty
- Search by name/description
- Premium badge indicators

### 2. detail
Individual primitive view
- Full description
- Why it matters
- Best practices
- Common pitfalls
- Related primitives
- Prerequisites

### 3. syntax
Language-specific code examples
- Syntax template
- Working example
- Line-by-line explanation
- Language variations

### 4. search
Full-text search
- Search in name, description
- Weighted results
- Category filtering

## API Endpoints

```
GET    /api/primitives                     - List all
GET    /api/primitives/categories          - List categories
GET    /api/primitives/:id                 - Get detail
GET    /api/primitives/:id/syntax/:lang    - Get syntax
GET    /api/primitives/search?q=           - Search
```

## Database Schema

### primitives
```sql
CREATE TABLE primitives (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT NOT NULL,
    why_it_matters TEXT,
    best_practices TEXT,  -- JSON array
    pitfalls TEXT,        -- JSON array
    difficulty INTEGER DEFAULT 1,
    icon TEXT,
    prerequisites TEXT,   -- JSON array of IDs
    related TEXT,         -- JSON array of IDs
    is_premium INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    category_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

### primitive_syntax
```sql
CREATE TABLE primitive_syntax (
    id TEXT PRIMARY KEY,
    primitive_id TEXT NOT NULL,
    language TEXT NOT NULL,
    syntax_template TEXT NOT NULL,
    full_example TEXT NOT NULL,
    explanation TEXT,
    variations TEXT,      -- JSON array
    expected_output TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (primitive_id) REFERENCES primitives(id),
    UNIQUE(primitive_id, language)
);
```

## Initial Primitives (Seed Data)

### Fundamentals
1. Variables
2. Data Types
3. Operators
4. Conditionals (if/else)
5. Comparison

### Loops
6. For Loop
7. While Loop
8. Do-While Loop
9. Loop Control (break/continue)

### Data Structures
10. Arrays
11. Objects/Maps
12. Strings

### Functions
13. Function Basics
14. Parameters & Arguments
15. Return Values
16. Scope
17. Higher-Order Functions

