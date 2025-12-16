# Primitives Table Schema

## Purpose
Stores programming primitive definitions, their educational content, and metadata.

## Table Definition

```sql
CREATE TABLE primitives (
    id TEXT PRIMARY KEY,                    -- Slug identifier (e.g., 'for-loop')
    
    -- Basic Info
    name TEXT NOT NULL,                     -- Display name ('For Loop')
    category TEXT NOT NULL,                 -- 'fundamentals', 'data-structures', etc.
    subcategory TEXT,                       -- 'loops', 'arrays', etc.
    
    -- Content
    description TEXT NOT NULL,              -- Brief description
    why_it_matters TEXT NOT NULL,           -- Real-world importance
    best_practices TEXT,                    -- JSON array of do's
    pitfalls TEXT,                          -- JSON array of don'ts
    
    -- Metadata
    difficulty INTEGER DEFAULT 1,           -- 1-5 base difficulty
    prerequisites TEXT,                     -- JSON array of primitive IDs
    related TEXT,                           -- JSON array of related primitive IDs
    icon TEXT,                              -- Icon identifier or URL
    
    -- Ordering
    category_order INTEGER DEFAULT 0,       -- Order within category
    
    -- Status
    is_premium INTEGER DEFAULT 0,           -- Requires paid subscription
    is_published INTEGER DEFAULT 1,         -- Visible to users
    
    -- Timestamps
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Indexes
CREATE INDEX idx_primitives_category ON primitives(category);
CREATE INDEX idx_primitives_premium ON primitives(is_premium);
CREATE INDEX idx_primitives_published ON primitives(is_published);
```

## Primitive Syntax Table

```sql
CREATE TABLE primitive_syntax (
    id TEXT PRIMARY KEY,                    -- UUID
    primitive_id TEXT NOT NULL,             -- Foreign key to primitives
    language TEXT NOT NULL,                 -- 'javascript', 'python', etc.
    
    -- Syntax Content
    syntax_template TEXT NOT NULL,          -- Basic syntax pattern
    full_example TEXT NOT NULL,             -- Complete working example
    explanation TEXT,                       -- Line-by-line explanation
    
    -- Variations
    variations TEXT,                        -- JSON array of syntax variations
    
    -- Metadata
    is_primary INTEGER DEFAULT 1,           -- Main syntax vs alternative
    
    -- Timestamps
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    
    -- Constraints
    FOREIGN KEY (primitive_id) REFERENCES primitives(id) ON DELETE CASCADE,
    UNIQUE(primitive_id, language, is_primary)
);

-- Indexes
CREATE INDEX idx_syntax_primitive ON primitive_syntax(primitive_id);
CREATE INDEX idx_syntax_language ON primitive_syntax(language);
```

## Categories

| Category | Subcategories |
|----------|---------------|
| `fundamentals` | variables, operators, conditionals, loops |
| `data-structures` | arrays, objects, sets, stacks, trees |
| `functions` | declaration, parameters, returns, closures, recursion |
| `advanced` | errors, async, iterators, classes, modules, concurrency |

## Example Data

```json
{
  "id": "for-loop",
  "name": "For Loop",
  "category": "fundamentals",
  "subcategory": "loops",
  "description": "Executes a block of code a specific number of times",
  "why_it_matters": "For loops are essential for processing collections, repeating operations, and iterating through data. They're one of the most frequently used constructs in programming.",
  "best_practices": [
    "Use meaningful iterator variable names (i, j for indices; item for elements)",
    "Avoid modifying the loop variable inside the loop body",
    "Consider using forEach or map for array iteration in modern code",
    "Keep loop bodies focused on a single responsibility"
  ],
  "pitfalls": [
    "Off-by-one errors (starting at 1 instead of 0, or using <= instead of <)",
    "Infinite loops when condition never becomes false",
    "Modifying array length while iterating",
    "Using var instead of let in JavaScript (scope issues)"
  ],
  "difficulty": 2,
  "prerequisites": ["variables", "operators", "conditionals"],
  "related": ["while-loop", "foreach", "array-iteration"],
  "icon": "loop-icon",
  "is_premium": 0,
  "is_published": 1
}
```

## Notes

- Primitive IDs are URL-safe slugs, not UUIDs
- Content fields (best_practices, pitfalls) store JSON arrays
- Prerequisites define learning order
- is_premium determines free vs paid access
- category_order allows custom sorting within categories

