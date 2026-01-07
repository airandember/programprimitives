-- Complete Lesson Content Migration
-- Full three-phase lessons for all tools with visual elements
-- Each lesson is a page, sequentially unlocked
-- Admin-editable through lesson content management

-- ============================================
-- ADD ADMIN EDIT TRACKING TO LESSONS
-- ============================================

ALTER TABLE lessons ADD COLUMN last_edited_by TEXT;
ALTER TABLE lessons ADD COLUMN last_edited_at TEXT;
ALTER TABLE lessons ADD COLUMN version INTEGER DEFAULT 1;

-- Visual element JSON for lesson pages
ALTER TABLE lessons ADD COLUMN visual_elements TEXT; -- JSON: { "type": "animation|diagram|code", "data": {...} }

-- ============================================
-- CLEAR EXISTING LESSONS FOR FRESH START
-- ============================================

DELETE FROM lessons;

-- ============================================
-- VARIABLES: 📦 Container Tool (Tier 1 - Stone)
-- 12 Total Lessons: 4 Blueprint, 5 Crafting, 3 Mastery
-- ============================================

-- BLUEPRINT PHASE: Understanding containers
INSERT INTO lessons (id, tool_id, slug, title, description, phase, phase_order, sequence_order, metaphor_progress, content_markdown, visual_elements, estimated_minutes, difficulty_modifier, is_premium, is_published, created_at, updated_at)
VALUES
('var-b1', 'variables', 'why-store-data', 'Why Store Data?', 'Understanding the need for memory in programs', 'blueprint', 1, 1, 'Drawing the box outline',
'# Why Store Data?

Imagine you''re a chef following a recipe. You need to remember:
- How many eggs you''ve cracked
- The current temperature of the oven
- Whether the timer has gone off

Without memory, you''d have to start over every single step. **Variables are a program''s memory.**

## The Problem Without Variables

```
print(5 + 3)       // OK, but what if we need this result later?
print(5 + 3)       // We have to recalculate!
print((5 + 3) * 2) // And again...
```

## The Solution: Store Once, Use Anywhere

```
result = 5 + 3     // Calculate once
print(result)      // Use it
print(result)      // Use it again
print(result * 2)  // Use it in new calculations
```

## The Container Mental Model

Think of a variable as a **labeled box**:
- The **label** is the variable name
- The **contents** are the value
- You can **look inside** (read) or **replace contents** (write)

> **Key Insight:** Variables let us work with values we don''t know yet—like user input or calculation results.',
'{"type": "animation", "id": "container-intro", "frames": ["empty-box", "box-with-label", "box-with-value"]}',
8, 0, 0, 1, datetime('now'), datetime('now')),

