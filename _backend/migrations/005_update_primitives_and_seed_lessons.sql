-- Update Primitives with Correct Tiers and Seed Initial Lessons
-- Based on CURRICULUM_HIERARCHY.md

-- ============================================
-- UPDATE EXISTING PRIMITIVES WITH CORRECT TIERS
-- ============================================

-- Tier 1: Stone Tools (Foundational)
UPDATE primitives SET tier = 1, tier_name = 'stone', difficulty = 1 WHERE id = 'variables';
UPDATE primitives SET tier = 1, tier_name = 'stone', difficulty = 1 WHERE id = 'operators';

-- Tier 2: Wood Tools (Control Flow)
UPDATE primitives SET tier = 2, tier_name = 'wood', difficulty = 2 WHERE id = 'conditionals';
UPDATE primitives SET tier = 2, tier_name = 'wood', difficulty = 2 WHERE id = 'for-loop';
UPDATE primitives SET tier = 2, tier_name = 'wood', difficulty = 2 WHERE id = 'while-loop';

-- Tier 3: Bronze Tools (Data Structures)
UPDATE primitives SET tier = 3, tier_name = 'bronze', difficulty = 3 WHERE id = 'arrays';
UPDATE primitives SET tier = 3, tier_name = 'bronze', difficulty = 3 WHERE id = 'objects';

-- Tier 4: Iron Tools (Functions)
UPDATE primitives SET tier = 4, tier_name = 'iron', difficulty = 4 WHERE id = 'functions';

-- ============================================
-- SEED TOOL LANGUAGE SUPPORT
-- ============================================

-- All current tools support JS, Python, Go
INSERT OR IGNORE INTO tool_language_support (id, tool_id, language_id, is_supported, created_at)
SELECT 
    lower(hex(randomblob(16))),
    p.id,
    l.id,
    1,
    datetime('now')
FROM primitives p
CROSS JOIN languages l
WHERE l.id IN ('javascript', 'python', 'go');

-- ============================================
-- SEED LESSONS FOR VARIABLES (Tier 1)
-- ============================================

