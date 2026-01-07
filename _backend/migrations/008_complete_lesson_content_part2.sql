-- Complete Lesson Content Part 2
-- FOR LOOP, WHILE LOOP, ARRAYS, OBJECTS, FUNCTIONS

-- ============================================
-- FOR LOOP: 🔄 Counting Wheel Tool (Tier 2 - Wood)
-- 14 Total Lessons: 4 Blueprint, 7 Crafting, 3 Mastery
-- ============================================

INSERT INTO lessons (id, tool_id, slug, title, description, phase, phase_order, sequence_order, metaphor_progress, content_markdown, visual_elements, estimated_minutes, difficulty_modifier, is_premium, is_published, created_at, updated_at)
VALUES
-- BLUEPRINT PHASE
('for-b1', 'for-loop', 'why-repetition', 'Why Repetition?', 'Understanding the need for loops', 'blueprint', 1, 1, 'Understanding the wheel concept',
'# Why Repetition?

Programming often requires doing the same thing many times.

## The Problem Without Loops

```javascript
console.log("Hello, student 1")
console.log("Hello, student 2")
console.log("Hello, student 3")
// ... what if there are 1000 students?
```

You''d need 1000 lines of nearly identical code. And what if the number changes?

## The Loop Solution

```javascript
for (let i = 1; i <= 1000; i++) {
    console.log(`Hello, student ${i}`)
}
// 3 lines instead of 1000!
```

## Real-World Repetition

| Task | Without Loop | With Loop |
|------|-------------|-----------|
| Email 100 users | 100 function calls | 1 loop |
| Process 50 orders | 50 blocks of code | 1 loop |
| Check 200 passwords | 200 if statements | 1 loop |

## The Counting Wheel Mental Model

Think of a for loop as a **counting wheel**:
- It has a **starting position** (where to begin)
- It has an **ending position** (where to stop)
- It **clicks forward** one position at a time

```
    Start → [0] → [1] → [2] → [3] → [4] → Stop
              ↓     ↓     ↓     ↓     ↓
             Run   Run   Run   Run   Run
             body  body  body  body  body
```

> **Key Insight:** Loops let you write code once and run it many times.',
'{"type": "animation", "id": "counting-wheel-intro", "frames": ["manual-repetition", "wheel-concept", "loop-execution"]}',
8, 0, 0, 1, datetime('now'), datetime('now')),