('var-b2', 'variables', 'anatomy-of-variable', 'Anatomy of a Variable', 'The four parts: name, value, type, scope', 'blueprint', 2, 2, 'Adding the label slot',
'# Anatomy of a Variable

Every variable has four essential parts:

## 1. Name (The Label)
What you call the variable. This is how you refer to it later.
```
age        ← The name
userName   ← The name
totalPrice ← The name
```

## 2. Value (The Contents)
The actual data stored inside.
```
age = 25           ← 25 is the value
userName = "Alex"  ← "Alex" is the value
```

## 3. Type (What Kind of Contents)
The category of data: number, text, true/false, etc.
```
25      → Number
"Alex"  → String (text)
true    → Boolean
```

## 4. Scope (Where It Exists)
Which parts of your program can see this variable.
```
┌─────────────────────────┐
│ Global Scope            │  ← Visible everywhere
│  ┌──────────────────┐   │
│  │ Function Scope   │   │  ← Only visible inside function
│  │  ┌────────────┐  │   │
│  │  │ Block Scope│  │   │  ← Only visible inside block
│  │  └────────────┘  │   │
│  └──────────────────┘   │
└─────────────────────────┘
```

> **Key Insight:** Understanding these four parts helps you predict how variables behave.',
'{"type": "diagram", "id": "variable-anatomy", "parts": ["name", "value", "type", "scope"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('var-b3', 'variables', 'value-vs-reference', 'Values vs References', 'How data is stored in memory', 'blueprint', 3, 3, 'Designing the storage mechanism',
'# Values vs References

Not all variables store data the same way.

## Value Types (Primitives)
The variable **contains** the actual value.
```
┌─────────┐
│ age     │
│ ┌─────┐ │
│ │ 25  │ │  ← The actual number 25 is in the box
│ └─────┘ │
└─────────┘
```

Copying creates a **completely separate** copy:
```
a = 25
b = a      // b gets its own 25
a = 30     // Only a changes
// a = 30, b = 25
```

## Reference Types (Objects, Arrays)
The variable **points to** data stored elsewhere.
```
┌─────────┐       ┌─────────────┐
│ user    │       │   Memory    │
│ ┌─────┐ │       │ ┌─────────┐ │
│ │  ●──┼─┼───────┼→│ {name}  │ │
│ └─────┘ │       │ └─────────┘ │
└─────────┘       └─────────────┘
```

Copying creates **another arrow to the same data**:
```
user1 = {name: "Alex"}
user2 = user1        // Same object!
user1.name = "Sam"   
// Both user1.name and user2.name are "Sam"!
```

> **Key Insight:** Know whether you''re copying the value or sharing a reference.',
'{"type": "animation", "id": "value-vs-reference", "scenes": ["primitive-copy", "reference-copy"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('var-b4', 'variables', 'mutability-concept', 'Mutability: Can It Change?', 'Understanding when values can be modified', 'blueprint', 4, 4, 'Adding the lock design',
'# Mutability: Can It Change?

Some values can be changed after creation. Others cannot.

## Immutable (Cannot Change)
Once created, the value itself never changes.
```
// Numbers are immutable
x = 5
x = x + 1  // This creates a NEW number 6
           // The original 5 still exists (briefly)
```

## Mutable (Can Change)
The same value can be modified in place.
```
// Arrays are mutable
list = [1, 2, 3]
list.push(4)  // Same array, now [1, 2, 3, 4]
```

## Why It Matters

```
// SAFE: Immutable
original = "hello"
modified = original.toUpperCase()
// original is still "hello"

// CAREFUL: Mutable
original = [1, 2, 3]
modified = original
modified.push(4)
// original is now [1, 2, 3, 4] too!
```

## The Rule of Thumb

| Type | Mutable? |
|------|----------|
| Numbers | ❌ No |
| Strings | ❌ No |
| Booleans | ❌ No |
| Arrays | ✅ Yes |
| Objects | ✅ Yes |

> **Key Insight:** Immutability prevents accidental changes. Prefer immutable when possible.',
'{"type": "diagram", "id": "mutability", "examples": ["immutable-number", "mutable-array"]}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

-- CRAFTING PHASE: Building your container
('var-c1', 'variables', 'first-variable', 'Your First Variable', 'Declaring and assigning your first value', 'crafting', 1, 5, 'Cutting the first panel',
'# Your First Variable

Let''s create your first variable. It''s simpler than you think.

## The Basic Pattern

```javascript
let myVariable = "Hello, World!"
```

Breaking it down:
```
let        myVariable    =    "Hello, World!"
 ↑            ↑          ↑          ↑
keyword     name     assignment   value
```

## Try It Yourself

```javascript
// Create a variable to store your name
let myName = "Your Name Here"

// Create a variable for your age
let myAge = 25

// Create a variable for a greeting
let greeting = "Welcome to programming!"

// Now use them!
console.log(greeting)
console.log(myName)
console.log(myAge)
```

## What Happened?

1. We **declared** three variables (created the boxes)
2. We **assigned** values (put things in the boxes)
3. We **read** the values (looked inside the boxes)

> **Exercise:** Create three variables of your own: a number, a string, and a boolean (true/false).',
'{"type": "code-editor", "id": "first-variable", "starterCode": "// Create your variables here\nlet myName = \n", "solution": "let myName = \"Alex\"\nlet myAge = 25\nlet isLearning = true"}',
8, 0, 0, 1, datetime('now'), datetime('now')),

('var-c2', 'variables', 'let-const-var', 'let, const, and var', 'Choosing the right declaration keyword', 'crafting', 2, 6, 'Choosing the lid type',
'# let, const, and var

JavaScript has three ways to declare variables. Choosing the right one matters.

## const: The Sealed Container
**Cannot be reassigned.** Use this by default.
```javascript
const PI = 3.14159
const API_URL = "https://api.example.com"

PI = 3.2  // ❌ Error! Cannot reassign const
```

## let: The Reusable Container
**Can be reassigned.** Use when you need to change the value.
```javascript
let count = 0
count = 1     // ✅ OK
count = 2     // ✅ OK

let total = 0
for (let i = 0; i < 10; i++) {
    total += i  // total changes each iteration
}
```

## var: The Old Way (Avoid)
**Function-scoped, hoisted.** Legacy code only.
```javascript
var oldStyle = "avoid this"
// Problems: hoisting, no block scope, accidental globals
```

## The Decision Tree

```
Need to reassign the value?
    │
    ├── No  → Use const
    │
    └── Yes → Use let
    
Never use var in modern code.
```

> **Best Practice:** Start with `const`. Only switch to `let` if you get an error trying to reassign.',
'{"type": "comparison", "id": "let-const-var", "options": ["const", "let", "var"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('var-c3', 'variables', 'reading-variables', 'Reading Variables', 'Accessing stored values', 'crafting', 3, 7, 'Adding the window to see inside',
'# Reading Variables

Creating variables is only half the story. Let''s learn to use them.

## Basic Reading

Just use the variable name where you need the value:
```javascript
const message = "Hello"
console.log(message)  // "Hello"

const price = 19.99
const quantity = 3
const total = price * quantity  // 59.97
```

## Variables in Expressions

Variables can be used anywhere a value can:
```javascript
const firstName = "Ada"
const lastName = "Lovelace"

// String concatenation
const fullName = firstName + " " + lastName

// Template literals (recommended)
const greeting = `Hello, ${firstName}!`

// Math operations
const a = 10
const b = 5
const sum = a + b
const product = a * b
```

## Reading Before Declaration = Error

```javascript
console.log(name)  // ❌ ReferenceError!
const name = "Alex"
```

Variables must be declared before you read them.

## Reading Non-Existent Variables

```javascript
console.log(doesNotExist)  // ❌ ReferenceError!
```

> **Key Pattern:** Declare → Assign → Read. Always in that order.',
'{"type": "code-trace", "id": "reading-variables", "steps": ["declare", "assign", "read", "use-in-expression"]}',
8, 0, 0, 1, datetime('now'), datetime('now')),

('var-c4', 'variables', 'updating-variables', 'Updating Variables', 'Changing values with let', 'crafting', 4, 8, 'Installing the hinged lid',
'# Updating Variables

When you declare with `let`, you can change the value later.

## Basic Reassignment

```javascript
let score = 0
console.log(score)  // 0

score = 10
console.log(score)  // 10

score = 25
console.log(score)  // 25
```

## Compound Assignment Operators

Shortcuts for common updates:
```javascript
let count = 10

count = count + 1  // The long way
count += 1         // Same thing, shorter
count++            // Even shorter (add 1)

// All compound operators:
count += 5   // count = count + 5
count -= 3   // count = count - 3
count *= 2   // count = count * 2
count /= 4   // count = count / 4
```

## Common Update Patterns

```javascript
// Counter
let clicks = 0
clicks++  // After each click

// Accumulator
let total = 0
total += price  // Add each price

// Toggle
let isVisible = true
isVisible = !isVisible  // Flip between true/false

// Running max
let highest = 0
if (score > highest) {
    highest = score
}
```

> **Remember:** Only `let` variables can be updated. `const` will throw an error.',
'{"type": "animation", "id": "updating-variables", "scenes": ["initial", "reassign", "compound"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('var-c5', 'variables', 'variable-scope', 'Variable Scope in Practice', 'Where variables can be accessed', 'crafting', 5, 9, 'Building the compartments',
'# Variable Scope in Practice

Scope determines where a variable can be seen and used.

## Block Scope (let and const)

Variables are only visible inside their `{ }` block:
```javascript
if (true) {
    const inside = "I exist here"
    console.log(inside)  // ✅ Works
}
console.log(inside)  // ❌ ReferenceError!
```

## Function Scope

Variables declared in a function stay in that function:
```javascript
function greet() {
    const message = "Hello"
    console.log(message)  // ✅ Works
}
greet()
console.log(message)  // ❌ ReferenceError!
```

## Nested Scope

Inner scopes can see outer variables, but not vice versa:
```javascript
const outer = "I am outside"

function example() {
    const inner = "I am inside"
    console.log(outer)  // ✅ Can see outer
    console.log(inner)  // ✅ Can see inner
}

console.log(outer)  // ✅ Can see outer
console.log(inner)  // ❌ Cannot see inner
```

## Scope Diagram

```
┌─ Global ──────────────────────────────┐
│  const globalVar = "everywhere"       │
│                                       │
│  ┌─ Function ───────────────────────┐ │
│  │  const funcVar = "in function"   │ │
│  │                                  │ │
│  │  ┌─ Block ─────────────────────┐ │ │
│  │  │  const blockVar = "block"   │ │ │
│  │  │                             │ │ │
│  │  │  Can see: all three ✅      │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                  │ │
│  │  Can see: global, func ✅        │ │
│  └──────────────────────────────────┘ │
│                                       │
│  Can see: global only ✅              │
└───────────────────────────────────────┘
```

> **Best Practice:** Declare variables in the smallest scope needed.',
'{"type": "interactive-scope", "id": "scope-visualizer", "levels": ["global", "function", "block"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

-- MASTERY PHASE: Hardening the container
('var-m1', 'variables', 'naming-mastery', 'Naming Like a Pro', 'Industry-standard naming conventions', 'mastery', 1, 10, 'Labeling system installed',
'# Naming Like a Pro

Good names make code self-documenting. Bad names create confusion.

## The Golden Rules

### 1. Be Descriptive
```javascript
// ❌ Bad
const x = users.length
const temp = calculateTax(price)

// ✅ Good
const userCount = users.length
const taxAmount = calculateTax(price)
```

### 2. Be Concise
```javascript
// ❌ Too long
const theCurrentlyLoggedInUserObject = getUser()

// ✅ Just right
const currentUser = getUser()
```

### 3. Use Consistent Style

| Context | Style | Example |
|---------|-------|---------|
| Variables/Functions | camelCase | `userName`, `calculateTotal` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_URL` |
| Classes | PascalCase | `UserAccount`, `ShoppingCart` |
| Booleans | is/has/can | `isVisible`, `hasAccess`, `canEdit` |

### 4. Reveal Intent
```javascript
// ❌ What is this?
const d = new Date() - startDate

// ✅ Clear intent
const elapsedTimeMs = new Date() - startDate
```

## Language-Specific Conventions

| Language | Variables | Constants |
|----------|-----------|-----------|
| JavaScript | `camelCase` | `UPPER_SNAKE` |
| Python | `snake_case` | `UPPER_SNAKE` |
| Go | `camelCase` | `CamelCase` (exported) |

📖 [MDN: Naming Conventions](https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines/JavaScript#variable_naming)

> **Test:** Can someone understand this variable without seeing where it''s used?',
'{"type": "quiz", "id": "naming-quiz", "questions": ["good-vs-bad", "style-matching", "intent-reveal"]}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

('var-m2', 'variables', 'cross-language-variables', 'Variables Across Languages', 'Same concept, different syntax', 'mastery', 2, 11, 'Universal adapter installed',
'# Variables Across Languages

The **concept** of variables is universal. Only the syntax changes.

## Declaration Comparison

### JavaScript
```javascript
let name = "Alex"
const AGE = 25
var legacy = "avoid"  // old style
```
📖 [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)

### Python
```python
name = "Alex"       # No keyword needed
AGE = 25            # Convention for constants (not enforced)
```
📖 [Python Docs: Assignment](https://docs.python.org/3/reference/simple_stmts.html#assignment-statements)

### Go
```go
var name string = "Alex"  // Explicit type
name := "Alex"            // Short declaration (inferred)
const Age = 25            // True constant
```
📖 [Go Tour: Variables](https://go.dev/tour/basics/8)

### TypeScript
```typescript
let name: string = "Alex"    // With type annotation
const age: number = 25
let inferred = "type inferred"  // Still typed
```
📖 [TypeScript: Variable Declarations](https://www.typescriptlang.org/docs/handbook/variable-declarations.html)

## Key Differences

| Feature | JS | Python | Go |
|---------|-----|--------|-----|
| Type declaration | Optional | No | Required* |
| True constants | `const` (ref only) | Convention | `const` |
| Block scope | `let`/`const` | No | Yes |
| Hoisting | `var` only | No | No |

*Go can infer types with `:=`

> **Insight:** Learn the concept once, adapt the syntax per language.',
'{"type": "language-comparison", "id": "variables-cross-lang", "languages": ["javascript", "python", "go", "typescript"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('var-m3', 'variables', 'variable-pitfalls', 'Common Pitfalls & Debugging', 'Mistakes everyone makes and how to fix them', 'mastery', 3, 12, 'Safety mechanisms complete',
'# Common Pitfalls & Debugging

These mistakes catch everyone. Learn to recognize and fix them.

## 1. Using Before Declaration

```javascript
// ❌ Error
console.log(name)
const name = "Alex"

// ✅ Fix: Declare first
const name = "Alex"
console.log(name)
```

## 2. Reassigning const

```javascript
// ❌ Error
const count = 0
count = 1  // TypeError!

// ✅ Fix: Use let if you need to reassign
let count = 0
count = 1
```

## 3. Shadowing Variables

```javascript
// ⚠️ Confusing
const name = "Global"

function greet() {
    const name = "Local"  // Shadows outer name
    console.log(name)     // "Local"
}
console.log(name)         // "Global"

// ✅ Better: Use different names
const globalName = "Global"

function greet() {
    const userName = "Local"
    console.log(userName)
}
```

## 4. Reference vs Value Confusion

```javascript
// ⚠️ Surprise mutation
const original = [1, 2, 3]
const copy = original
copy.push(4)
console.log(original)  // [1, 2, 3, 4] — Both changed!

// ✅ Fix: Create actual copy
const original = [1, 2, 3]
const copy = [...original]  // Spread operator
copy.push(4)
console.log(original)  // [1, 2, 3] — Original safe
```

## 5. Typos in Variable Names

```javascript
// ❌ Silent bug
const userNmae = "Alex"  // Typo!
console.log(userName)     // ReferenceError

// ✅ Prevention: Use IDE with autocomplete
// TypeScript catches this at compile time
```

## Debugging Checklist

- [ ] Is the variable declared before use?
- [ ] Is it `const` but I''m trying to reassign?
- [ ] Am I accidentally shadowing another variable?
- [ ] Am I modifying a reference when I meant to copy?
- [ ] Is there a typo in the variable name?

> **Pro Tip:** Use TypeScript or a good linter to catch these automatically.',
'{"type": "debug-challenge", "id": "variable-pitfalls", "bugs": ["undeclared", "const-reassign", "shadow", "reference-mutation"]}',
15, 1.0, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- OPERATORS: 📏 Measuring Tools (Tier 1 - Stone)
-- 10 Total Lessons: 3 Blueprint, 5 Crafting, 2 Mastery
-- ============================================

INSERT INTO lessons (id, tool_id, slug, title, description, phase, phase_order, sequence_order, metaphor_progress, content_markdown, visual_elements, estimated_minutes, difficulty_modifier, is_premium, is_published, created_at, updated_at)
VALUES
-- BLUEPRINT PHASE
('op-b1', 'operators', 'why-operators', 'Why Operators?', 'Understanding the need for operations on data', 'blueprint', 1, 1, 'Understanding measurement principles',
'# Why Operators?

Variables store data. But data alone is useless—we need to **do things** with it.

## Operators Are Verbs

If variables are nouns (things), operators are verbs (actions):
```
5 + 3      // "Add 5 and 3"
age > 18   // "Is age greater than 18?"
x = 10     // "Assign 10 to x"
```

## Without Operators

```javascript
const a = 10
const b = 5
// Now what? We have numbers but can''t combine them!
```

## With Operators

```javascript
const a = 10
const b = 5
const sum = a + b        // 15
const isLarger = a > b   // true
const combined = a && b  // logical AND
```

## Categories of Operators

| Category | Purpose | Examples |
|----------|---------|----------|
| Arithmetic | Math calculations | `+ - * / %` |
| Comparison | Compare values | `== != > < >= <=` |
| Logical | Combine conditions | `&& \|\| !` |
| Assignment | Store values | `= += -= *=` |

> **Key Insight:** Operators transform and compare data. They''re the actions in your program.',
'{"type": "diagram", "id": "operator-categories", "categories": ["arithmetic", "comparison", "logical", "assignment"]}',
8, 0, 0, 1, datetime('now'), datetime('now')),

('op-b2', 'operators', 'operator-precedence', 'Order of Operations', 'How operators are evaluated', 'blueprint', 2, 2, 'Learning measurement order',
'# Order of Operations

Just like math class, operators have precedence. Some execute before others.

## The Problem

```javascript
const result = 2 + 3 * 4
// Is it (2 + 3) * 4 = 20?
// Or is it 2 + (3 * 4) = 14?
```

The answer is **14** because `*` has higher precedence than `+`.

## Precedence Table (High to Low)

| Priority | Operators | Example |
|----------|-----------|---------|
| 1 (Highest) | `()` Parentheses | `(2 + 3) * 4` |
| 2 | `!` `++` `--` | `!isReady` |
| 3 | `*` `/` `%` | `10 / 2` |
| 4 | `+` `-` | `5 + 3` |
| 5 | `>` `<` `>=` `<=` | `age >= 18` |
| 6 | `==` `===` `!=` `!==` | `x === y` |
| 7 | `&&` | `a && b` |
| 8 | `\|\|` | `a \|\| b` |
| 9 (Lowest) | `=` `+=` etc | `x = 5` |

## When In Doubt, Use Parentheses

```javascript
// Confusing
const result = a + b * c > d && e

// Clear
const result = ((a + (b * c)) > d) && e
```

> **Best Practice:** Use parentheses for clarity, even when not technically required.',
'{"type": "interactive", "id": "precedence-calculator", "expressions": ["2+3*4", "10-2*3+1", "(5+3)*2"]}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

('op-b3', 'operators', 'expressions-statements', 'Expressions vs Statements', 'Understanding what produces values', 'blueprint', 3, 3, 'Distinguishing measurements from actions',
'# Expressions vs Statements

This distinction helps you understand where operators can be used.

## Expressions: Produce a Value

An expression evaluates to something:
```javascript
5 + 3         // Expression → 8
age > 18      // Expression → true or false
"Hello"       // Expression → "Hello"
getUserName() // Expression → return value
```

**Expressions can be used wherever a value is expected.**

## Statements: Perform an Action

A statement does something but doesn''t produce a value:
```javascript
if (condition) { }     // Statement
for (let i = 0; ) { }  // Statement
const x = 5            // Statement (declaration)
```

## Why It Matters

```javascript
// ✅ Expression works in assignment
const result = 5 + 3

// ❌ Statement doesn''t work
const result = if (true) { }  // SyntaxError!

// ✅ Expression in template literal
const msg = `You are ${age >= 18 ? "adult" : "minor"}`

// ❌ Statement in template literal
const msg = `You are ${if (age >= 18) "adult"}`  // Error!
```

## The Ternary Operator

Turns an if/else into an expression:
```javascript
// Statement version
let status
if (age >= 18) {
    status = "adult"
} else {
    status = "minor"
}

// Expression version (ternary)
const status = age >= 18 ? "adult" : "minor"
```

> **Key Insight:** Operators create expressions. Expressions can go almost anywhere.',
'{"type": "classification", "id": "expr-vs-stmt", "items": ["5+3", "if(x)", "age>18", "for(...)", "x?y:z"]}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

-- CRAFTING PHASE
('op-c1', 'operators', 'arithmetic-operators', 'Arithmetic Operators', 'Math operations: + - * / %', 'crafting', 1, 4, 'Marking the basic scales',
'# Arithmetic Operators

The operators you know from math class, with a few extras.

## Basic Math

```javascript
const a = 10
const b = 3

a + b   // 13 (addition)
a - b   // 7  (subtraction)
a * b   // 30 (multiplication)
a / b   // 3.333... (division)
```

## Modulo (Remainder)

The `%` operator returns the **remainder** after division:
```javascript
10 % 3   // 1  (10 ÷ 3 = 3 remainder 1)
15 % 5   // 0  (evenly divisible)
7 % 2    // 1  (odd number)
8 % 2    // 0  (even number)
```

**Use cases:**
- Check if even/odd: `n % 2 === 0`
- Wrap around: `index % array.length`
- Every nth item: `i % n === 0`

## Exponentiation

```javascript
2 ** 3   // 8 (2 to the power of 3)
10 ** 2  // 100 (10 squared)
```

## Integer Division (Language-Specific)

```javascript
// JavaScript: Use Math.floor()
Math.floor(10 / 3)  // 3

// Python: Use //
10 // 3  # 3

// Go: Integer division automatic with int types
10 / 3  // 3 (if both are int)
```

> **Watch out:** Division by zero! Most languages throw an error or return Infinity.',
'{"type": "calculator", "id": "arithmetic-practice", "operations": ["+", "-", "*", "/", "%", "**"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('op-c2', 'operators', 'comparison-operators', 'Comparison Operators', 'Comparing values: == != > < >= <=', 'crafting', 2, 5, 'Adding comparison marks',
'# Comparison Operators

Compare two values and get a boolean (`true` or `false`).

## Equality

```javascript
5 == 5     // true
5 == "5"   // true (loose equality - type coercion!)
5 === 5    // true
5 === "5"  // false (strict equality - no coercion)
```

**Always use `===` (strict equality) in JavaScript!**

## Inequality

```javascript
5 != 5     // false
5 != "5"   // false (loose)
5 !== 5    // false
5 !== "5"  // true (strict)
```

## Greater/Less Than

```javascript
10 > 5     // true
10 >= 10   // true (greater OR equal)
5 < 10     // true
5 <= 5     // true (less OR equal)
```

## Comparing Strings

Strings compare alphabetically (lexicographically):
```javascript
"apple" < "banana"   // true (a comes before b)
"Apple" < "apple"    // true (uppercase before lowercase)
"10" < "9"           // true (string comparison, not numeric!)
```

## Common Patterns

```javascript
// Range check
const inRange = value >= min && value <= max

// Equality with null check
const isValid = value !== null && value !== undefined

// Not equal to any of several values
const notSpecial = x !== 0 && x !== 1 && x !== -1
```

📖 [MDN: Comparison Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators)

> **Critical:** Use `===` and `!==` to avoid type coercion bugs.',
'{"type": "truth-table", "id": "comparison-practice", "comparisons": ["==", "===", ">", "<", ">=", "<="]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('op-c3', 'operators', 'logical-operators', 'Logical Operators', 'Combining conditions: && || !', 'crafting', 3, 6, 'Installing the logic gates',
'# Logical Operators

Combine multiple conditions into one.

## AND (&&)

Both conditions must be true:
```javascript
true && true    // true
true && false   // false
false && true   // false
false && false  // false

// Example
const canDrive = age >= 16 && hasLicense
```

## OR (||)

At least one condition must be true:
```javascript
true || true    // true
true || false   // true
false || true   // true
false || false  // false

// Example
const hasAccess = isAdmin || isOwner
```

## NOT (!)

Flips true to false and vice versa:
```javascript
!true   // false
!false  // true

// Example
const isLoggedOut = !isLoggedIn
```

## Short-Circuit Evaluation

Operators stop early when the result is determined:
```javascript
// && stops at first false
false && expensiveFunction()  // Never calls function!

// || stops at first true
true || expensiveFunction()   // Never calls function!
```

**Practical uses:**
```javascript
// Default values (before nullish coalescing)
const name = userName || "Guest"

// Guard clauses
user && user.name  // Safe access if user might be null
```

## Combining Operators

```javascript
// Can vote: 18+ AND citizen AND registered
const canVote = age >= 18 && isCitizen && isRegistered

// Free shipping: premium member OR order over $50
const freeShipping = isPremium || orderTotal >= 50

// Use parentheses for complex logic
const eligible = (isStudent || isSenior) && !hasUsedDiscount
```

> **Tip:** Read `&&` as "and", `||` as "or", `!` as "not".',
'{"type": "logic-gate-simulator", "id": "logical-practice", "gates": ["AND", "OR", "NOT"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('op-c4', 'operators', 'assignment-operators', 'Assignment Operators', 'Storing and updating: = += -= etc', 'crafting', 4, 7, 'Calibrating the storage mechanism',
'# Assignment Operators

Store values and update them efficiently.

## Basic Assignment

```javascript
let x = 10      // Assign 10 to x
x = 20          // Replace with 20
```

## Compound Assignment

Shorthand for updating based on current value:
```javascript
let count = 10

// Long form        // Shorthand
count = count + 1   // count += 1
count = count - 1   // count -= 1
count = count * 2   // count *= 2
count = count / 2   // count /= 2
count = count % 3   // count %= 3
```

## Increment/Decrement

Special operators for adding/subtracting 1:
```javascript
let n = 5

n++    // Post-increment: returns 5, then n becomes 6
++n    // Pre-increment: n becomes 7, returns 7
n--    // Post-decrement: returns 7, then n becomes 6
--n    // Pre-decrement: n becomes 5, returns 5
```

**The difference:**
```javascript
let a = 5
console.log(a++)  // Prints 5 (then a becomes 6)
console.log(a)    // Prints 6

let b = 5
console.log(++b)  // Prints 6 (b becomes 6 first)
console.log(b)    // Prints 6
```

## String Concatenation

```javascript
let message = "Hello"
message += " World"  // "Hello World"
message += "!"       // "Hello World!"
```

## Chained Assignment

```javascript
let a, b, c
a = b = c = 0  // All three are now 0

// Evaluates right to left:
// c = 0, then b = 0, then a = 0
```

> **Best Practice:** Use compound operators for clarity when updating variables.',
'{"type": "code-trace", "id": "assignment-trace", "variables": ["x", "y"], "operations": ["=", "+=", "-=", "++", "--"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('op-c5', 'operators', 'ternary-nullish', 'Ternary & Nullish Operators', 'Conditional expressions and null handling', 'crafting', 5, 8, 'Adding precision controls',
'# Ternary & Nullish Operators

Advanced operators for conditional logic and null handling.

## Ternary Operator ( ? : )

An inline if-else that returns a value:
```javascript
// Syntax
condition ? valueIfTrue : valueIfFalse

// Examples
const status = age >= 18 ? "adult" : "minor"
const greeting = isLoggedIn ? `Hi, ${name}` : "Please log in"
const display = count === 1 ? "item" : "items"
```

**When to use:**
- Simple conditions with two outcomes
- Assigning a value based on a condition
- Inline in template literals or JSX

**When NOT to use:**
```javascript
// ❌ Too complex - use if/else instead
const result = a ? (b ? "both" : "only a") : (c ? "only c" : "none")
```

## Nullish Coalescing ( ?? )

Returns right side only if left is `null` or `undefined`:
```javascript
const name = userName ?? "Guest"

// Different from ||
0 || "default"     // "default" (0 is falsy)
0 ?? "default"     // 0 (0 is not null/undefined)

"" || "default"    // "default" (empty string is falsy)
"" ?? "default"    // "" (empty string is not null/undefined)
```

## Optional Chaining ( ?. )

Safely access nested properties:
```javascript
// Without optional chaining
const street = user && user.address && user.address.street

// With optional chaining
const street = user?.address?.street

// Works with methods too
const length = array?.length
const result = object?.method?.()
```

## Combining Them

```javascript
// Get user''s city, or "Unknown" if any part is missing
const city = user?.address?.city ?? "Unknown"

// Display value or placeholder
const display = value?.toString() ?? "N/A"
```

📖 [MDN: Nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

> **Modern JS:** These operators make null handling much cleaner.',
'{"type": "comparison", "id": "ternary-nullish", "examples": ["||", "??", "?.", "?:"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

-- MASTERY PHASE
('op-m1', 'operators', 'operators-cross-language', 'Operators Across Languages', 'Same operations, different syntax', 'mastery', 1, 9, 'Universal measurement installed',
'# Operators Across Languages

Most operators are universal. Here are the key differences.

## Equality Comparison

| Language | Loose | Strict | Notes |
|----------|-------|--------|-------|
| JavaScript | `==` | `===` | Always use strict |
| Python | `==` | (only has strict) | Type-safe by default |
| Go | `==` | (only has strict) | Type-safe by default |

```javascript
// JavaScript
5 == "5"   // true (loose)
5 === "5"  // false (strict) ✓
```
📖 [MDN: Equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)

```python
# Python - always strict
5 == "5"   # False
5 == 5     # True
```
📖 [Python: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)

```go
// Go - type-safe, won''t even compile
5 == "5"   // Compile error: mismatched types
```

## Logical Operators

| Language | AND | OR | NOT |
|----------|-----|-----|-----|
| JavaScript | `&&` | `\|\|` | `!` |
| Python | `and` | `or` | `not` |
| Go | `&&` | `\|\|` | `!` |

```python
# Python uses words
if age >= 18 and has_id:
    allow_entry()
    
result = value if value is not None else default
```
📖 [Python: Boolean operations](https://docs.python.org/3/library/stdtypes.html#boolean-operations-and-or-not)

## Integer Division

```javascript
// JavaScript
Math.floor(7 / 2)  // 3
```

```python
# Python
7 // 2  # 3 (floor division operator)
7 / 2   # 3.5 (true division)
```

```go
// Go - automatic for integers
7 / 2   // 3 (both are int)
7.0 / 2 // 3.5 (one is float)
```

> **Key Insight:** Learn the operators, note the syntax differences per language.',
'{"type": "language-comparison", "id": "operators-cross-lang", "languages": ["javascript", "python", "go"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('op-m2', 'operators', 'operator-pitfalls', 'Operator Gotchas', 'Common mistakes and how to avoid them', 'mastery', 2, 10, 'Safety mechanisms calibrated',
'# Operator Gotchas

These bugs catch even experienced developers.

## 1. Assignment vs Comparison

```javascript
// ❌ Bug: Assignment in condition (always true)
if (x = 5) {
    // This ASSIGNS 5 to x, then checks if 5 is truthy
}

// ✅ Correct: Comparison
if (x === 5) {
    // This COMPARES x to 5
}
```

**Prevention:** Use `===` and enable linter warnings.

## 2. Floating Point Precision

```javascript
0.1 + 0.2 === 0.3  // false! (0.30000000000000004)

// ✅ Fix: Compare with tolerance
Math.abs((0.1 + 0.2) - 0.3) < 0.0001  // true
```

## 3. String + Number Concatenation

```javascript
"5" + 3    // "53" (string concatenation!)
5 + "3"    // "53"
5 - "3"    // 2 (subtraction converts to number)

// ✅ Be explicit
Number("5") + 3  // 8
5 + Number("3")  // 8
```

## 4. Truthy/Falsy Surprises

```javascript
// These are all falsy:
if (0) { }         // false
if ("") { }        // false
if (null) { }      // false
if (undefined) { } // false
if (NaN) { }       // false

// But these are truthy:
if ("0") { }       // true (non-empty string!)
if ([]) { }        // true (empty array!)
if ({}) { }        // true (empty object!)
```

## 5. Short-Circuit Side Effects

```javascript
// ⚠️ Function might not run
false && doSomething()  // doSomething never called

// ⚠️ Unexpected default
const count = userCount || 10
// If userCount is 0, count becomes 10!

// ✅ Use nullish coalescing for numbers
const count = userCount ?? 10
// Only defaults if null/undefined, not 0
```

## 6. Operator Precedence Confusion

```javascript
// ⚠️ What does this mean?
a + b * c > d && e || f

// ✅ Use parentheses for clarity
((a + (b * c)) > d) && e) || f
```

> **Rule:** When in doubt, add parentheses. Future you will thank present you.',
'{"type": "bug-hunt", "id": "operator-bugs", "bugs": ["assignment-vs-comparison", "float-precision", "truthy-falsy"]}',
15, 1.0, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- CONDITIONALS: 🚪 Gate/Switch Tool (Tier 2 - Wood)
-- 11 Total Lessons: 3 Blueprint, 5 Crafting, 3 Mastery
-- ============================================

INSERT INTO lessons (id, tool_id, slug, title, description, phase, phase_order, sequence_order, metaphor_progress, content_markdown, visual_elements, estimated_minutes, difficulty_modifier, is_premium, is_published, created_at, updated_at)
VALUES
-- BLUEPRINT PHASE
('cond-b1', 'conditionals', 'why-decisions', 'Why Programs Need Decisions', 'Understanding branching logic', 'blueprint', 1, 1, 'Understanding the gate concept',
'# Why Programs Need Decisions

Without decisions, programs are just calculators—they do the same thing every time.

## The Linear Program Problem

```javascript
console.log("Hello")
console.log("Processing...")
console.log("Done")
// Always the same. Every time. Forever.
```

## Real Programs Adapt

Think about a login screen:
- If password correct → show dashboard
- If password wrong → show error
- If account locked → show support message

That''s **three different paths** from one situation.

## The Gate Mental Model

A conditional is like a gate:
```
        ┌─────────────────────┐
        │  Is condition met?  │
        └──────────┬──────────┘
                   │
          ┌───────┴───────┐
          ▼               ▼
       ┌─────┐         ┌─────┐
       │ YES │         │ NO  │
       └──┬──┘         └──┬──┘
          │               │
    ┌─────▼─────┐   ┌─────▼─────┐
    │  Path A   │   │  Path B   │
    └───────────┘   └───────────┘
```

## What Conditionals Enable

| Without Conditionals | With Conditionals |
|---------------------|-------------------|
| Fixed output | Dynamic responses |
| No validation | Input checking |
| No error handling | Graceful failures |
| No personalization | User-specific behavior |

> **Key Insight:** Conditionals make programs intelligent. They respond to circumstances.',
'{"type": "flowchart", "id": "decision-flow", "nodes": ["condition", "yes-path", "no-path"]}',
8, 0, 0, 1, datetime('now'), datetime('now')),

('cond-b2', 'conditionals', 'boolean-logic-foundations', 'Boolean Logic Foundations', 'True, false, and conditions', 'blueprint', 2, 2, 'Learning the open/closed states',
'# Boolean Logic Foundations

Conditionals run on **boolean logic**—the math of true and false.

## Only Two Values

```javascript
true   // Yes, on, 1, affirmative
false  // No, off, 0, negative
```

Everything else gets **evaluated** to true or false.

## Creating Boolean Values

```javascript
// Comparison operators create booleans
5 > 3          // true
10 === 10      // true
"cat" === "dog" // false

// Logical operators combine booleans
true && true   // true (both must be true)
true || false  // true (at least one true)
!true          // false (flip the value)
```

## Truthy and Falsy

JavaScript evaluates non-booleans in boolean context:

**Falsy values (evaluate to false):**
```javascript
false
0
"" (empty string)
null
undefined
NaN
```

**Everything else is truthy:**
```javascript
true
42 (any non-zero number)
"hello" (any non-empty string)
[] (arrays, even empty)
{} (objects, even empty)
```

## The Evaluation Process

```javascript
if (someValue) {
    // someValue gets converted to boolean
    // If truthy → this runs
}
```

Example:
```javascript
const name = "Alex"
if (name) {              // "Alex" is truthy
    console.log("Has name")  // This runs
}

const empty = ""
if (empty) {             // "" is falsy
    console.log("Has name")  // This does NOT run
}
```

> **Key Insight:** Conditions must be boolean or boolean-convertible.',
'{"type": "truth-table", "id": "boolean-foundations", "values": ["true", "false", "0", "\"\"", "\"hello\"", "null"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('cond-b3', 'conditionals', 'control-flow-concept', 'Control Flow', 'How programs choose their path', 'blueprint', 3, 3, 'Mapping the pathways',
'# Control Flow

**Control flow** is the order in which code executes. Conditionals let you change that order.

## Default Flow: Sequential

```javascript
line1()  // First
line2()  // Second
line3()  // Third
// Always this order
```

## Conditional Flow: Branching

```javascript
line1()           // Always runs

if (condition) {
    branchA()     // Only if condition true
} else {
    branchB()     // Only if condition false
}

line4()           // Always runs (after whichever branch)
```

## Visualizing the Branch

```
        │
        ▼
    ┌───────────┐
    │  line1()  │
    └─────┬─────┘
          │
    ╔═════╧═════╗
    ║ condition ║
    ╚═════╤═════╝
      ┌───┴───┐
      │ true? │
      │       │
   ┌──▼──┐ ┌──▼──┐
   │  A  │ │  B  │
   └──┬──┘ └──┬──┘
      └───┬───┘
          │
    ┌─────▼─────┐
    │  line4()  │  ← Flow rejoins
    └───────────┘
```

## Nested Control Flow

Branches can contain more branches:
```javascript
if (isLoggedIn) {
    if (isAdmin) {
        showAdminPanel()
    } else {
        showUserDashboard()
    }
} else {
    showLoginForm()
}
```

## Early Exit Pattern

```javascript
function processOrder(order) {
    if (!order) return         // Exit early
    if (!order.items) return   // Exit early
    
    // Main logic only runs if we get here
    calculateTotal(order)
}
```

> **Key Insight:** Conditionals redirect the flow of execution based on runtime values.',
'{"type": "flow-visualizer", "id": "control-flow", "patterns": ["sequential", "branching", "nested", "early-exit"]}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

-- CRAFTING PHASE
('cond-c1', 'conditionals', 'if-statement-practice', 'The if Statement', 'Single condition checks', 'crafting', 1, 4, 'Installing the basic gate',
'# The if Statement

The simplest conditional: do something only when a condition is true.

## Syntax

```javascript
if (condition) {
    // Code here runs only when condition is true
}
```

## Examples

```javascript
// Check if user is old enough
const age = 20
if (age >= 18) {
    console.log("You can vote!")
}

// Validate input
const email = "user@example.com"
if (email.includes("@")) {
    console.log("Valid email format")
}

// Check array contents
const cart = ["apple", "banana"]
if (cart.length > 0) {
    console.log("Cart has items")
}
```

## Without Curly Braces (Single Statement)

```javascript
// Works but not recommended
if (score > 100) console.log("High score!")

// Problems can arise:
if (score > 100)
    console.log("High score!")
    saveScore(score)  // This ALWAYS runs! Not part of if!
```

**Always use curly braces for clarity.**

## Common Patterns

```javascript
// Null/undefined check
if (user) {
    console.log(user.name)
}

// Array has items
if (results.length) {
    displayResults(results)
}

// Feature flag check
if (featureFlags.newUI) {
    enableNewUI()
}
```

> **Exercise:** Write an if statement that checks if a number is positive.',
'{"type": "code-editor", "id": "if-practice", "starterCode": "const number = 5\n// Add if statement here", "tests": ["positive", "negative", "zero"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('cond-c2', 'conditionals', 'if-else-practice', 'if-else', 'Two-path decisions', 'crafting', 2, 5, 'Adding the alternate route',
'# if-else: Two Paths

When you need to do one thing OR another—never both, never neither.

## Syntax

```javascript
if (condition) {
    // Runs when condition is true
} else {
    // Runs when condition is false
}
```

## Exactly One Path Runs

```javascript
const temperature = 25

if (temperature > 30) {
    console.log("It''s hot!")
} else {
    console.log("It''s not too hot")
}
// One of these ALWAYS runs
```

## Examples

```javascript
// Login check
if (passwordCorrect) {
    showDashboard()
} else {
    showError("Invalid password")
}

// Even or odd
if (number % 2 === 0) {
    console.log("Even")
} else {
    console.log("Odd")
}

// Sufficient funds
if (balance >= price) {
    completePurchase()
} else {
    showInsufficientFunds()
}
```

## Assigning Based on Condition

```javascript
let message

if (isLoggedIn) {
    message = "Welcome back!"
} else {
    message = "Please log in"
}

// Or use ternary for simple cases
const message = isLoggedIn ? "Welcome back!" : "Please log in"
```

## Don''t Do This

```javascript
// ❌ Redundant else
if (condition) {
    return true
} else {
    return false
}

// ✅ Just return the condition
return condition

// ❌ Unnecessary negation
if (!isValid) {
    handleInvalid()
} else {
    handleValid()
}

// ✅ Test positive condition first
if (isValid) {
    handleValid()
} else {
    handleInvalid()
}
```

> **Exercise:** Write an if-else that classifies a number as positive or negative.',
'{"type": "code-editor", "id": "if-else-practice", "starterCode": "const number = -3\n// Classify as positive or negative", "tests": ["positive", "negative"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('cond-c3', 'conditionals', 'else-if-chains', 'else if Chains', 'Multiple conditions', 'crafting', 3, 6, 'Installing multiple switches',
'# else if Chains

When you have more than two possibilities.

## Syntax

```javascript
if (condition1) {
    // First case
} else if (condition2) {
    // Second case
} else if (condition3) {
    // Third case
} else {
    // Default case (optional)
}
```

## Order Matters!

Conditions are checked **top to bottom**. First match wins.

```javascript
const score = 85

// ✅ Correct order (most specific first)
if (score >= 90) {
    console.log("A")
} else if (score >= 80) {
    console.log("B")  // This runs for 85
} else if (score >= 70) {
    console.log("C")
} else {
    console.log("F")
}

// ❌ Wrong order
if (score >= 70) {
    console.log("C")  // 85 would get C!
} else if (score >= 80) {
    console.log("B")  // Never reached for 85
}
```

## Real-World Example

```javascript
function getShippingCost(orderTotal) {
    if (orderTotal >= 100) {
        return 0           // Free shipping
    } else if (orderTotal >= 50) {
        return 4.99        // Reduced rate
    } else if (orderTotal >= 25) {
        return 7.99        // Standard rate
    } else {
        return 12.99       // Small order rate
    }
}
```

## HTTP Status Code Example

```javascript
function handleResponse(status) {
    if (status >= 500) {
        showServerError()
    } else if (status >= 400) {
        showClientError()
    } else if (status >= 300) {
        handleRedirect()
    } else if (status >= 200) {
        handleSuccess()
    } else {
        handleInformational()
    }
}
```

## When to Use Switch Instead

If you''re checking the same variable for exact matches:
```javascript
// Many else-ifs checking same variable → consider switch
if (day === "Monday") { }
else if (day === "Tuesday") { }
// ... etc

// Better as switch
switch (day) {
    case "Monday": break
    case "Tuesday": break
}
```

> **Exercise:** Write an else-if chain for t-shirt sizes (S, M, L, XL).',
'{"type": "code-editor", "id": "else-if-practice", "starterCode": "const chest = 38 // inches\n// Determine size", "tests": ["small", "medium", "large", "xlarge"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('cond-c4', 'conditionals', 'nested-conditionals', 'Nested Conditionals', 'Conditions within conditions', 'crafting', 4, 7, 'Building the decision tree',
'# Nested Conditionals

Sometimes you need conditions inside other conditions.

## Basic Nesting

```javascript
if (isLoggedIn) {
    if (isAdmin) {
        showAdminPanel()
    } else {
        showUserDashboard()
    }
} else {
    showLoginForm()
}
```

## The Pyramid of Doom

Nesting can get out of control:
```javascript
// ❌ Hard to read
if (user) {
    if (user.isActive) {
        if (user.hasPermission) {
            if (resource.isAvailable) {
                doTheThing()
            }
        }
    }
}
```

## Flatten with Guard Clauses

```javascript
// ✅ Much cleaner
if (!user) return
if (!user.isActive) return
if (!user.hasPermission) return
if (!resource.isAvailable) return

doTheThing()
```

## Flatten with Logical Operators

```javascript
// ❌ Nested
if (age >= 18) {
    if (hasID) {
        allowEntry()
    }
}

// ✅ Combined condition
if (age >= 18 && hasID) {
    allowEntry()
}
```

## When Nesting Is Okay

Sometimes nesting makes logic clearer:
```javascript
// Different handling at each level
if (order.status === "pending") {
    if (hasInventory(order.items)) {
        processOrder(order)
    } else {
        backorderItems(order)
    }
} else if (order.status === "shipped") {
    if (deliveryAttempted(order)) {
        scheduleRedelivery(order)
    }
}
```

## Decision Table Alternative

For complex nested logic, consider a lookup table:
```javascript
const actions = {
    "logged_in_admin": showAdminPanel,
    "logged_in_user": showUserDashboard,
    "logged_out": showLoginForm
}

const key = `${isLoggedIn ? "logged_in" : "logged_out"}_${isAdmin ? "admin" : "user"}`
actions[key]()
```

> **Rule of Thumb:** If nesting exceeds 2-3 levels, refactor.',
'{"type": "refactor-challenge", "id": "flatten-nesting", "before": "nested", "after": "flat"}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('cond-c5', 'conditionals', 'guard-clauses-practice', 'Guard Clauses', 'Early returns for cleaner code', 'crafting', 5, 8, 'Installing early-exit sensors',
'# Guard Clauses

A **guard clause** handles edge cases first and returns early, keeping the main logic clean.

## The Problem

```javascript
// ❌ The "happy path" is buried
function processUser(user) {
    if (user) {
        if (user.isActive) {
            if (user.hasPermission) {
                // Finally! The actual logic
                doImportantWork(user)
            } else {
                throw new Error("No permission")
            }
        } else {
            throw new Error("Inactive user")
        }
    } else {
        throw new Error("No user")
    }
}
```

## The Solution: Guard Clauses

```javascript
// ✅ Edge cases handled upfront, main logic clear
function processUser(user) {
    if (!user) throw new Error("No user")
    if (!user.isActive) throw new Error("Inactive user")
    if (!user.hasPermission) throw new Error("No permission")
    
    // Happy path - no nesting!
    doImportantWork(user)
}
```

## Pattern: Return Early

```javascript
function calculateDiscount(user, order) {
    // Guards
    if (!user) return 0
    if (!order) return 0
    if (order.total === 0) return 0
    
    // Main logic
    let discount = 0
    if (user.isPremium) discount += 0.1
    if (order.total > 100) discount += 0.05
    return discount
}
```

## Pattern: Throw Early

```javascript
function validateEmail(email) {
    if (!email) throw new Error("Email required")
    if (typeof email !== "string") throw new Error("Email must be string")
    if (!email.includes("@")) throw new Error("Invalid email format")
    
    // Validation passed
    return true
}
```

## Benefits

| Nested | Guard Clauses |
|--------|---------------|
| Deep indentation | Flat code |
| Happy path buried | Happy path clear |
| Hard to follow | Easy to scan |
| Error handling scattered | Errors at top |

## When to Use

- Validating function inputs
- Checking preconditions
- Handling error cases
- Any time you''d nest 3+ levels

> **Mantra:** Handle the unusual first, then proceed with the usual.',
'{"type": "refactor-challenge", "id": "guard-clauses", "before": "nested-validation", "after": "guards"}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

-- MASTERY PHASE
('cond-m1', 'conditionals', 'conditionals-cross-language', 'Conditionals Across Languages', 'Same concept, different syntax', 'mastery', 1, 9, 'Universal switch installed',
'# Conditionals Across Languages

The concept is universal. Here''s how syntax varies.

## JavaScript

```javascript
if (condition) {
    // code
} else if (other) {
    // code
} else {
    // code
}
```
📖 [MDN: if...else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)

## Python

```python
if condition:
    # code (indentation matters!)
elif other:
    # code
else:
    # code
```
📖 [Python Docs: if Statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)

**Key differences:**
- `elif` instead of `else if`
- No curly braces—indentation defines blocks
- Colon after condition

## Go

```go
if condition {
    // code
} else if other {
    // code
} else {
    // code
}

// Go special: initialization statement
if err := doSomething(); err != nil {
    return err
}
```
📖 [Go Tour: If](https://go.dev/tour/flowcontrol/5)

**Key differences:**
- No parentheses around condition
- Must have curly braces (even single line)
- Can initialize variables in if statement

## Comparison Table

| Feature | JavaScript | Python | Go |
|---------|------------|--------|-----|
| Else if keyword | `else if` | `elif` | `else if` |
| Braces required | No* | No (uses indent) | Yes |
| Parentheses | Required | No | No |
| Ternary | `a ? b : c` | `b if a else c` | None |

## Ternary Variations

```javascript
// JavaScript
const result = condition ? "yes" : "no"
```

```python
# Python (different order!)
result = "yes" if condition else "no"
```

```go
// Go has no ternary - use if/else
var result string
if condition {
    result = "yes"
} else {
    result = "no"
}
```

> **Insight:** The logic is identical. Only the spelling changes.',
'{"type": "language-comparison", "id": "conditionals-cross-lang", "languages": ["javascript", "python", "go"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('cond-m2', 'conditionals', 'conditional-patterns', 'Industry Patterns', 'Common conditional patterns in production code', 'mastery', 2, 10, 'Production patterns locked in',
'# Industry Patterns

Patterns you''ll see and use in professional codebases.

## 1. Null Check Pattern

```javascript
// ❌ Verbose
if (user !== null && user !== undefined) {
    useUser(user)
}

// ✅ Truthy check (when falsy values aren''t valid)
if (user) {
    useUser(user)
}

// ✅ Explicit null check (when 0 or "" are valid)
if (user != null) {  // Checks both null and undefined
    useUser(user)
}

// ✅ Modern: Optional chaining + nullish coalescing
const name = user?.name ?? "Anonymous"
```

## 2. Default Value Pattern

```javascript
// ❌ Old way
let theme
if (userTheme) {
    theme = userTheme
} else {
    theme = "light"
}

// ✅ Modern
const theme = userTheme ?? "light"
// Or for all falsy values
const theme = userTheme || "light"
```

## 3. Feature Toggle Pattern

```javascript
const features = {
    darkMode: true,
    newCheckout: false,
    betaFeatures: process.env.NODE_ENV === "development"
}

function renderUI() {
    if (features.darkMode) {
        enableDarkMode()
    }
    
    if (features.newCheckout) {
        return <NewCheckout />
    }
    
    return <LegacyCheckout />
}
```

## 4. Strategy Pattern (Replace Complex Conditionals)

```javascript
// ❌ Long if-else chain
function getPrice(userType) {
    if (userType === "regular") return basePrice
    else if (userType === "premium") return basePrice * 0.9
    else if (userType === "vip") return basePrice * 0.8
    else if (userType === "employee") return basePrice * 0.5
    else return basePrice
}

// ✅ Strategy object
const pricingStrategies = {
    regular: (price) => price,
    premium: (price) => price * 0.9,
    vip: (price) => price * 0.8,
    employee: (price) => price * 0.5,
    default: (price) => price
}

function getPrice(userType) {
    const strategy = pricingStrategies[userType] || pricingStrategies.default
    return strategy(basePrice)
}
```

## 5. Early Validation Pattern

```javascript
function createUser(data) {
    // All validation at the top
    if (!data.email) throw new ValidationError("Email required")
    if (!data.password) throw new ValidationError("Password required")
    if (data.password.length < 8) throw new ValidationError("Password too short")
    if (!isValidEmail(data.email)) throw new ValidationError("Invalid email")
    
    // Happy path: all validation passed
    return saveUser(data)
}
```

> **Pro Tip:** Complex conditionals often indicate you need a different design pattern.',
'{"type": "pattern-gallery", "id": "conditional-patterns", "patterns": ["null-check", "default-value", "feature-toggle", "strategy"]}',
15, 1.0, 0, 1, datetime('now'), datetime('now')),

('cond-m3', 'conditionals', 'conditional-pitfalls', 'Common Pitfalls', 'Mistakes and how to avoid them', 'mastery', 3, 11, 'Safety systems engaged',
'# Common Conditional Pitfalls

Bugs that bite even experienced developers.

## 1. Assignment vs Comparison

```javascript
// ❌ Bug: = is assignment, not comparison!
if (status = "active") {  // Always true! Assigns "active"
    doSomething()
}

// ✅ Fix: Use === for comparison
if (status === "active") {
    doSomething()
}

// Prevention: Enable linter rule no-cond-assign
```

## 2. Truthy/Falsy Surprises

```javascript
// ❌ Bug: 0 is falsy!
function getCount(count) {
    if (count) {
        return count
    }
    return "No count provided"
}
getCount(0)  // Returns "No count provided" — wrong!

// ✅ Fix: Check for undefined/null specifically
function getCount(count) {
    if (count !== undefined) {
        return count
    }
    return "No count provided"
}
```

## 3. Dangling Else

```javascript
// ❌ Ambiguous: which if does else belong to?
if (a)
    if (b)
        doB()
else        // Goes with inner if!
    doNotA()

// ✅ Always use braces
if (a) {
    if (b) {
        doB()
    }
} else {
    doNotA()
}
```

## 4. Unreachable Else-If

```javascript
// ❌ Bug: Second condition never true
if (x > 0) {
    console.log("Positive")
} else if (x > 10) {  // Can never reach! x <= 0 here
    console.log("Large positive")
}

// ✅ Fix: Check most specific first
if (x > 10) {
    console.log("Large positive")
} else if (x > 0) {
    console.log("Positive")
}
```

## 5. Missing Break in Switch

```javascript
// ❌ Bug: Fall-through!
switch (day) {
    case "Monday":
        console.log("Start of week")
    case "Friday":  // Also runs for Monday!
        console.log("End of week")
}

// ✅ Fix: Always break (or return)
switch (day) {
    case "Monday":
        console.log("Start of week")
        break
    case "Friday":
        console.log("End of week")
        break
}
```

## 6. Floating Point Comparison

```javascript
// ❌ Bug: Floating point precision
if (0.1 + 0.2 === 0.3) {  // false!
    console.log("Equal")
}

// ✅ Fix: Compare with tolerance
const EPSILON = 0.0001
if (Math.abs((0.1 + 0.2) - 0.3) < EPSILON) {
    console.log("Equal enough")
}
```

## Debugging Checklist

- [ ] Using `===` instead of `=`?
- [ ] Handling 0, empty string, false properly?
- [ ] Conditions in correct order (specific → general)?
- [ ] All switch cases have break/return?
- [ ] Braces around all if/else blocks?

> **Golden Rule:** When a conditional seems wrong, console.log the actual values being compared.',
'{"type": "bug-hunt", "id": "conditional-bugs", "bugs": ["assignment", "truthy", "unreachable", "fall-through"]}',
15, 1.0, 0, 1, datetime('now'), datetime('now'));

-- Continue with remaining tools in next migration file to avoid single file being too large