INSERT OR IGNORE INTO lessons (id, tool_id, slug, title, description, sequence_order, difficulty_modifier, content_markdown, estimated_minutes, is_premium, is_published, created_at, updated_at)
VALUES
(lower(hex(randomblob(16))), 'variables', 'what-is-variable', 'What is a Variable?', 'Understanding named storage for values', 1, 0, 
'# What is a Variable?

A **variable** is a named container that stores a value in your program. Think of it like a labeled box where you can put something, take it out, or replace it with something else.

## Why Do We Need Variables?

Without variables, we would have to:
- Repeat the same values everywhere
- Have no way to change values
- Be unable to store user input or results

## The Mental Model

```
┌─────────────────┐
│   age = 25      │  ← "age" is the label
│   ┌─────────┐   │
│   │   25    │   │  ← 25 is the value stored inside
│   └─────────┘   │
└─────────────────┘
```

## Key Concepts

1. **Name**: The label you use to refer to the value
2. **Value**: The data stored inside
3. **Assignment**: The act of putting a value in the variable
4. **Reference**: Using the name to get the value back

Variables are the foundation of ALL programming. Every program you write will use them.', 
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'variables', 'declaration', 'Declaring Variables', 'How to create variables in different languages', 2, 0,
'# Declaring Variables

**Declaration** is telling the program "I want a variable with this name."

## The Concept

Before using a variable, most languages require you to declare it. This:
- Reserves memory for the value
- Associates a name with that memory location
- May specify what type of data it will hold

## Key Terms

- **Declare**: Create the variable
- **Initialize**: Give it a first value
- **Assign**: Put a value in it (can happen later too)

You can often declare and initialize in one step.',
8, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'variables', 'assignment', 'Assignment & Reassignment', 'Storing and changing values', 3, 0,
'# Assignment & Reassignment

**Assignment** is putting a value into a variable. **Reassignment** is changing it later.

## The = Operator

In most languages, `=` is the assignment operator. It does NOT mean "equals" like in math!

```
age = 25      ← "Put 25 into age"
age = 26      ← "Replace with 26"
```

## Direction Matters

Assignment flows RIGHT to LEFT:
```
variable = value
   ↑         │
   └─────────┘
```

The value on the right goes INTO the variable on the left.

## Common Mistake

```
25 = age  ← WRONG! Cannot assign to a literal
```',
8, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'variables', 'naming-conventions', 'Naming Conventions', 'Best practices for naming variables', 4, 0.5,
'# Naming Conventions

Good variable names make code **readable** and **maintainable**.

## Universal Rules

1. **Be descriptive**: `userAge` not `x`
2. **Be concise**: `count` not `theCurrentCountOfItems`
3. **Use context**: `age` in a User class is clear
4. **Avoid abbreviations**: `message` not `msg`

## Style By Language

| Language | Style | Example |
|----------|-------|---------|
| JavaScript | camelCase | `userName` |
| Python | snake_case | `user_name` |
| Go | camelCase | `userName` |
| Constants | UPPER_SNAKE | `MAX_SIZE` |

## What to Avoid

- Single letters (except `i`, `j` in loops)
- Misleading names (`temp` that is permanent)
- Reserved words (`class`, `for`, `if`)
- Starting with numbers (`1stPlace`)',
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'variables', 'const-vs-let', 'Constants vs Variables', 'When values should not change', 5, 0.5,
'# Constants vs Variables

A **constant** is a variable whose value cannot change after assignment.

## Why Use Constants?

1. **Prevent bugs**: Accidentally changing important values
2. **Self-documenting**: Signals intent to readers
3. **Optimization**: Compilers can optimize constants

## The Rule

> Use `const` by default. Only use `let` when you need to reassign.

## Examples of Good Constants

```
const TAX_RATE = 0.08        ← Never changes
const API_URL = "https://..."  ← Configuration
const user = getUser()        ← Reference won''t change
```

## When You Need let/var

```
let count = 0         ← Will be incremented
let result = null     ← Will be assigned later
let i = 0             ← Loop counter
```',
8, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- SEED LESSONS FOR FOR-LOOP (Tier 2)
-- ============================================

INSERT OR IGNORE INTO lessons (id, tool_id, slug, title, description, sequence_order, difficulty_modifier, content_markdown, estimated_minutes, is_premium, is_published, created_at, updated_at)
VALUES
(lower(hex(randomblob(16))), 'for-loop', 'why-loops', 'Why Do We Need Loops?', 'Understanding the power of repetition', 1, 0,
'# Why Do We Need Loops?

Imagine you need to print "Hello" 100 times. Without loops:

```
console.log("Hello")
console.log("Hello")
console.log("Hello")
// ... 97 more times
```

**Loops let us repeat code without repeating ourselves.**

## The DRY Principle

**D**on''t **R**epeat **Y**ourself

Loops are the primary tool for following this principle when you need to do something multiple times.

## What Loops Enable

- Process every item in a list
- Repeat until a condition is met
- Execute code a specific number of times
- Automate repetitive tasks

## Types of Loops

1. **For Loop**: When you know how many times
2. **While Loop**: When you don''t know how many times
3. **For-Each**: When iterating collections',
8, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'for-loop', 'for-syntax', 'For Loop Syntax', 'The three parts: init, condition, update', 2, 0,
'# For Loop Syntax

A for loop has **three parts** separated by semicolons:

```
for (initialization; condition; update) {
    // code to repeat
}
```

## The Three Parts

1. **Initialization**: Runs ONCE at the start
   - Usually creates a counter variable
   
2. **Condition**: Checked BEFORE each iteration
   - Loop continues while true
   - Loop stops when false
   
3. **Update**: Runs AFTER each iteration
   - Usually increments the counter

## Execution Order

```
for (let i = 0; i < 3; i++) {
     ↑          ↑        ↑
     1          2        4
     │          │        │
     │          │        └── After body
     │          └── Before body (check)
     └── Once at start
}
// Body runs at step 3
```',
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'for-loop', 'counting-up', 'Counting Up', 'Iterating from 0 to n', 3, 0,
'# Counting Up

The most common loop pattern: start at 0, go up to (but not including) a limit.

## The Pattern

```
for (let i = 0; i < n; i++) {
    // i goes: 0, 1, 2, ..., n-1
}
```

## Why Start at 0?

- Arrays are 0-indexed
- Matches how memory works
- `i < n` gives exactly `n` iterations

## Examples

**Print 0 to 4:**
```
for (let i = 0; i < 5; i++) {
    console.log(i)  // 0, 1, 2, 3, 4
}
```

**Loop through array indices:**
```
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i])
}
```',
8, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'for-loop', 'off-by-one', 'Off-By-One Errors', 'The most common loop mistake', 4, 1.0,
'# Off-By-One Errors

The **off-by-one error** is the most common bug in programming.

## The Problem

Should it be `<` or `<=`? Should you start at 0 or 1?

```
// Prints 0-4 (5 numbers)
for (let i = 0; i < 5; i++)

// Prints 0-5 (6 numbers!) 
for (let i = 0; i <= 5; i++)
```

## Common Mistakes

| Intended | Mistake | Result |
|----------|---------|--------|
| 5 iterations | `i <= 5` | 6 iterations |
| Index 0-4 | `i <= arr.length` | Index out of bounds |
| 1 to 10 | `i < 10` | 1 to 9 only |

## The Fix: Think in Ranges

For 0-indexed (arrays):
```
for (let i = 0; i < length; i++)
```

For 1-indexed (human counting):
```
for (let i = 1; i <= count; i++)
```

## Pro Tip

Always trace through mentally:
- What is `i` on the FIRST iteration?
- What is `i` on the LAST iteration?
- How many total iterations?',
12, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'for-loop', 'array-iteration', 'Iterating Over Arrays', 'Processing each element', 5, 0.5,
'# Iterating Over Arrays

One of the most common uses of for loops: do something with every item.

## The Pattern

```
for (let i = 0; i < array.length; i++) {
    // array[i] is the current element
}
```

## Why This Works

- `i` starts at 0 (first index)
- `i < length` stops before going out of bounds
- `array[i]` gets the element at position i

## Example: Sum All Numbers

```
let numbers = [10, 20, 30, 40]
let sum = 0

for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i]
}
// sum = 100
```

## Common Patterns

| Pattern | Description |
|---------|-------------|
| Read all | Process each element |
| Find | Look for specific element |
| Transform | Build new array |
| Filter | Keep only some elements |
| Reduce | Combine into single value |',
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'for-loop', 'nested-loops', 'Nested Loops', 'Loops within loops', 6, 1.5,
'# Nested Loops

A **nested loop** is a loop inside another loop. The inner loop runs completely for each iteration of the outer loop.

## The Pattern

```
for (outer) {
    for (inner) {
        // runs outer × inner times
    }
}
```

## Visualization

```
Outer i=0:  Inner j=0,1,2
Outer i=1:  Inner j=0,1,2
Outer i=2:  Inner j=0,1,2
```

3 outer × 3 inner = 9 total executions

## Example: Multiplication Table

```
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        console.log(`${i} × ${j} = ${i * j}`)
    }
}
```

## Warning: Performance

Nested loops multiply:
- 2 loops of 100 = 10,000 operations
- 3 loops of 100 = 1,000,000 operations

Be careful with large datasets!',
15, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'for-loop', 'loop-patterns', 'Common Loop Patterns', 'Accumulator, counter, and search', 7, 1.0,
'# Common Loop Patterns

Most loops follow one of these patterns. Learn to recognize them!

## 1. Accumulator Pattern

Build up a result by adding to it each iteration.

```
let sum = 0              // Start with identity
for (let i = 0; i < arr.length; i++) {
    sum += arr[i]        // Accumulate
}
```

## 2. Counter Pattern

Count how many items match a condition.

```
let count = 0
for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 10) {
        count++          // Increment counter
    }
}
```

## 3. Search Pattern

Find a specific item and stop.

```
let found = -1
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
        found = i
        break            // Stop when found
    }
}
```

## 4. Transform Pattern

Build a new array from an existing one.

```
let doubled = []
for (let i = 0; i < arr.length; i++) {
    doubled.push(arr[i] * 2)
}
```',
12, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- SEED LESSONS FOR CONDITIONALS (Tier 2)
-- ============================================

INSERT OR IGNORE INTO lessons (id, tool_id, slug, title, description, sequence_order, difficulty_modifier, content_markdown, estimated_minutes, is_premium, is_published, created_at, updated_at)
VALUES
(lower(hex(randomblob(16))), 'conditionals', 'what-is-conditional', 'What is a Conditional?', 'Making decisions in code', 1, 0,
'# What is a Conditional?

A **conditional** lets your program make decisions based on whether something is true or false.

## Real World Analogy

```
IF it is raining
    THEN take umbrella
ELSE
    leave umbrella at home
```

## In Code

```
if (isRaining) {
    takeUmbrella()
} else {
    leaveUmbrella()
}
```

## Why Conditionals Matter

Without conditionals, programs would:
- Always do the same thing
- Not respond to user input
- Not handle different cases
- Not validate data

Conditionals are how programs become **intelligent** and **responsive**.',
8, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'conditionals', 'if-statement', 'The If Statement', 'Single condition checks', 2, 0,
'# The If Statement

The simplest conditional: do something only if a condition is true.

## Syntax

```
if (condition) {
    // code runs only when condition is true
}
```

## How It Works

1. Evaluate the condition
2. If true → run the code block
3. If false → skip the code block

## Examples

```
if (age >= 18) {
    console.log("You can vote!")
}

if (score > highScore) {
    highScore = score
}

if (items.length === 0) {
    console.log("Cart is empty")
}
```

## The Condition Must Be Boolean

The condition must evaluate to `true` or `false`. We''ll cover truthy/falsy values later.',
8, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'conditionals', 'if-else', 'If-Else', 'Two-path decisions', 3, 0,
'# If-Else

When you need to do one thing OR another — never both.

## Syntax

```
if (condition) {
    // runs when true
} else {
    // runs when false
}
```

## Exactly One Path Runs

```
if (isLoggedIn) {
    showDashboard()
} else {
    showLoginForm()
}
// One of these ALWAYS runs, never both
```

## Examples

```
if (temperature > 30) {
    console.log("It''s hot!")
} else {
    console.log("It''s not that hot")
}

if (balance >= price) {
    completePurchase()
} else {
    showInsufficientFunds()
}
```',
8, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'conditionals', 'else-if', 'Else-If Chains', 'Multiple conditions', 4, 0.5,
'# Else-If Chains

When you have more than two possibilities, chain conditions together.

## Syntax

```
if (condition1) {
    // first case
} else if (condition2) {
    // second case
} else if (condition3) {
    // third case
} else {
    // default case
}
```

## Order Matters!

Conditions are checked **top to bottom**. First true condition wins.

```
let grade
if (score >= 90) {
    grade = "A"
} else if (score >= 80) {  // Only checked if < 90
    grade = "B"
} else if (score >= 70) {  // Only checked if < 80
    grade = "C"
} else {
    grade = "F"
}
```

## Common Mistake

```
// WRONG: 95 would get "C" because 95 >= 70 is true!
if (score >= 70) { grade = "C" }
else if (score >= 80) { grade = "B" }  // Never reached for 95
else if (score >= 90) { grade = "A" }  // Never reached for 95
```

Always check the **most specific** condition first.',
12, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'conditionals', 'guard-clauses', 'Guard Clauses', 'Early returns for cleaner code', 5, 1.0,
'# Guard Clauses

A **guard clause** handles edge cases early and returns, avoiding deep nesting.

## The Problem: Pyramid of Doom

```
function processUser(user) {
    if (user) {
        if (user.isActive) {
            if (user.hasPermission) {
                // Finally do the thing
                // Deeply nested = hard to read
            }
        }
    }
}
```

## The Solution: Guard Clauses

```
function processUser(user) {
    if (!user) return           // Guard 1
    if (!user.isActive) return  // Guard 2
    if (!user.hasPermission) return  // Guard 3
    
    // Happy path - no nesting!
    doTheThing()
}
```

## Benefits

1. **Readable**: Clear what conditions stop execution
2. **Flat**: No deep nesting
3. **Focused**: Main logic isn''t buried
4. **Early exit**: Fail fast

## The Pattern

```
function doSomething(input) {
    // Guards first
    if (invalidCondition) return
    if (anotherProblem) return
    
    // Main logic last
    processNormally()
}
```',
12, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- SEED LESSONS FOR ARRAYS (Tier 3)
-- ============================================

INSERT OR IGNORE INTO lessons (id, tool_id, slug, title, description, sequence_order, difficulty_modifier, content_markdown, estimated_minutes, is_premium, is_published, created_at, updated_at)
VALUES
(lower(hex(randomblob(16))), 'arrays', 'what-is-array', 'What is an Array?', 'Ordered collections of values', 1, 0,
'# What is an Array?

An **array** is an ordered collection of values stored under a single name.

## Why Arrays?

Without arrays:
```
let score1 = 85
let score2 = 90
let score3 = 78
// What if you have 100 scores?
```

With arrays:
```
let scores = [85, 90, 78, ...]  // All in one!
```

## Key Characteristics

1. **Ordered**: Elements have positions (indices)
2. **Indexed**: Access by number (0, 1, 2, ...)
3. **Dynamic**: Can grow or shrink (in most languages)
4. **Homogeneous**: Usually same type (best practice)

## Visual Model

```
Index:    0      1      2      3
        ┌──────┬──────┬──────┬──────┐
scores: │  85  │  90  │  78  │  92  │
        └──────┴──────┴──────┴──────┘
```

## Arrays Are Everywhere

- Shopping cart items
- User''s friends list
- High scores in a game
- Pixels in an image
- Characters in a string',
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'arrays', 'creating-arrays', 'Creating Arrays', 'Declaration and initialization', 2, 0,
'# Creating Arrays

Several ways to create arrays, depending on your needs.

## Array Literal (Most Common)

```
let fruits = ["apple", "banana", "cherry"]
let numbers = [1, 2, 3, 4, 5]
let mixed = [1, "two", true]  // Works but avoid
```

## Empty Array

```
let items = []  // Start empty, add later
```

## With Initial Size

```
let grid = new Array(10)  // 10 empty slots
let zeros = new Array(5).fill(0)  // [0,0,0,0,0]
```

## From Other Data

```
// String to array
"hello".split("")  // ["h","e","l","l","o"]

// Range of numbers (JS)
Array.from({length: 5}, (_, i) => i)  // [0,1,2,3,4]
```

## Best Practice

Use array literals `[]` unless you have a specific reason not to.',
8, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'arrays', 'accessing-elements', 'Accessing Elements', 'Getting values by index', 3, 0,
'# Accessing Elements

Use **square brackets** with an index to get a specific element.

## Syntax

```
array[index]
```

## Zero-Indexed!

Arrays start at index 0, not 1.

```
let colors = ["red", "green", "blue"]
//             0       1        2

colors[0]  // "red"   ← First element
colors[1]  // "green" ← Second element
colors[2]  // "blue"  ← Third element
colors[3]  // undefined ← Out of bounds!
```

## Negative Indices

Some languages support negative indices (Python):
```python
colors[-1]  # Last element
colors[-2]  # Second to last
```

JavaScript alternative:
```javascript
colors.at(-1)  // Last element (modern JS)
colors[colors.length - 1]  // Classic way
```

## Common Mistake

```
let arr = ["a", "b", "c"]
arr[3]  // undefined, not an error!
// Array has 3 elements but max index is 2
```',
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'arrays', 'index-bounds', 'Index Bounds', 'Avoiding out-of-bounds errors', 4, 1.0,
'# Index Bounds

Accessing an index that doesn''t exist causes bugs.

## The Problem

```
let arr = [10, 20, 30]  // Indices: 0, 1, 2

arr[3]   // undefined in JS, error in others
arr[-1]  // undefined in JS, error in others
arr[100] // undefined in JS
```

## Valid Index Range

```
0 to array.length - 1
```

For array of length 5:
- Valid: 0, 1, 2, 3, 4
- Invalid: -1, 5, 6, ...

## Safe Access Patterns

**Check first:**
```
if (index >= 0 && index < arr.length) {
    return arr[index]
}
```

**Use optional chaining:**
```
arr?.[index]  // undefined if arr is null/undefined
```

**Default value:**
```
arr[index] ?? defaultValue
```

## Loop Safety

```
// Safe: i < length (not <=)
for (let i = 0; i < arr.length; i++) {
    arr[i]  // Always valid
}
```',
10, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- SEED LESSONS FOR FUNCTIONS (Tier 4)
-- ============================================

INSERT OR IGNORE INTO lessons (id, tool_id, slug, title, description, sequence_order, difficulty_modifier, content_markdown, estimated_minutes, is_premium, is_published, created_at, updated_at)
VALUES
(lower(hex(randomblob(16))), 'functions', 'why-functions', 'Why Functions?', 'Reusability and organization', 1, 0,
'# Why Functions?

A **function** is a reusable block of code that performs a specific task.

## Without Functions

```
// Calculate area of rectangle 1
let area1 = 10 * 5

// Calculate area of rectangle 2
let area2 = 8 * 3

// Calculate area of rectangle 3
let area3 = 15 * 7

// Repeating the same logic!
```

## With Functions

```
function area(width, height) {
    return width * height
}

let area1 = area(10, 5)
let area2 = area(8, 3)
let area3 = area(15, 7)

// Write once, use anywhere!
```

## Benefits

1. **Reusability**: Write once, call many times
2. **Organization**: Group related code together
3. **Abstraction**: Hide complexity behind a name
4. **Testing**: Test in isolation
5. **Maintenance**: Fix in one place',
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'functions', 'function-declaration', 'Declaring Functions', 'The basic syntax', 2, 0,
'# Declaring Functions

A function declaration creates a named, reusable block of code.

## Syntax

```
function functionName(parameters) {
    // function body
    return result  // optional
}
```

## Parts of a Function

1. **`function`** keyword
2. **Name**: How you call it
3. **Parameters**: Inputs (in parentheses)
4. **Body**: Code inside { }
5. **Return**: Output (optional)

## Example

```
function greet(name) {
    return "Hello, " + name + "!"
}

// Usage
greet("Alice")  // "Hello, Alice!"
greet("Bob")    // "Hello, Bob!"
```

## Functions Without Return

```
function logMessage(msg) {
    console.log(msg)
    // No return - implicitly returns undefined
}
```',
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'functions', 'parameters-arguments', 'Parameters & Arguments', 'Inputs to functions', 3, 0.5,
'# Parameters & Arguments

These terms are often confused but have specific meanings.

## Parameters vs Arguments

- **Parameter**: The variable name in the function definition
- **Argument**: The actual value passed when calling

```
function greet(name) {  // name is a PARAMETER
    return "Hi " + name
}

greet("Alice")  // "Alice" is an ARGUMENT
```

## Multiple Parameters

```
function add(a, b) {     // Two parameters
    return a + b
}

add(5, 3)                // Two arguments → 8
```

## Order Matters

```
function subtract(a, b) {
    return a - b
}

subtract(10, 3)  // 10 - 3 = 7
subtract(3, 10)  // 3 - 10 = -7
```

## Default Parameters

```
function greet(name = "Guest") {
    return "Hello, " + name
}

greet()          // "Hello, Guest"
greet("Alice")   // "Hello, Alice"
```',
12, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'functions', 'return-values', 'Return Values', 'Getting data back from functions', 4, 0.5,
'# Return Values

The `return` statement sends a value back to the caller.

## How Return Works

```
function double(n) {
    return n * 2  // Send this value back
}

let result = double(5)  // result = 10
```

## Return Stops Execution

```
function check(n) {
    if (n < 0) {
        return "Negative"  // Function ends here
    }
    return "Non-negative"  // Only reached if n >= 0
}
```

## Returning Different Types

```
function find(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i      // Return index (number)
        }
    }
    return -1             // Return -1 if not found
}
```

## No Return = undefined

```
function sayHi() {
    console.log("Hi!")
    // No return statement
}

let x = sayHi()  // x = undefined
```',
10, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'functions', 'single-responsibility', 'Single Responsibility', 'One function, one job', 5, 1.0,
'# Single Responsibility Principle

A function should do **one thing** and do it well.

## Bad: Does Too Much

```
function processUser(userData) {
    // Validates
    if (!userData.email) throw Error()
    
    // Formats
    userData.name = userData.name.trim()
    
    // Saves
    database.save(userData)
    
    // Sends email
    email.send(userData.email, "Welcome!")
    
    // Logs
    logger.info("User created")
}
```

## Good: Single Responsibilities

```
function validateUser(data) {
    if (!data.email) throw Error()
}

function formatUser(data) {
    return { ...data, name: data.name.trim() }
}

function saveUser(data) {
    return database.save(data)
}

function sendWelcomeEmail(email) {
    email.send(email, "Welcome!")
}

// Compose them
function createUser(userData) {
    validateUser(userData)
    const formatted = formatUser(userData)
    const saved = saveUser(formatted)
    sendWelcomeEmail(saved.email)
    return saved
}
```

## Benefits

- **Testable**: Test each function in isolation
- **Reusable**: Use saveUser elsewhere
- **Maintainable**: Change email logic without touching validation
- **Readable**: Clear what each function does',
15, 0, 1, datetime('now'), datetime('now'));
