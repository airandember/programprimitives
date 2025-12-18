# PRIMITIVES Braid

## Purpose
The content catalog - all programming primitives with explanations, syntax examples across languages, and related exercises.

## Scope
- Primitive definitions (loops, conditionals, functions, etc.)
- Multi-language syntax templates and examples
- Category organization
- Best practices and common pitfalls
- Related exercises linking

## Strands
1. **catalog** - List and filter primitives
2. **detail** - Full primitive information
3. **syntax** - Language-specific syntax examples
4. **related** - Connections between primitives

## Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/primitives` | List all primitives (with filtering) |
| `GET` | `/api/primitives/:id` | Get primitive detail |
| `GET` | `/api/primitives/:id/syntax/:lang` | Get language-specific syntax |
| `GET` | `/api/primitives/:id/exercises` | Get related exercises |

## Data Structure

### Primitive
```typescript
{
  id: string;           // "for-loop"
  name: string;         // "For Loop"
  category: string;     // "fundamentals"
  subcategory?: string; // "iteration"
  difficulty: 1-5;
  icon: string;         // emoji
  description: string;  // short summary
  whyItMatters: string; // educational context
  bestPractices: string[];
  pitfalls: string[];
  prerequisites: string[];  // other primitive ids
  related: string[];        // related primitive ids
  isPremium: boolean;
}
```

### Syntax
```typescript
{
  primitiveId: string;
  language: string;
  syntaxTemplate: string;
  fullExample: string;
  explanation: string;
  tips?: string[];
}
```

## Categories
- **fundamentals** - Variables, Conditionals, Loops, Functions
- **data-structures** - Arrays, Objects, Maps, Sets
- **iteration** - forEach, map, filter, reduce
- **control-flow** - Switch, Try/Catch, Break/Continue
- **advanced** - Recursion, Closures, Async/Await

## Current Status
- [x] Data model defined
- [x] Seed data created
- [x] Backend handlers
- [x] Frontend stores
- [x] Catalog UI
- [x] Detail page
- [ ] Search/filter
- [ ] D1 database integration

## ✅ PILOT COMPLETE (Static Data)
