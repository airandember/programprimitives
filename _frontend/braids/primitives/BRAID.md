# Primitives Braid (Frontend)

## Purpose
Displays and navigates programming primitives content. Provides the learning interface for understanding concepts before practicing them.

## Scope
- Primitive catalog browsing
- Category navigation
- Primitive detail pages
- Language syntax switcher
- Related primitives navigation
- Search and filtering
- Progress indicators per primitive

## Dependencies
- **External**: Syntax highlighting library (Shiki/Prism)
- **Internal (Backend)**: Primitives Braid API
- **Internal (Frontend)**: Progress Braid (mastery indicators)

## Current Status
- [ ] Presentation Layer
- [ ] Application Layer
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **primitive-catalog** - Browse all primitives
2. **primitive-detail** - Individual primitive page
3. **language-switcher** - Switch syntax examples
4. **category-navigation** - Navigate by category
5. **search** - Search primitives

## Pages & Routes
```
/learn                      - Primitives catalog home
/learn/category/:category   - Category view
/learn/:primitive           - Primitive detail page
/learn/:primitive/:language - Language-specific view
```

## Components
```
src/lib/components/primitives/
├── PrimitiveCatalog.svelte    - Grid of all primitives
├── PrimitiveCard.svelte       - Card in catalog
├── PrimitiveDetail.svelte     - Full primitive view
├── CategoryNav.svelte         - Category sidebar
├── LanguageSwitcher.svelte    - Language tabs
├── SyntaxDisplay.svelte       - Code with highlighting
├── RelatedPrimitives.svelte   - Related links
├── MasteryBadge.svelte        - Progress indicator
└── BestPractices.svelte       - Do's and Don'ts
```

## State Management
```typescript
// src/lib/stores/primitives.ts
export const primitives = writable<Primitive[]>([]);
export const currentPrimitive = writable<Primitive | null>(null);
export const selectedLanguage = writable<string>('javascript');
export const categories = writable<Category[]>([]);

// Derived
export const primitivesByCategory = derived(...);
export const currentSyntax = derived(...);
```

## UI/UX Guidelines
- Visual category icons (loop icon, function icon, etc.)
- Mastery level shown on each primitive card
- Smooth language switching with code animation
- "Start Practice" CTA prominently placed
- Breadcrumb navigation
- Mobile-friendly card grid
- Syntax highlighting matching user's preferred theme