('for-b2', 'for-loop', 'loop-anatomy', 'Anatomy of a For Loop', 'The three parts: init, condition, update', 'blueprint', 2, 2, 'Drawing the three-part mechanism',
'# Anatomy of a For Loop

Every for loop has exactly three parts, separated by semicolons.

## The Three Parts

```javascript
for (initialization; condition; update) {
    // body - code to repeat
}
```

### Part 1: Initialization
Runs **once** at the very beginning.
```javascript
let i = 0  // Create counter, start at 0
```

### Part 2: Condition
Checked **before each iteration**. Loop continues while true.
```javascript
i < 5  // Keep going while i is less than 5
```

### Part 3: Update
Runs **after each iteration**.
```javascript
i++  // Add 1 to counter after each loop
```

## The Execution Order

```javascript
for (let i = 0; i < 3; i++) {
    console.log(i)
}
```

```
1. Initialize: i = 0
2. Check: 0 < 3? Yes → Run body, log 0
3. Update: i = 1
4. Check: 1 < 3? Yes → Run body, log 1
5. Update: i = 2
6. Check: 2 < 3? Yes → Run body, log 2
7. Update: i = 3
8. Check: 3 < 3? No → EXIT LOOP
```

## Visual Timeline

```
     ┌─────────────────────────────────────────────────┐
     │  for (let i=0;   i<3;   i++)  { log(i) }       │
     └─────────────────────────────────────────────────┘
               │         │       │         │
Step 1: ──────┘         │       │         │
              i = 0      │       │         │
Step 2: ────────────────┘       │         │
              0 < 3? ✓           │         │
Step 3: ────────────────────────│─────────┘
              prints 0           │
Step 4: ────────────────────────┘
              i++ (i = 1)
Step 5: Check again... (repeat)
```

> **Key Insight:** Init once, check before, update after. Every time.',
'{"type": "step-through", "id": "loop-execution", "code": "for (let i = 0; i < 3; i++) { console.log(i) }"}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('for-b3', 'for-loop', 'counting-patterns', 'Counting Patterns', 'Start, stop, and step configurations', 'blueprint', 3, 3, 'Marking the spoke positions',
'# Counting Patterns

Different situations need different counting configurations.

## Count Up from 0

The most common pattern (for array indices):
```javascript
for (let i = 0; i < 5; i++)
// i: 0, 1, 2, 3, 4 (five iterations)
```

## Count Up from 1

When 1-based counting makes sense:
```javascript
for (let i = 1; i <= 5; i++)
// i: 1, 2, 3, 4, 5 (five iterations)
```

## Count Down

For reverse iteration:
```javascript
for (let i = 5; i > 0; i--)
// i: 5, 4, 3, 2, 1

for (let i = 4; i >= 0; i--)
// i: 4, 3, 2, 1, 0 (for reverse array index)
```

## Skip Counting

Count by 2s, 10s, etc.:
```javascript
for (let i = 0; i < 10; i += 2)
// i: 0, 2, 4, 6, 8

for (let i = 0; i < 100; i += 10)
// i: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90
```

## Common Iteration Counts

| Goal | Pattern | Values |
|------|---------|--------|
| n iterations from 0 | `i = 0; i < n; i++` | 0 to n-1 |
| n iterations from 1 | `i = 1; i <= n; i++` | 1 to n |
| Array indices | `i = 0; i < arr.length; i++` | 0 to length-1 |
| Reverse array | `i = arr.length-1; i >= 0; i--` | length-1 to 0 |

## The Pattern Formula

```
for (let i = START; i COMPARISON END; i UPDATE)
```

| Part | Controls |
|------|----------|
| START | Where counting begins |
| COMPARISON | When to stop (while true) |
| END | The boundary value |
| UPDATE | How much to change each step |

> **Practice:** Before coding, write out what values i will have.',
'{"type": "pattern-builder", "id": "counting-patterns", "configurations": ["0-to-n", "1-to-n", "countdown", "skip"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('for-b4', 'for-loop', 'off-by-one-concept', 'Off-By-One Errors', 'The most common loop mistake', 'blueprint', 4, 4, 'Adding boundary markers',
'# Off-By-One Errors

The **off-by-one error** is the most common bug in programming. It happens when your loop runs one too many or one too few times.

## The Classic Mistake

```javascript
// How many times does this run?
for (let i = 0; i <= 5; i++) {
    console.log(i)
}
// Answer: 6 times (0,1,2,3,4,5)
// Might be unexpected if you wanted 5!
```

## < vs <=

```javascript
// 5 iterations (0,1,2,3,4)
for (let i = 0; i < 5; i++)

// 6 iterations (0,1,2,3,4,5)
for (let i = 0; i <= 5; i++)
```

**Rule of thumb:** 
- Use `< length` for 0-indexed (arrays)
- Use `<= count` for 1-indexed (human counting)

## The Fencepost Problem

```
How many posts for a 100-meter fence with posts every 10 meters?

|----|----|----|----|----|----|----|----|----|----|
1    2    3    4    5    6    7    8    9   10   11

Answer: 11 posts (one more than number of gaps!)
```

This is why arrays are tricky:
```javascript
const arr = ["a", "b", "c", "d", "e"]  // 5 elements
// Indices:    0    1    2    3    4    // Max index is 4, not 5!

for (let i = 0; i <= arr.length; i++) {  // ❌ Bug!
    console.log(arr[i])  // arr[5] is undefined!
}

for (let i = 0; i < arr.length; i++) {   // ✅ Correct
    console.log(arr[i])
}
```

## Mental Check

Always ask:
1. What is `i` on the **first** iteration?
2. What is `i` on the **last** iteration?
3. How **many** iterations total?

```javascript
for (let i = 0; i < 5; i++)
// First: 0, Last: 4, Total: 5 ✓

for (let i = 1; i <= 5; i++)
// First: 1, Last: 5, Total: 5 ✓
```

> **Pro Tip:** When in doubt, trace through manually or add a console.log.',
'{"type": "interactive", "id": "off-by-one-explorer", "scenarios": ["array-bounds", "fence-posts", "count-comparison"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

-- CRAFTING PHASE
('for-c1', 'for-loop', 'first-for-loop', 'Your First For Loop', 'Writing and running a basic loop', 'crafting', 1, 5, 'Carving the first spoke',
'# Your First For Loop

Let''s write a for loop from scratch.

## The Goal

Print the numbers 0 through 4.

## Step by Step

### Step 1: The Shell
```javascript
for (         ) {

}
```

### Step 2: Initialization
```javascript
for (let i = 0;         ) {

}
```

### Step 3: Condition
```javascript
for (let i = 0; i < 5;         ) {

}
```

### Step 4: Update
```javascript
for (let i = 0; i < 5; i++) {

}
```

### Step 5: Body
```javascript
for (let i = 0; i < 5; i++) {
    console.log(i)
}
```

## Run It!

```
Output:
0
1
2
3
4
```

## Variations

```javascript
// Print 1 to 5 instead
for (let i = 1; i <= 5; i++) {
    console.log(i)
}

// Print with a message
for (let i = 0; i < 5; i++) {
    console.log(`Iteration number: ${i}`)
}

// Do something 10 times (don''t need the index)
for (let i = 0; i < 10; i++) {
    console.log("Hello!")
}
```

> **Exercise:** Write a loop that prints the numbers 1 through 10.',
'{"type": "code-editor", "id": "first-for-loop", "starterCode": "// Print numbers 1 through 10\n", "expectedOutput": "1\\n2\\n3\\n4\\n5\\n6\\n7\\n8\\n9\\n10"}',
8, 0, 0, 1, datetime('now'), datetime('now')),

('for-c2', 'for-loop', 'array-iteration', 'Iterating Over Arrays', 'Processing each element', 'crafting', 2, 6, 'Connecting to the data belt',
'# Iterating Over Arrays

One of the most common uses: do something with every array element.

## The Pattern

```javascript
for (let i = 0; i < array.length; i++) {
    // array[i] is the current element
}
```

## Example: Print All Elements

```javascript
const fruits = ["apple", "banana", "cherry"]

for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i])
}
// apple
// banana
// cherry
```

## Example: Sum All Numbers

```javascript
const numbers = [10, 20, 30, 40]
let sum = 0

for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i]
}
console.log(sum)  // 100
```

## Example: Find an Element

```javascript
const names = ["Alice", "Bob", "Charlie"]
let foundIndex = -1

for (let i = 0; i < names.length; i++) {
    if (names[i] === "Bob") {
        foundIndex = i
        break  // Stop searching once found
    }
}
console.log(foundIndex)  // 1
```

## Accessing Index AND Value

```javascript
const scores = [85, 92, 78, 95]

for (let i = 0; i < scores.length; i++) {
    console.log(`Student ${i + 1}: ${scores[i]} points`)
}
// Student 1: 85 points
// Student 2: 92 points
// ...
```

## Why `< length` Not `<= length`?

```javascript
const arr = ["a", "b", "c"]
// Indices:   0    1    2
// Length: 3

// i < 3 gives us: 0, 1, 2 ✓
// i <= 3 gives us: 0, 1, 2, 3 ✗ (arr[3] is undefined!)
```

> **Exercise:** Given an array of prices, calculate the total cost.',
'{"type": "code-editor", "id": "array-iteration", "starterCode": "const prices = [9.99, 24.50, 3.99, 15.00]\nlet total = 0\n// Your loop here", "tests": ["total === 53.48"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('for-c3', 'for-loop', 'nested-loops', 'Nested Loops', 'Loops within loops', 'crafting', 3, 7, 'Building the gear train',
'# Nested Loops

A loop inside another loop runs completely for each outer iteration.

## The Pattern

```javascript
for (let outer = 0; outer < 3; outer++) {
    for (let inner = 0; inner < 3; inner++) {
        console.log(`outer: ${outer}, inner: ${inner}`)
    }
}
```

## Execution Trace

```
outer=0, inner=0
outer=0, inner=1
outer=0, inner=2
outer=1, inner=0   ← outer advances, inner restarts
outer=1, inner=1
outer=1, inner=2
outer=2, inner=0
outer=2, inner=1
outer=2, inner=2
```

**Total iterations: 3 × 3 = 9**

## Example: Multiplication Table

```javascript
for (let row = 1; row <= 3; row++) {
    let line = ""
    for (let col = 1; col <= 3; col++) {
        line += `${row * col}\t`
    }
    console.log(line)
}
// 1  2  3
// 2  4  6
// 3  6  9
```

## Example: 2D Array

```javascript
const grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
        console.log(`grid[${row}][${col}] = ${grid[row][col]}`)
    }
}
```

## Performance Warning ⚠️

Nested loops multiply:
```javascript
// n × n = n²
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        // 10,000 iterations!
    }
}

// n × n × n = n³
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        for (let k = 0; k < 100; k++) {
            // 1,000,000 iterations!
        }
    }
}
```

> **Rule:** Think twice before adding a third nesting level.',
'{"type": "grid-visualizer", "id": "nested-loops", "outerMax": 3, "innerMax": 3}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('for-c4', 'for-loop', 'break-continue', 'Break and Continue', 'Controlling loop flow', 'crafting', 4, 8, 'Installing the brake and skip',
'# Break and Continue

Special keywords to control loop execution.

## break: Exit Immediately

Stops the loop entirely and moves to the next statement after the loop.

```javascript
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break  // Exit loop when i reaches 5
    }
    console.log(i)
}
// Output: 0, 1, 2, 3, 4
// (5, 6, 7, 8, 9 are never reached)
```

## continue: Skip This Iteration

Skips the rest of the current iteration and moves to the next one.

```javascript
for (let i = 0; i < 5; i++) {
    if (i === 2) {
        continue  // Skip when i is 2
    }
    console.log(i)
}
// Output: 0, 1, 3, 4
// (2 is skipped)
```

## Use Case: Search

```javascript
const users = ["Alice", "Bob", "Charlie", "David"]
let foundUser = null

for (let i = 0; i < users.length; i++) {
    if (users[i] === "Charlie") {
        foundUser = users[i]
        break  // No need to keep searching
    }
}
```

## Use Case: Skip Invalid Data

```javascript
const numbers = [1, -2, 3, -4, 5]
let sum = 0

for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < 0) {
        continue  // Skip negative numbers
    }
    sum += numbers[i]
}
// sum = 9 (only positive numbers)
```

## Nested Loop Break

`break` only exits the **innermost** loop:
```javascript
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) break  // Only breaks inner loop
        console.log(i, j)
    }
}
// 0,0 / 1,0 / 2,0 (outer loop continues)
```

## Visual Difference

```
Normal:   [0] → [1] → [2] → [3] → [4] → done

Break:    [0] → [1] → [2] → EXIT → → → done
                       ↓
                    (break)

Continue: [0] → [1] → skip → [3] → [4] → done
                  ↓
               (continue)
```

> **Best Practice:** Use break for "I found it" and continue for "skip this one".',
'{"type": "flow-animation", "id": "break-continue", "scenarios": ["normal", "break", "continue"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('for-c5', 'for-loop', 'accumulator-pattern', 'The Accumulator Pattern', 'Building up results', 'crafting', 5, 9, 'Attaching the result collector',
'# The Accumulator Pattern

Build up a result by adding to it each iteration.

## The Pattern

```javascript
let accumulator = initialValue

for (let i = 0; i < array.length; i++) {
    accumulator = accumulator + something
}
```

## Sum Numbers

```javascript
const numbers = [10, 20, 30, 40]
let sum = 0  // Start with 0 for addition

for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i]
}
// sum = 100
```

## Multiply Numbers (Product)

```javascript
const numbers = [2, 3, 4]
let product = 1  // Start with 1 for multiplication

for (let i = 0; i < numbers.length; i++) {
    product *= numbers[i]
}
// product = 24
```

## Build a String

```javascript
const words = ["Hello", "beautiful", "world"]
let sentence = ""  // Start with empty string

for (let i = 0; i < words.length; i++) {
    sentence += words[i] + " "
}
// sentence = "Hello beautiful world "
```

## Build an Array

```javascript
const numbers = [1, 2, 3, 4, 5]
const doubled = []  // Start with empty array

for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2)
}
// doubled = [2, 4, 6, 8, 10]
```

## Find Maximum

```javascript
const scores = [85, 92, 78, 95, 88]
let max = scores[0]  // Start with first element

for (let i = 1; i < scores.length; i++) {
    if (scores[i] > max) {
        max = scores[i]
    }
}
// max = 95
```

## Identity Values

| Operation | Initial Value | Why |
|-----------|--------------|-----|
| Sum | 0 | x + 0 = x |
| Product | 1 | x × 1 = x |
| String | "" | "" + s = s |
| Array | [] | Start empty |
| Max | First element | Need valid start |
| Min | First element | Need valid start |

> **Key Insight:** The initial value is the "identity" for your operation.',
'{"type": "accumulator-visualizer", "id": "accumulator-pattern", "examples": ["sum", "product", "string", "max"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('for-c6', 'for-loop', 'transform-pattern', 'The Transform Pattern', 'Creating new arrays from old', 'crafting', 6, 10, 'Building the transformer',
'# The Transform Pattern

Create a new array by processing each element of an existing array.

## The Pattern

```javascript
const original = [...]
const transformed = []

for (let i = 0; i < original.length; i++) {
    transformed.push(transform(original[i]))
}
```

## Example: Double Each Number

```javascript
const numbers = [1, 2, 3, 4, 5]
const doubled = []

for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2)
}
// doubled = [2, 4, 6, 8, 10]
```

## Example: Extract Property

```javascript
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 }
]
const names = []

for (let i = 0; i < users.length; i++) {
    names.push(users[i].name)
}
// names = ["Alice", "Bob", "Charlie"]
```

## Example: Format Strings

```javascript
const prices = [9.99, 24.5, 3.999]
const formatted = []

for (let i = 0; i < prices.length; i++) {
    formatted.push(`$${prices[i].toFixed(2)}`)
}
// formatted = ["$9.99", "$24.50", "$4.00"]
```

## Transform vs Mutate

```javascript
// ❌ Mutating original (usually bad)
for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] * 2
}

// ✅ Creating new array (usually better)
const newArr = []
for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i] * 2)
}
```

## Sneak Preview: map()

The transform pattern is so common, there''s a built-in method:
```javascript
// For loop version
const doubled = []
for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2)
}

// map version (you''ll learn this in Steel tier!)
const doubled = numbers.map(n => n * 2)
```

> **Coming Soon:** In Steel tier, you''ll learn `map()`, `filter()`, and `reduce()` - powerful shortcuts for these patterns.',
'{"type": "transform-visualizer", "id": "transform-pattern", "before": [1,2,3,4,5], "transformation": "x*2"}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('for-c7', 'for-loop', 'filter-pattern', 'The Filter Pattern', 'Keeping only matching elements', 'crafting', 7, 11, 'Installing the sieve',
'# The Filter Pattern

Create a new array with only elements that match a condition.

## The Pattern

```javascript
const original = [...]
const filtered = []

for (let i = 0; i < original.length; i++) {
    if (condition(original[i])) {
        filtered.push(original[i])
    }
}
```

## Example: Keep Positive Numbers

```javascript
const numbers = [3, -1, 4, -5, 2, -8, 6]
const positives = []

for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > 0) {
        positives.push(numbers[i])
    }
}
// positives = [3, 4, 2, 6]
```

## Example: Filter by Property

```javascript
const users = [
    { name: "Alice", active: true },
    { name: "Bob", active: false },
    { name: "Charlie", active: true }
]
const activeUsers = []

for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
        activeUsers.push(users[i])
    }
}
// activeUsers = [Alice, Charlie]
```

## Example: Find Matches

```javascript
const words = ["apple", "banana", "apricot", "cherry"]
const startsWithA = []

for (let i = 0; i < words.length; i++) {
    if (words[i].startsWith("a")) {
        startsWithA.push(words[i])
    }
}
// startsWithA = ["apple", "apricot"]
```

## Counting Matches

Sometimes you just need the count:
```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let evenCount = 0

for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
        evenCount++
    }
}
// evenCount = 5
```

## Sneak Preview: filter()

```javascript
// For loop version
const positives = []
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > 0) positives.push(numbers[i])
}

// filter version (Steel tier!)
const positives = numbers.filter(n => n > 0)
```

> **Exercise:** Filter an array of ages to keep only adults (18+).',
'{"type": "code-editor", "id": "filter-pattern", "starterCode": "const ages = [12, 25, 8, 32, 17, 21]\nconst adults = []\n// Your loop here", "tests": ["adults.length === 3"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

-- MASTERY PHASE
('for-m1', 'for-loop', 'for-loop-cross-language', 'For Loops Across Languages', 'Same concept, different syntax', 'mastery', 1, 12, 'Universal counter installed',
'# For Loops Across Languages

The for loop exists in every language. Here''s how syntax varies.

## JavaScript

```javascript
for (let i = 0; i < n; i++) {
    console.log(i)
}

// For-of (iterate values)
for (const item of array) {
    console.log(item)
}

// For-in (iterate keys)
for (const key in object) {
    console.log(key)
}
```
📖 [MDN: for](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for)

## Python

```python
# Range-based (most common)
for i in range(n):
    print(i)

# Direct iteration (no index needed)
for item in list:
    print(item)

# With index
for i, item in enumerate(list):
    print(i, item)
```
📖 [Python Docs: for](https://docs.python.org/3/tutorial/controlflow.html#for-statements)

## Go

```go
// C-style for
for i := 0; i < n; i++ {
    fmt.Println(i)
}

// Range over slice
for index, value := range slice {
    fmt.Println(index, value)
}

// While-style (Go only has for)
for condition {
    // body
}
```
📖 [Go Tour: For](https://go.dev/tour/flowcontrol/1)

## Comparison Table

| Language | C-style | For-each | Index access |
|----------|---------|----------|--------------|
| JavaScript | `for (let i=0; ...)` | `for...of` | `i` |
| Python | `for i in range(n)` | `for x in list` | `enumerate()` |
| Go | `for i := 0; ...` | `for _, v := range` | First value |

## Key Differences

| Feature | JavaScript | Python | Go |
|---------|------------|--------|-----|
| Parentheses | Required | None | None |
| Braces | Required* | None (indent) | Required |
| Range function | None built-in | `range()` | `range` keyword |
| Iterator variable scope | Block (`let`) | Function | Block |

> **Insight:** Python''s `for` is actually a for-each loop. Use `range()` for counting.',
'{"type": "language-comparison", "id": "for-loop-cross-lang", "languages": ["javascript", "python", "go"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('for-m2', 'for-loop', 'for-vs-alternatives', 'For vs ForEach vs Map', 'Choosing the right iteration method', 'mastery', 2, 13, 'Tool selection guide installed',
'# For vs ForEach vs Map

Modern languages offer multiple iteration methods. When to use which?

## Traditional For Loop

```javascript
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i])
}
```

**Use when:**
- You need the index
- You need to break/continue
- You need to modify iteration (skip items, go backwards)
- Performance is critical

## forEach

```javascript
arr.forEach((item, index) => {
    console.log(item)
})
```

**Use when:**
- You just need each item
- You don''t need to break early
- Cleaner code is priority

**Cannot:**
- `break` or `continue` (use `return` to skip)
- Be `await`ed properly

## for...of

```javascript
for (const item of arr) {
    console.log(item)
}
```

**Use when:**
- You want clean syntax
- You need break/continue
- You''re iterating any iterable (arrays, strings, Maps, Sets)

## map (Transform)

```javascript
const doubled = arr.map(x => x * 2)
```

**Use when:**
- You want a new array
- Each input produces one output
- You want immutability

## filter (Select)

```javascript
const evens = arr.filter(x => x % 2 === 0)
```

**Use when:**
- You want to select items matching a condition
- You want a subset of the array

## reduce (Combine)

```javascript
const sum = arr.reduce((acc, x) => acc + x, 0)
```

**Use when:**
- You want to combine all items into one value
- You need flexible accumulation

## Decision Tree

```
Need the index?
├── Yes, and need break → for loop
├── Yes, no break needed → forEach or for loop
└── No
    ├── Need break? → for...of
    └── No break needed
        ├── Creating new array? → map
        ├── Filtering items? → filter
        ├── Combining to one value? → reduce
        └── Just side effects? → forEach or for...of
```

> **Modern Best Practice:** Prefer declarative methods (map, filter, reduce) when they fit. Use for loops when you need control.',
'{"type": "decision-tree", "id": "iteration-choice", "outcomes": ["for", "forEach", "for-of", "map", "filter", "reduce"]}',
15, 1.0, 0, 1, datetime('now'), datetime('now')),

('for-m3', 'for-loop', 'for-loop-pitfalls', 'Loop Pitfalls & Performance', 'Common mistakes and optimization', 'mastery', 3, 14, 'Safety and speed systems engaged',
'# Loop Pitfalls & Performance

Avoid these common mistakes and understand performance implications.

## Pitfall 1: Modifying Array While Iterating

```javascript
// ❌ Bug: Skips elements!
const arr = [1, 2, 3, 4, 5]
for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
        arr.splice(i, 1)  // Removes element, shifts indices
    }
}
// arr = [1, 3, 5]? No! arr = [1, 3, 4] (4 was skipped)

// ✅ Fix: Iterate backwards
for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] % 2 === 0) {
        arr.splice(i, 1)
    }
}

// ✅ Better: Use filter (creates new array)
const odds = arr.filter(x => x % 2 !== 0)
```

## Pitfall 2: Closure in Loops (var)

```javascript
// ❌ Bug with var (all callbacks share same i)
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100)
}
// Prints: 3, 3, 3

// ✅ Fix: Use let (block scoped)
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100)
}
// Prints: 0, 1, 2
```

## Pitfall 3: Infinite Loops

```javascript
// ❌ Forgot to update i
for (let i = 0; i < 10; ) {  // Missing i++!
    console.log(i)  // Runs forever
}

// ❌ Condition never false
for (let i = 10; i > 0; i++) {  // Should be i--
    console.log(i)  // Runs forever
}
```

## Performance: Cache Array Length

```javascript
// ⚠️ Recalculates length each iteration
for (let i = 0; i < arr.length; i++) { }

// ✅ Cache length (minor optimization)
for (let i = 0, len = arr.length; i < len; i++) { }

// Note: Modern engines optimize this, so it rarely matters
```

## Performance: Avoid Expensive Operations in Loop

```javascript
// ❌ DOM query every iteration
for (let i = 0; i < 1000; i++) {
    document.querySelector(".result").innerHTML += i
}

// ✅ Cache reference, build string
const result = document.querySelector(".result")
let html = ""
for (let i = 0; i < 1000; i++) {
    html += i
}
result.innerHTML = html
```

## Performance: Big O Awareness

```javascript
// O(n) - Linear - Fast
for (let i = 0; i < n; i++) { }

// O(n²) - Quadratic - Gets slow with large n
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) { }
}
// n=100: 10,000 ops
// n=1000: 1,000,000 ops
// n=10000: 100,000,000 ops!
```

> **Rule:** Before adding nested loops, ask "Will this scale?"',
'{"type": "performance-visualizer", "id": "loop-performance", "scenarios": ["linear", "quadratic", "cubic"]}',
15, 1.0, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- WHILE LOOP: ⚙️ Mill/Crank Tool (Tier 2 - Wood)
-- 10 Total Lessons: 3 Blueprint, 5 Crafting, 2 Mastery
-- ============================================

INSERT INTO lessons (id, tool_id, slug, title, description, phase, phase_order, sequence_order, metaphor_progress, content_markdown, visual_elements, estimated_minutes, difficulty_modifier, is_premium, is_published, created_at, updated_at)
VALUES
('while-b1', 'while-loop', 'when-while', 'When Do We Use While?', 'Understanding indefinite iteration', 'blueprint', 1, 1, 'Understanding continuous motion',
'# When Do We Use While?

While loops are for when you **don''t know** how many iterations you need.

## For Loop vs While Loop

| For Loop | While Loop |
|----------|------------|
| Known iterations | Unknown iterations |
| "Do this 10 times" | "Do this until done" |
| Counting | Condition-based |

## For Loop: I Know the Count

```javascript
// I know I want exactly 5 iterations
for (let i = 0; i < 5; i++) {
    console.log(i)
}
```

## While Loop: I Don''t Know the Count

```javascript
// I don''t know how many tries until correct
let guess = getGuess()
while (guess !== secretNumber) {
    console.log("Try again!")
    guess = getGuess()
}
```

## Real-World While Scenarios

| Scenario | Condition |
|----------|-----------|
| User input | Until valid input received |
| Reading file | Until end of file |
| Game loop | Until player quits |
| Network request | Until response received |
| Searching | Until found or exhausted |

## The Mill Mental Model

A while loop is like a **water mill**:
- It keeps turning **while** water flows
- You don''t count rotations
- It stops when the condition changes

```
    Water Flowing?
         │
         ▼
    ╔═══════════╗
    ║  YES/NO?  ║
    ╚═════╤═════╝
      Yes │ No
    ┌─────┼─────────→ STOP
    │     │
    ▼     │
┌───────┐ │
│ TURN  │─┘
└───────┘
```

> **Key Insight:** Use for when you know the count. Use while when you know the condition.',
'{"type": "comparison", "id": "for-vs-while", "scenarios": ["known-count", "unknown-count", "condition-based"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('while-b2', 'while-loop', 'while-anatomy', 'Anatomy of a While Loop', 'Structure and execution flow', 'blueprint', 2, 2, 'Drawing the mill mechanism',
'# Anatomy of a While Loop

Simpler than for, but requires more manual setup.

## The Structure

```javascript
while (condition) {
    // body - code to repeat
}
```

## Execution Flow

1. Check condition
2. If true → run body → go to step 1
3. If false → exit loop

```javascript
let count = 0
while (count < 3) {
    console.log(count)
    count++
}
```

```
Step 1: count = 0, 0 < 3? Yes → log 0, count = 1
Step 2: count = 1, 1 < 3? Yes → log 1, count = 2
Step 3: count = 2, 2 < 3? Yes → log 2, count = 3
Step 4: count = 3, 3 < 3? No → EXIT
```

## Critical: The Loop Must End!

```javascript
// ❌ INFINITE LOOP - condition never becomes false
let x = 1
while (x > 0) {
    console.log(x)
    // x never changes!
}

// ✅ Condition eventually becomes false
let x = 5
while (x > 0) {
    console.log(x)
    x--  // x decreases each time
}
```

## The Three Essential Parts

While loops need the same three parts as for loops, just arranged differently:

```javascript
// For loop: all in one line
for (let i = 0; i < 5; i++) { }

// While loop: spread out
let i = 0           // 1. Initialization (before loop)
while (i < 5) {     // 2. Condition
    // body
    i++             // 3. Update (inside loop)
}
```

> **Warning:** If you forget the update, you get an infinite loop!',
'{"type": "step-through", "id": "while-execution", "code": "let count = 0\nwhile (count < 3) {\n  console.log(count)\n  count++\n}"}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('while-b3', 'while-loop', 'do-while', 'Do-While: At Least Once', 'When you need to run before checking', 'blueprint', 3, 3, 'Adding the guaranteed first turn',
'# Do-While: At Least Once

Sometimes you need to run the body **at least once** before checking the condition.

## While vs Do-While

```javascript
// while: check THEN run
while (condition) {
    // might never run if condition starts false
}

// do-while: run THEN check
do {
    // always runs at least once
} while (condition)
```

## When It Matters

```javascript
// ❌ Problem: What if input starts valid?
let input = getInput()
while (!isValid(input)) {
    input = getInput()  // Might never show prompt
}

// ✅ Solution: Always prompt at least once
let input
do {
    input = getInput()  // Always runs first time
} while (!isValid(input))
```

## Classic Use Case: Menu

```javascript
let choice
do {
    console.log("1. Play")
    console.log("2. Settings")
    console.log("3. Quit")
    choice = getChoice()
    
    if (choice === 1) play()
    if (choice === 2) settings()
    
} while (choice !== 3)  // Keep showing until quit
```

## Execution Order

```
do-while:                 while:
                         
    ┌─────┐              ╔═════════╗
    │ RUN │              ║ CONDITION║
    └──┬──┘              ╚════╤════╝
       │                 Yes  │  No
       ▼                 ┌────┼────→ EXIT
  ╔═════════╗            │    │
  ║CONDITION║            ▼    │
  ╚════╤════╝        ┌─────┐  │
  Yes  │  No         │ RUN │──┘
  │    │             └─────┘
  │    ▼
  │  EXIT
  │
  └─► Back to RUN
```

## Rarely Used

Do-while is uncommon in modern code because:
```javascript
// Most cases can be rewritten
do {
    body()
} while (condition)

// As:
while (true) {
    body()
    if (!condition) break
}
```

> **Use do-while when:** "Run at least once, then check" is the natural way to express the logic.',
'{"type": "comparison", "id": "while-vs-do-while", "showExecutionOrder": true}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

-- CRAFTING PHASE for WHILE (keeping it concise)
('while-c1', 'while-loop', 'basic-while', 'Writing While Loops', 'Basic while loop practice', 'crafting', 1, 4, 'Building the basic mill',
'# Writing While Loops

Let''s write some basic while loops.

## Counting with While

```javascript
let i = 0
while (i < 5) {
    console.log(i)
    i++
}
// Output: 0, 1, 2, 3, 4
```

## Countdown

```javascript
let seconds = 10
while (seconds > 0) {
    console.log(seconds)
    seconds--
}
console.log("Liftoff!")
```

## Sum Until Condition

```javascript
let sum = 0
let num = 1
while (sum < 100) {
    sum += num
    num++
}
console.log(`Sum: ${sum}, stopped at num: ${num}`)
```

## User Input Loop

```javascript
let password = ""
while (password !== "secret123") {
    password = prompt("Enter password:")
}
console.log("Access granted!")
```

## Converting For to While

```javascript
// For loop
for (let i = 0; i < 5; i++) {
    console.log(i)
}

// Equivalent while loop
let i = 0
while (i < 5) {
    console.log(i)
    i++
}
```

> **Exercise:** Write a while loop that doubles a number until it exceeds 1000.',
'{"type": "code-editor", "id": "basic-while", "starterCode": "let num = 1\n// Double until > 1000", "expectedOutput": "num > 1000"}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('while-c2', 'while-loop', 'input-validation', 'Input Validation Loop', 'Keep asking until valid', 'crafting', 2, 5, 'Installing the input filter',
'# Input Validation Loop

A classic while loop use case: keep asking until you get valid input.

## The Pattern

```javascript
let input = getInput()
while (!isValid(input)) {
    showError("Invalid input, try again")
    input = getInput()
}
// Now input is guaranteed valid
```

## Example: Number in Range

```javascript
let age = parseInt(prompt("Enter your age (0-120):"))

while (isNaN(age) || age < 0 || age > 120) {
    console.log("Please enter a valid age between 0 and 120")
    age = parseInt(prompt("Enter your age (0-120):"))
}

console.log(`Your age is ${age}`)
```

## Example: Non-Empty String

```javascript
let name = prompt("Enter your name:")

while (!name || name.trim() === "") {
    console.log("Name cannot be empty")
    name = prompt("Enter your name:")
}
```

## Example: Yes/No Confirmation

```javascript
let answer = prompt("Continue? (yes/no)").toLowerCase()

while (answer !== "yes" && answer !== "no") {
    console.log("Please enter yes or no")
    answer = prompt("Continue? (yes/no)").toLowerCase()
}

if (answer === "yes") {
    proceed()
}
```

## Avoiding Code Duplication

```javascript
// ❌ Duplicated code
let input = prompt("Enter value:")
while (!isValid(input)) {
    input = prompt("Enter value:")  // Same line repeated
}

// ✅ Better with do-while or infinite loop
let input
do {
    input = prompt("Enter value:")
} while (!isValid(input))

// ✅ Or with break
while (true) {
    const input = prompt("Enter value:")
    if (isValid(input)) break
    console.log("Invalid, try again")
}
```

> **Exercise:** Write validation for a PIN (must be exactly 4 digits).',
'{"type": "code-editor", "id": "input-validation", "starterCode": "let pin = prompt(\"Enter 4-digit PIN:\")\n// Validate", "tests": ["pin.length === 4", "/^\\d{4}$/.test(pin)"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('while-c3', 'while-loop', 'sentinel-value', 'Sentinel Values', 'Loop until special value', 'crafting', 3, 6, 'Adding the stop signal',
'# Sentinel Values

A **sentinel value** is a special value that signals "stop looping."

## The Pattern

```javascript
let input = getInput()
while (input !== SENTINEL) {
    process(input)
    input = getInput()
}
```

## Example: Sum Numbers Until -1

```javascript
const STOP = -1
let sum = 0
let num = parseInt(prompt("Enter number (-1 to stop):"))

while (num !== STOP) {
    sum += num
    num = parseInt(prompt("Enter number (-1 to stop):"))
}

console.log(`Total: ${sum}`)
```

## Example: Read Lines Until "END"

```javascript
const lines = []
let line = readline()

while (line !== "END") {
    lines.push(line)
    line = readline()
}

console.log(`Read ${lines.length} lines`)
```

## Common Sentinel Values

| Context | Sentinel | Meaning |
|---------|----------|---------|
| Numbers | -1 or 0 | End of input |
| Strings | "END", "quit", "" | Stop command |
| Objects | null | No more items |
| Files | EOF | End of file |
| Pointers | null | End of list |

## Why Sentinels?

Without sentinels, you''d need to:
1. Ask "do you want to continue?" every time, or
2. Ask for count upfront, or
3. Use a different mechanism

Sentinels are natural: "Enter items, type DONE when finished."

> **Exercise:** Read words until the user types "stop", then print them all.',
'{"type": "code-editor", "id": "sentinel-value", "starterCode": "const words = []\n// Read until \"stop\"", "tests": ["words does not include stop"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('while-c4', 'while-loop', 'flag-controlled', 'Flag-Controlled Loops', 'Using boolean flags', 'crafting', 4, 7, 'Installing the control switch',
'# Flag-Controlled Loops

Use a boolean variable to control when the loop ends.

## The Pattern

```javascript
let keepGoing = true

while (keepGoing) {
    // do stuff
    if (someCondition) {
        keepGoing = false
    }
}
```

## Example: Game Loop

```javascript
let gameOver = false

while (!gameOver) {
    displayBoard()
    const move = getPlayerMove()
    updateGame(move)
    
    if (checkWin() || checkLose()) {
        gameOver = true
    }
}

console.log("Game Over!")
```

## Example: Search with Flag

```javascript
const items = ["apple", "banana", "cherry", "date"]
let found = false
let index = 0

while (!found && index < items.length) {
    if (items[index] === "cherry") {
        found = true
    } else {
        index++
    }
}

if (found) {
    console.log(`Found at index ${index}`)
} else {
    console.log("Not found")
}
```

## Flag vs Break

```javascript
// Flag approach
let running = true
while (running) {
    if (condition) running = false
}

// Break approach
while (true) {
    if (condition) break
}
```

Both work. Flags are more explicit; break is more concise.

## Multiple Exit Conditions

```javascript
let found = false
let error = false
let index = 0

while (!found && !error && index < items.length) {
    try {
        if (items[index] === target) found = true
        index++
    } catch (e) {
        error = true
    }
}
```

> **Use flags when:** The exit condition is complex or you need to know WHY the loop ended.',
'{"type": "state-visualizer", "id": "flag-controlled", "flags": ["found", "error", "running"]}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

('while-c5', 'while-loop', 'infinite-loop-patterns', 'Intentional Infinite Loops', 'When forever is the goal', 'crafting', 5, 8, 'Building the perpetual motion section',
'# Intentional Infinite Loops

Sometimes you WANT a loop that runs forever (until explicitly broken).

## The Pattern

```javascript
while (true) {
    // runs forever
    if (exitCondition) break
}
```

## Example: Server Loop

```javascript
while (true) {
    const request = waitForRequest()
    const response = handleRequest(request)
    sendResponse(response)
    // Never exits - server runs forever
}
```

## Example: Event Loop

```javascript
while (true) {
    const event = getNextEvent()
    
    if (event.type === "QUIT") break
    
    processEvent(event)
    updateDisplay()
}
```

## Example: Retry with Max Attempts

```javascript
let attempts = 0
const MAX_ATTEMPTS = 3

while (true) {
    attempts++
    
    try {
        const result = riskyOperation()
        console.log("Success!")
        break  // Exit on success
    } catch (e) {
        if (attempts >= MAX_ATTEMPTS) {
            console.log("Max retries exceeded")
            break  // Exit on max attempts
        }
        console.log(`Attempt ${attempts} failed, retrying...`)
    }
}
```

## When to Use

| Pattern | Use When |
|---------|----------|
| `while (condition)` | Condition is clear upfront |
| `while (true)` + `break` | Exit logic is complex or multiple |
| Flag-controlled | Need to know why loop ended |

## Safety: Always Have an Exit

```javascript
// ❌ Dangerous: no exit
while (true) {
    doStuff()
}

// ✅ Safe: has exit condition
while (true) {
    doStuff()
    if (shouldStop()) break
}
```

> **Rule:** Every `while (true)` must have a `break` somewhere inside.',
'{"type": "pattern-comparison", "id": "infinite-patterns", "patterns": ["while-true-break", "flag-controlled", "condition-based"]}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

-- MASTERY PHASE for WHILE (2 lessons)
('while-m1', 'while-loop', 'while-cross-language', 'While Across Languages', 'Same concept, different syntax', 'mastery', 1, 9, 'Universal motor installed',
'# While Loops Across Languages

While loops are nearly identical across languages.

## JavaScript

```javascript
while (condition) {
    // body
}

do {
    // body
} while (condition)
```
📖 [MDN: while](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while)

## Python

```python
while condition:
    # body
    
# Python has no do-while!
# Workaround:
while True:
    # body
    if not condition:
        break
```
📖 [Python Docs: while](https://docs.python.org/3/reference/compound_stmts.html#while)

## Go

```go
// Go only has for (no while keyword!)
for condition {
    // body
}

// Infinite loop
for {
    // body
    if !condition {
        break
    }
}
```
📖 [Go Tour: For](https://go.dev/tour/flowcontrol/3)

## Comparison Table

| Feature | JavaScript | Python | Go |
|---------|------------|--------|-----|
| while keyword | Yes | Yes | No (use for) |
| do-while | Yes | No | No |
| Parentheses | Required | No | No |
| Braces | Required* | No (indent) | Required |

## Go''s Unified For Loop

Go uses `for` for everything:
```go
// Traditional for
for i := 0; i < 10; i++ { }

// While equivalent
for condition { }

// Infinite loop
for { }
```

> **Fun Fact:** Go''s designers felt one loop keyword was simpler than three.',
'{"type": "language-comparison", "id": "while-cross-lang", "languages": ["javascript", "python", "go"]}',
10, 0.5, 0, 1, datetime('now'), datetime('now')),

('while-m2', 'while-loop', 'while-pitfalls', 'While Loop Pitfalls', 'Common mistakes and how to avoid them', 'mastery', 2, 10, 'Safety systems engaged',
'# While Loop Pitfalls

While loops have unique dangers because you manage iteration manually.

## Pitfall 1: Forgetting to Update

```javascript
// ❌ Infinite loop!
let i = 0
while (i < 5) {
    console.log(i)
    // Forgot i++!
}

// ✅ Fixed
let i = 0
while (i < 5) {
    console.log(i)
    i++
}
```

## Pitfall 2: Wrong Condition Direction

```javascript
// ❌ Never runs (already false)
let i = 10
while (i < 5) {
    console.log(i)
    i++
}

// ❌ Infinite loop (never becomes false)
let i = 10
while (i > 5) {
    console.log(i)
    i++  // Should be i--!
}
```

## Pitfall 3: Off-By-One

```javascript
// ❌ Runs 6 times (0,1,2,3,4,5)
let i = 0
while (i <= 5) {
    console.log(i)
    i++
}

// ✅ Runs 5 times (0,1,2,3,4)
let i = 0
while (i < 5) {
    console.log(i)
    i++
}
```

## Pitfall 4: Variable Scope

```javascript
// ❌ i is accessible after loop (might be unintended)
var i = 0
while (i < 5) {
    i++
}
console.log(i)  // 5 - still accessible

// ✅ Limit scope with block
{
    let i = 0
    while (i < 5) {
        i++
    }
}
// i is not accessible here
```

## Pitfall 5: Break Without Purpose Check

```javascript
// ❌ Can''t tell if found or exhausted
while (index < items.length) {
    if (items[index] === target) break
    index++
}
// Did we find it or reach the end?

// ✅ Use a flag
let found = false
while (index < items.length) {
    if (items[index] === target) {
        found = true
        break
    }
    index++
}
```

## Prevention Checklist

- [ ] Is there an update statement?
- [ ] Does the update move toward the exit condition?
- [ ] Is the initial value correct?
- [ ] Is the comparison operator correct (< vs <=)?
- [ ] Can you tell why the loop ended?

> **Pro Tip:** When debugging infinite loops, add console.log to see what''s changing (or not).',
'{"type": "bug-hunt", "id": "while-pitfalls", "bugs": ["missing-update", "wrong-direction", "off-by-one"]}',
12, 1.0, 0, 1, datetime('now'), datetime('now'));
