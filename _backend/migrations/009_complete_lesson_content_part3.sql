-- Complete Lesson Content Part 3
-- ARRAYS, OBJECTS, FUNCTIONS

-- ============================================
-- ARRAYS: 🗄️ Tool Rack (Tier 3 - Bronze)
-- 12 Total Lessons: 3 Blueprint, 6 Crafting, 3 Mastery
-- ============================================

INSERT INTO lessons (id, tool_id, slug, title, description, phase, phase_order, sequence_order, metaphor_progress, content_markdown, visual_elements, estimated_minutes, difficulty_modifier, is_premium, is_published, created_at, updated_at)
VALUES
-- BLUEPRINT PHASE
('arr-b1', 'arrays', 'why-collections', 'Why Collections?', 'Understanding the need for ordered data', 'blueprint', 1, 1, 'Planning the rack layout',
'# Why Collections?

Single variables work for single values. But what about many related values?

## The Problem

```javascript
// Tracking 5 students'' scores
const score1 = 85
const score2 = 92
const score3 = 78
const score4 = 95
const score5 = 88

// What if we have 100 students? 1000?
// How do we loop through them?
```

## The Solution: Arrays

```javascript
const scores = [85, 92, 78, 95, 88]

// Add more? Easy
scores.push(91)

// Loop through all? Easy
for (const score of scores) {
    console.log(score)
}

// Find average? Easy
const avg = scores.reduce((a, b) => a + b) / scores.length
```

## The Tool Rack Mental Model

An array is like a **numbered tool rack**:
- Each slot has a **number** (index)
- Each slot holds **one item**
- You access items **by number**
- Items stay in **order**

```
Index:    0       1       2       3       4
        ┌─────┬─────┬─────┬─────┬─────┐
scores: │ 85  │ 92  │ 78  │ 95  │ 88  │
        └─────┴─────┴─────┴─────┴─────┘
```

## When to Use Arrays

| Data | Use Array? | Why |
|------|-----------|-----|
| List of users | ✅ Yes | Ordered collection |
| RGB colors | ✅ Yes | Fixed order matters |
| Config options | ❌ No | Use object (named keys) |
| Single value | ❌ No | Just use variable |

> **Key Insight:** Arrays organize multiple values under one name with numbered access.',
'{"type": "visual-comparison", "id": "variables-vs-arrays", "before": "multiple-vars", "after": "single-array"}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('arr-b2', 'arrays', 'zero-indexing', 'Zero-Based Indexing', 'Why arrays start at 0', 'blueprint', 2, 2, 'Numbering the slots',
'# Zero-Based Indexing

Arrays start counting at **0**, not 1. This surprises many beginners.

## The Reality

```javascript
const letters = ["a", "b", "c", "d", "e"]
//               0     1     2     3     4

letters[0]  // "a" - FIRST element
letters[1]  // "b" - SECOND element
letters[4]  // "e" - FIFTH element
letters[5]  // undefined - OUT OF BOUNDS
```

## Why Zero?

Historical reasons (memory addresses), but it creates useful properties:
- `array[0]` is always first
- `array[length - 1]` is always last
- Index range is `0` to `length - 1`

```javascript
const arr = ["a", "b", "c"]
// Length: 3
// Valid indices: 0, 1, 2
// Last index: 3 - 1 = 2
```

## Common Mistakes

```javascript
const arr = [10, 20, 30, 40, 50]

// ❌ Mistake: Thinking first element is arr[1]
console.log(arr[1])  // 20, not 10!

// ❌ Mistake: Using length as index
console.log(arr[arr.length])  // undefined! (index 5 doesn''t exist)

// ✅ Correct: Last element
console.log(arr[arr.length - 1])  // 50
```

## The Mental Shift

Instead of counting items, think of the **distance from the start**:
- Index 0: distance 0 from start (first item)
- Index 1: distance 1 from start (second item)
- Index n: distance n from start

```
Distance from start:  0     1     2     3     4
                    ┌─────┬─────┬─────┬─────┬─────┐
                    │  a  │  b  │  c  │  d  │  e  │
                    └─────┴─────┴─────┴─────┴─────┘
Human counting:      1st   2nd   3rd   4th   5th
```

> **Remember:** Index = position - 1. First item is at index 0.',
'{"type": "index-visualizer", "id": "zero-indexing", "array": ["a", "b", "c", "d", "e"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('arr-b3', 'arrays', 'array-mutability', 'Array Mutability', 'Arrays can change after creation', 'blueprint', 3, 3, 'Understanding the adjustable rack',
'# Array Mutability

Arrays are **mutable**: you can change their contents after creation.

## const Doesn''t Mean Unchangeable

```javascript
const numbers = [1, 2, 3]

// ❌ Cannot reassign the variable
numbers = [4, 5, 6]  // TypeError!

// ✅ CAN modify the contents
numbers.push(4)      // [1, 2, 3, 4]
numbers[0] = 10      // [10, 2, 3, 4]
numbers.pop()        // [10, 2, 3]
```

`const` means the **variable** can''t be reassigned, not that the **array** can''t change.

## Why This Matters

```javascript
// ⚠️ Surprise mutation
const original = [1, 2, 3]
const copy = original       // Same array!

copy.push(4)
console.log(original)       // [1, 2, 3, 4] - Changed!
```

## Creating True Copies

```javascript
const original = [1, 2, 3]

// Spread operator (shallow copy)
const copy1 = [...original]

// Array.from (shallow copy)
const copy2 = Array.from(original)

// slice (shallow copy)
const copy3 = original.slice()

// Now safe to modify
copy1.push(4)
console.log(original)  // [1, 2, 3] - Unchanged!
```

## Shallow vs Deep Copy

```javascript
// Nested arrays: shallow copy isn''t enough!
const nested = [[1, 2], [3, 4]]
const shallow = [...nested]

shallow[0].push(99)
console.log(nested[0])  // [1, 2, 99] - Still linked!

// Deep copy (modern JS)
const deep = structuredClone(nested)
deep[0].push(99)
console.log(nested[0])  // [1, 2] - Safe!
```

> **Rule:** Treat arrays as mutable. Copy when you need independence.',
'{"type": "mutation-visualizer", "id": "array-mutability", "scenarios": ["direct-modify", "reference-copy", "spread-copy"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

-- CRAFTING PHASE
('arr-c1', 'arrays', 'creating-arrays', 'Creating Arrays', 'Different ways to create arrays', 'crafting', 1, 4, 'Building the rack frame',
'# Creating Arrays

Multiple ways to create arrays for different situations.

## Array Literal (Most Common)

```javascript
const fruits = ["apple", "banana", "cherry"]
const numbers = [1, 2, 3, 4, 5]
const mixed = [1, "two", true, null]  // Works but avoid
const empty = []
```

## From Existing Data

```javascript
// From string
"hello".split("")     // ["h", "e", "l", "l", "o"]
"a,b,c".split(",")    // ["a", "b", "c"]

// From array-like (NodeList, arguments)
Array.from(document.querySelectorAll("div"))
Array.from(arguments)

// From iterable
Array.from("hello")   // ["h", "e", "l", "l", "o"]
Array.from(new Set([1, 2, 3]))  // [1, 2, 3]
```

## Creating with Size

```javascript
// Empty array with length
new Array(5)          // [empty × 5]

// Filled with same value
new Array(5).fill(0)  // [0, 0, 0, 0, 0]

// Filled with computed values
Array.from({ length: 5 }, (_, i) => i)      // [0, 1, 2, 3, 4]
Array.from({ length: 5 }, (_, i) => i * 2)  // [0, 2, 4, 6, 8]
```

## Copying Arrays

```javascript
const original = [1, 2, 3]

const copy1 = [...original]           // Spread
const copy2 = original.slice()        // Slice
const copy3 = Array.from(original)    // Array.from
const copy4 = [].concat(original)     // Concat
```

## Best Practices

```javascript
// ✅ Use literals for known values
const colors = ["red", "green", "blue"]

// ✅ Use spread for copies
const colorsCopy = [...colors]

// ✅ Use Array.from for array-like or ranges
const digits = Array.from({ length: 10 }, (_, i) => i)

// ❌ Avoid new Array() for most cases
```

> **Exercise:** Create an array of the first 10 square numbers [1, 4, 9, 16, ...].',
'{"type": "code-editor", "id": "creating-arrays", "starterCode": "// Create array of first 10 squares", "tests": ["squares[0] === 1", "squares[9] === 100"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('arr-c2', 'arrays', 'accessing-modifying', 'Accessing & Modifying', 'Reading and changing array elements', 'crafting', 2, 5, 'Adding slot access',
'# Accessing & Modifying Elements

Bracket notation for reading and writing.

## Reading Elements

```javascript
const colors = ["red", "green", "blue"]

colors[0]   // "red" (first)
colors[1]   // "green" (second)
colors[2]   // "blue" (third)
colors[3]   // undefined (doesn''t exist)
colors[-1]  // undefined (no negative indices in JS)
```

## Last Element Tricks

```javascript
const arr = [10, 20, 30, 40, 50]

// Classic way
arr[arr.length - 1]  // 50

// Modern way (ES2022)
arr.at(-1)   // 50
arr.at(-2)   // 40
```

## Modifying Elements

```javascript
const numbers = [1, 2, 3]

numbers[0] = 10     // [10, 2, 3]
numbers[2] = 30     // [10, 2, 30]
numbers[3] = 40     // [10, 2, 30, 40] - extends array!
numbers[10] = 100   // [10, 2, 30, 40, empty × 6, 100] - creates holes!
```

## Adding Elements

```javascript
const arr = [1, 2, 3]

// At end
arr.push(4)         // [1, 2, 3, 4]
arr.push(5, 6)      // [1, 2, 3, 4, 5, 6]

// At beginning
arr.unshift(0)      // [0, 1, 2, 3, 4, 5, 6]

// At specific position
arr.splice(2, 0, "new")  // [0, 1, "new", 2, 3, 4, 5, 6]
```

## Removing Elements

```javascript
const arr = [1, 2, 3, 4, 5]

// From end
arr.pop()           // Returns 5, arr = [1, 2, 3, 4]

// From beginning
arr.shift()         // Returns 1, arr = [2, 3, 4]

// From specific position
arr.splice(1, 1)    // Removes at index 1, arr = [2, 4]
```

## Replacing Elements

```javascript
const arr = [1, 2, 3, 4, 5]

// Replace one
arr.splice(2, 1, "new")  // [1, 2, "new", 4, 5]

// Replace multiple
arr.splice(1, 3, "a", "b")  // [1, "a", "b", 5]
```

> **Exercise:** Given an array, swap the first and last elements.',
'{"type": "code-editor", "id": "array-access", "starterCode": "const arr = [1, 2, 3, 4, 5]\n// Swap first and last", "tests": ["arr[0] === 5", "arr[4] === 1"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('arr-c3', 'arrays', 'array-methods-basics', 'Essential Array Methods', 'push, pop, shift, unshift, slice, splice', 'crafting', 3, 6, 'Installing the basic tools',
'# Essential Array Methods

Methods you''ll use constantly.

## Adding: push() and unshift()

```javascript
const arr = [2, 3]

arr.push(4)      // Add to end → [2, 3, 4]
arr.push(5, 6)   // Add multiple → [2, 3, 4, 5, 6]

arr.unshift(1)   // Add to start → [1, 2, 3, 4, 5, 6]
arr.unshift(0)   // → [0, 1, 2, 3, 4, 5, 6]
```

## Removing: pop() and shift()

```javascript
const arr = [1, 2, 3, 4, 5]

const last = arr.pop()    // last = 5, arr = [1, 2, 3, 4]
const first = arr.shift() // first = 1, arr = [2, 3, 4]
```

## Extracting: slice()

Creates a **new array** without modifying original.

```javascript
const arr = [0, 1, 2, 3, 4, 5]

arr.slice(2)      // [2, 3, 4, 5] (from index 2 to end)
arr.slice(1, 4)   // [1, 2, 3] (from 1 up to but not including 4)
arr.slice(-2)     // [4, 5] (last 2 elements)
arr.slice()       // [0, 1, 2, 3, 4, 5] (full copy)
```

## Surgery: splice()

Modifies the original array. Can remove, insert, or replace.

```javascript
const arr = [0, 1, 2, 3, 4, 5]

// Remove 2 elements starting at index 2
arr.splice(2, 2)           // Returns [2, 3], arr = [0, 1, 4, 5]

// Insert at index 2 (remove 0 elements)
arr.splice(2, 0, "a", "b") // arr = [0, 1, "a", "b", 4, 5]

// Replace 1 element at index 1
arr.splice(1, 1, "X")      // arr = [0, "X", "a", "b", 4, 5]
```

## slice vs splice

| | slice | splice |
|-|-------|--------|
| Modifies original? | No | Yes |
| Returns | New array (extracted) | Array (removed items) |
| Use for | Copying portions | Insert/remove/replace |

## Quick Reference

```javascript
arr.push(x)       // Add to end
arr.pop()         // Remove from end
arr.unshift(x)    // Add to start
arr.shift()       // Remove from start
arr.slice(a, b)   // Copy portion [a to b)
arr.splice(i,n,x) // Remove n at i, insert x
```

> **Mnemonic:** "push/pop" at end, "shift/unshift" at start.',
'{"type": "method-visualizer", "id": "array-methods", "methods": ["push", "pop", "shift", "unshift", "slice", "splice"]}',
15, 0, 0, 1, datetime('now'), datetime('now')),

('arr-c4', 'arrays', 'searching-finding', 'Searching & Finding', 'indexOf, includes, find, findIndex', 'crafting', 4, 7, 'Adding the search mechanism',
'# Searching & Finding

Finding elements and checking existence.

## Does It Exist? includes()

```javascript
const fruits = ["apple", "banana", "cherry"]

fruits.includes("banana")  // true
fruits.includes("grape")   // false
fruits.includes("Apple")   // false (case-sensitive)
```

## Where Is It? indexOf()

```javascript
const arr = ["a", "b", "c", "b", "d"]

arr.indexOf("b")     // 1 (first occurrence)
arr.indexOf("x")     // -1 (not found)
arr.lastIndexOf("b") // 3 (last occurrence)
```

## Find by Condition: find()

Returns the first element matching a condition.

```javascript
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 25 }
]

const user = users.find(u => u.age === 25)
// { name: "Alice", age: 25 }

const adult = users.find(u => u.name === "Bob")
// { name: "Bob", age: 30 }

const notFound = users.find(u => u.age === 100)
// undefined
```

## Find Index: findIndex()

```javascript
const numbers = [10, 20, 30, 40, 50]

const index = numbers.findIndex(n => n > 25)
// 2 (index of 30)

const notFound = numbers.findIndex(n => n > 100)
// -1
```

## Find All: filter()

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const evens = numbers.filter(n => n % 2 === 0)
// [2, 4, 6, 8, 10]

const users25 = users.filter(u => u.age === 25)
// [{ name: "Alice", age: 25 }, { name: "Charlie", age: 25 }]
```

## Check All/Some: every() and some()

```javascript
const numbers = [2, 4, 6, 8, 10]

numbers.every(n => n % 2 === 0)  // true (all even)
numbers.every(n => n > 5)        // false (2, 4 are ≤ 5)

numbers.some(n => n > 8)         // true (10 > 8)
numbers.some(n => n > 100)       // false (none > 100)
```

## Quick Reference

| Method | Returns | Use When |
|--------|---------|----------|
| includes() | boolean | Check if exists |
| indexOf() | number (-1 if not) | Get position |
| find() | element or undefined | Find first match |
| findIndex() | number (-1 if not) | Find first match position |
| filter() | array | Find all matches |
| some() | boolean | At least one matches |
| every() | boolean | All match |

> **Exercise:** Find all users over 18 from an array of user objects.',
'{"type": "code-editor", "id": "array-searching", "starterCode": "const users = [{name:\"A\",age:15},{name:\"B\",age:25},{name:\"C\",age:17}]\nconst adults = ", "tests": ["adults.length === 1"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('arr-c5', 'arrays', 'array-iteration-methods', 'Iteration Methods', 'forEach, map, filter, reduce', 'crafting', 5, 8, 'Installing the processing tools',
'# Iteration Methods

Powerful methods for processing arrays without manual loops.

## forEach: Do Something with Each

```javascript
const numbers = [1, 2, 3]

numbers.forEach(num => {
    console.log(num * 2)
})
// Logs: 2, 4, 6

// With index
numbers.forEach((num, index) => {
    console.log(`${index}: ${num}`)
})
```

## map: Transform Each Element

Creates a **new array** by transforming each element.

```javascript
const numbers = [1, 2, 3, 4, 5]

const doubled = numbers.map(n => n * 2)
// [2, 4, 6, 8, 10]

const names = ["alice", "bob", "charlie"]
const capitalized = names.map(name => 
    name.charAt(0).toUpperCase() + name.slice(1)
)
// ["Alice", "Bob", "Charlie"]
```

## filter: Keep Matching Elements

Creates a **new array** with elements that pass a test.

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const evens = numbers.filter(n => n % 2 === 0)
// [2, 4, 6, 8, 10]

const bigNumbers = numbers.filter(n => n > 5)
// [6, 7, 8, 9, 10]
```

## reduce: Combine Into One Value

```javascript
const numbers = [1, 2, 3, 4, 5]

// Sum
const sum = numbers.reduce((acc, n) => acc + n, 0)
// 15

// Product
const product = numbers.reduce((acc, n) => acc * n, 1)
// 120

// Build object
const counts = ["a", "b", "a", "c", "b", "a"].reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1
    return acc
}, {})
// { a: 3, b: 2, c: 1 }
```

## Chaining Methods

```javascript
const users = [
    { name: "Alice", age: 25, active: true },
    { name: "Bob", age: 17, active: true },
    { name: "Charlie", age: 30, active: false }
]

// Get names of active adults
const result = users
    .filter(u => u.active)       // Active only
    .filter(u => u.age >= 18)    // Adults only
    .map(u => u.name)            // Just names
// ["Alice"]
```

## When to Use Which

| Method | Use When | Returns |
|--------|----------|---------|
| forEach | Side effects only | undefined |
| map | Transform each → new array | new array |
| filter | Keep some → new array | new array |
| reduce | Combine all → single value | single value |

> **Golden Rule:** Use map/filter/reduce when possible. They''re clearer than loops.',
'{"type": "method-chain-visualizer", "id": "iteration-methods", "data": [1,2,3,4,5], "chain": ["filter", "map", "reduce"]}',
15, 0.5, 0, 1, datetime('now'), datetime('now')),

('arr-c6', 'arrays', 'sorting-reversing', 'Sorting & Reversing', 'Ordering array elements', 'crafting', 6, 9, 'Adding the organizer',
'# Sorting & Reversing

Arranging arrays in order.

## reverse()

Reverses the array **in place** (modifies original).

```javascript
const arr = [1, 2, 3, 4, 5]
arr.reverse()
// arr is now [5, 4, 3, 2, 1]

// To avoid mutation:
const reversed = [...arr].reverse()
```

## sort()

Sorts the array **in place**. ⚠️ Converts to strings by default!

```javascript
const letters = ["c", "a", "b"]
letters.sort()
// ["a", "b", "c"] ✓

// ❌ Numbers don''t work as expected!
const numbers = [10, 2, 30, 1]
numbers.sort()
// ["1", "10", "2", "30"] - String sorting!
```

## Sorting Numbers Correctly

```javascript
const numbers = [10, 2, 30, 1]

// Ascending (small to large)
numbers.sort((a, b) => a - b)
// [1, 2, 10, 30]

// Descending (large to small)
numbers.sort((a, b) => b - a)
// [30, 10, 2, 1]
```

## The Compare Function

```javascript
arr.sort((a, b) => {
    // Return negative: a comes first
    // Return positive: b comes first
    // Return zero: keep current order
})

// Ascending
(a, b) => a - b
// If a < b: negative → a first
// If a > b: positive → b first

// Descending
(a, b) => b - a
// If a < b: positive → b first
// If a > b: negative → a first
```

## Sorting Objects

```javascript
const users = [
    { name: "Charlie", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 }
]

// By age (ascending)
users.sort((a, b) => a.age - b.age)

// By name (alphabetical)
users.sort((a, b) => a.name.localeCompare(b.name))
```

## Immutable Sort

```javascript
const original = [3, 1, 2]

// ❌ Mutates original
original.sort((a, b) => a - b)

// ✅ Creates new sorted array
const sorted = [...original].sort((a, b) => a - b)

// ✅ Modern: toSorted() (ES2023)
const sorted = original.toSorted((a, b) => a - b)
```

> **Always use a compare function for numbers!** Default sort is string-based.',
'{"type": "sort-visualizer", "id": "array-sorting", "algorithms": ["string-sort", "numeric-sort", "custom-sort"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

-- MASTERY PHASE
('arr-m1', 'arrays', 'arrays-cross-language', 'Arrays Across Languages', 'Same concept, different syntax', 'mastery', 1, 10, 'Universal rack installed',
'# Arrays Across Languages

Arrays exist in every language with similar operations but different syntax.

## JavaScript

```javascript
const arr = [1, 2, 3]
arr.length           // 3
arr[0]               // 1
arr.push(4)          // Add to end
arr.map(x => x * 2)  // [2, 4, 6]
```
📖 [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## Python

```python
arr = [1, 2, 3]
len(arr)             # 3
arr[0]               # 1
arr[-1]              # 3 (last element!)
arr.append(4)        # Add to end
[x * 2 for x in arr] # [2, 4, 6] (list comprehension)
```
📖 [Python Docs: Lists](https://docs.python.org/3/tutorial/datastructures.html)

## Go

```go
// Slice (dynamic array)
arr := []int{1, 2, 3}
len(arr)             // 3
arr[0]               // 1
arr = append(arr, 4) // Add to end

// Array (fixed size)
var fixed [3]int = [3]int{1, 2, 3}
```
📖 [Go Tour: Slices](https://go.dev/tour/moretypes/7)

## Key Differences

| Feature | JavaScript | Python | Go |
|---------|------------|--------|-----|
| Negative index | No* | Yes | No |
| Dynamic size | Yes | Yes | Slice: Yes, Array: No |
| Add element | push() | append() | append() |
| Remove last | pop() | pop() | Slice tricks |
| Map/Transform | .map() | Comprehension | Manual loop |

*JavaScript: Use `.at(-1)` for negative indices

## Iteration Syntax

```javascript
// JavaScript
for (const item of arr) { }
arr.forEach(item => { })
```

```python
# Python
for item in arr:
    pass
    
# With index
for i, item in enumerate(arr):
    pass
```

```go
// Go
for i, item := range arr {
    // i is index, item is value
}

// Ignore index
for _, item := range arr {
}
```

> **Insight:** The concepts transfer. Only syntax and method names change.',
'{"type": "language-comparison", "id": "arrays-cross-lang", "languages": ["javascript", "python", "go"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('arr-m2', 'arrays', 'array-patterns', 'Common Array Patterns', 'Industry-standard array operations', 'mastery', 2, 11, 'Production patterns installed',
'# Common Array Patterns

Patterns you''ll use constantly in real code.

## 1. Deduplicate

```javascript
const arr = [1, 2, 2, 3, 3, 3, 4]

// Set automatically removes duplicates
const unique = [...new Set(arr)]
// [1, 2, 3, 4]
```

## 2. Flatten Nested Arrays

```javascript
const nested = [[1, 2], [3, 4], [5, 6]]

// One level
nested.flat()
// [1, 2, 3, 4, 5, 6]

// Multiple levels
const deep = [1, [2, [3, [4]]]]
deep.flat(Infinity)
// [1, 2, 3, 4]
```

## 3. Group By Property

```javascript
const users = [
    { name: "Alice", role: "admin" },
    { name: "Bob", role: "user" },
    { name: "Charlie", role: "admin" }
]

// Modern (ES2023)
const grouped = Object.groupBy(users, u => u.role)
// { admin: [Alice, Charlie], user: [Bob] }

// Manual
const grouped = users.reduce((acc, user) => {
    const key = user.role
    acc[key] = acc[key] || []
    acc[key].push(user)
    return acc
}, {})
```

## 4. Partition (Split by Condition)

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const [evens, odds] = numbers.reduce(
    ([pass, fail], n) => 
        n % 2 === 0 ? [[...pass, n], fail] : [pass, [...fail, n]],
    [[], []]
)
// evens: [2,4,6,8,10], odds: [1,3,5,7,9]
```

## 5. Intersection & Difference

```javascript
const a = [1, 2, 3, 4, 5]
const b = [3, 4, 5, 6, 7]

// Intersection (in both)
const intersection = a.filter(x => b.includes(x))
// [3, 4, 5]

// Difference (in a but not b)
const difference = a.filter(x => !b.includes(x))
// [1, 2]

// Symmetric difference (in one but not both)
const symDiff = a.filter(x => !b.includes(x))
                 .concat(b.filter(x => !a.includes(x)))
// [1, 2, 6, 7]
```

## 6. Chunk Array

```javascript
function chunk(arr, size) {
    const chunks = []
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
    }
    return chunks
}

chunk([1, 2, 3, 4, 5, 6, 7], 3)
// [[1, 2, 3], [4, 5, 6], [7]]
```

## 7. Safe Access

```javascript
const arr = [1, 2, 3]

// ❌ Might crash
const item = arr[10].toString()

// ✅ Safe with optional chaining
const item = arr[10]?.toString()

// ✅ With default
const item = arr[10] ?? "default"
```

> **Pro Tip:** These patterns come up constantly. Bookmark this page!',
'{"type": "pattern-gallery", "id": "array-patterns", "patterns": ["dedupe", "flatten", "group", "partition", "intersect"]}',
15, 1.0, 0, 1, datetime('now'), datetime('now')),

('arr-m3', 'arrays', 'array-pitfalls', 'Array Pitfalls', 'Common mistakes and how to avoid them', 'mastery', 3, 12, 'Safety systems engaged',
'# Array Pitfalls

Mistakes that catch even experienced developers.

## 1. Comparing Arrays

```javascript
// ❌ Doesn''t work!
[1, 2, 3] === [1, 2, 3]  // false (different objects)
[1, 2, 3] == [1, 2, 3]   // false

// ✅ Compare contents
JSON.stringify(a) === JSON.stringify(b)

// Or element by element
a.length === b.length && a.every((v, i) => v === b[i])
```

## 2. Empty Check

```javascript
const arr = []

// ❌ Doesn''t work as expected
if (arr) {
    console.log("Has items")  // Runs! [] is truthy
}

// ✅ Check length
if (arr.length > 0) {
    console.log("Has items")
}

// ✅ Or check length directly
if (arr.length) {
    console.log("Has items")
}
```

## 3. Sparse Arrays (Holes)

```javascript
// ❌ Creates holes
const arr = []
arr[5] = "value"
// [empty × 5, "value"]

arr.length  // 6, but only 1 actual element!

// forEach skips holes
arr.forEach(x => console.log(x))  // Only logs "value"

// map preserves holes
arr.map(x => x)  // [empty × 5, "value"]
```

## 4. Mutation Surprises

```javascript
// ❌ Mutates original
function addItem(arr, item) {
    arr.push(item)
    return arr
}
const original = [1, 2, 3]
const result = addItem(original, 4)
// original is now [1, 2, 3, 4]!

// ✅ Return new array
function addItem(arr, item) {
    return [...arr, item]
}
```

## 5. Sort Mutation

```javascript
// ❌ Mutates original
const arr = [3, 1, 2]
const sorted = arr.sort((a, b) => a - b)
// arr is now [1, 2, 3]!

// ✅ Copy first
const sorted = [...arr].sort((a, b) => a - b)

// ✅ Or use toSorted (ES2023)
const sorted = arr.toSorted((a, b) => a - b)
```

## 6. forEach Doesn''t Return

```javascript
// ❌ forEach returns undefined!
const doubled = [1, 2, 3].forEach(n => n * 2)
// doubled is undefined

// ✅ Use map for transformations
const doubled = [1, 2, 3].map(n => n * 2)
// [2, 4, 6]
```

## 7. Index Out of Bounds

```javascript
const arr = [1, 2, 3]

// ❌ Silent failure
console.log(arr[10])      // undefined (not an error!)
console.log(arr[10] + 1)  // NaN

// ✅ Check first
if (index < arr.length) {
    console.log(arr[index])
}
```

## Prevention Checklist

- [ ] Using === for object comparison? (Use JSON.stringify or loop)
- [ ] Checking array length, not truthiness?
- [ ] Avoiding sparse arrays?
- [ ] Copying before mutating?
- [ ] Using map (not forEach) for transformations?

> **Golden Rule:** When in doubt, copy first.',
'{"type": "bug-hunt", "id": "array-pitfalls", "bugs": ["compare", "empty-check", "mutation", "foreach-return"]}',
15, 1.0, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- OBJECTS: 📋 Blueprint Case (Tier 3 - Bronze)
-- 10 Total Lessons (Summary - less detail to save space)
-- ============================================

INSERT INTO lessons (id, tool_id, slug, title, description, phase, phase_order, sequence_order, metaphor_progress, content_markdown, visual_elements, estimated_minutes, difficulty_modifier, is_premium, is_published, created_at, updated_at)
VALUES
('obj-b1', 'objects', 'why-objects', 'Why Objects?', 'Understanding key-value storage', 'blueprint', 1, 1, 'Understanding structured storage',
'# Why Objects?

Arrays use numbers as indices. Objects use **names** (keys).

## Arrays vs Objects

```javascript
// Array: Access by position
const rgb = [255, 128, 0]
rgb[0]  // Red value... but you need to remember 0 = red

// Object: Access by name
const color = { red: 255, green: 128, blue: 0 }
color.red  // Much clearer!
```

## The Blueprint Case Mental Model

An object is like a **filing cabinet**:
- Each drawer has a **label** (key)
- Each drawer contains a **document** (value)
- You find things by **label**, not position

```
┌──────────────────────────┐
│ color                    │
├──────────────────────────┤
│ red    │ 255            │
├────────┼─────────────────┤
│ green  │ 128            │
├────────┼─────────────────┤
│ blue   │ 0              │
└────────┴─────────────────┘
```

## When to Use Objects

| Data | Best Choice | Why |
|------|-------------|-----|
| List of users | Array | Order matters, same type |
| User profile | Object | Named properties |
| Config settings | Object | Named options |
| Coordinates | Object | { x, y, z } is clear |

> **Key Insight:** Use arrays for lists, objects for structured entities.',
'{"type": "comparison", "id": "arrays-vs-objects", "scenarios": ["ordered-list", "named-properties", "config"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('obj-b2', 'objects', 'object-anatomy', 'Object Anatomy', 'Keys, values, and properties', 'blueprint', 2, 2, 'Labeling the drawers',
'# Object Anatomy

Understanding the parts of an object.

## Structure

```javascript
const person = {
    name: "Alice",     // key: value
    age: 30,           // key: value
    isStudent: false   // key: value
}
```

## Keys (Property Names)

```javascript
// String keys (most common)
const obj = {
    name: "Alice",
    "full-name": "Alice Smith",  // Quoted if contains special chars
    123: "number key"            // Numbers become strings
}
```

## Values (Any Type)

```javascript
const diverse = {
    string: "hello",
    number: 42,
    boolean: true,
    array: [1, 2, 3],
    object: { nested: "value" },
    function: function() { return "hi" },
    nullValue: null
}
```

## Properties

A **property** is a key-value pair:
```javascript
const car = {
    brand: "Toyota",  // brand is a property
    year: 2020        // year is a property
}
```

> **Terminology:** "Object has property X" means the object has key X with some value.',
'{"type": "object-explorer", "id": "object-anatomy", "object": {"name": "Alice", "age": 30, "active": true}}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('obj-c1', 'objects', 'creating-objects', 'Creating Objects', 'Object literals and constructors', 'crafting', 1, 3, 'Building the cabinet',
'# Creating Objects

## Object Literal (Most Common)

```javascript
const user = {
    name: "Alice",
    age: 30,
    email: "alice@example.com"
}
```

## Empty Object

```javascript
const empty = {}
empty.name = "Added later"
```

## From Variables (Shorthand)

```javascript
const name = "Alice"
const age = 30

// Long form
const user = { name: name, age: age }

// Shorthand (when key matches variable name)
const user = { name, age }
```

## Computed Property Names

```javascript
const key = "dynamicKey"
const obj = {
    [key]: "dynamic value",
    [`${key}2`]: "another dynamic"
}
// { dynamicKey: "dynamic value", dynamicKey2: "another dynamic" }
```

## Object.assign & Spread

```javascript
const defaults = { theme: "light", lang: "en" }
const userPrefs = { theme: "dark" }

// Merge (later overwrites earlier)
const settings = { ...defaults, ...userPrefs }
// { theme: "dark", lang: "en" }

// Or with Object.assign
const settings = Object.assign({}, defaults, userPrefs)
```

> **Best Practice:** Use object literals. They''re clear and concise.',
'{"type": "code-editor", "id": "creating-objects", "starterCode": "// Create a book object with title, author, year", "tests": ["book.title", "book.author", "book.year"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('obj-c2', 'objects', 'accessing-properties', 'Accessing Properties', 'Dot notation vs bracket notation', 'crafting', 2, 4, 'Adding access mechanisms',
'# Accessing Properties

Two ways to get and set properties.

## Dot Notation

```javascript
const user = { name: "Alice", age: 30 }

// Reading
user.name      // "Alice"
user.age       // 30

// Writing
user.name = "Bob"
user.email = "bob@example.com"  // Adds new property
```

## Bracket Notation

```javascript
const user = { name: "Alice", age: 30 }

// Reading
user["name"]   // "Alice"
user["age"]    // 30

// Writing
user["name"] = "Bob"
```

## When to Use Which

```javascript
// Dot notation: Clean for known, valid keys
user.name

// Bracket notation: Required for:

// 1. Dynamic keys
const key = "name"
user[key]

// 2. Keys with special characters
user["first-name"]
user["123"]
user["with spaces"]

// 3. Keys that are reserved words
const obj = { class: "A" }
obj["class"]  // Safer than obj.class
```

## Optional Chaining (?.)

Safe access for nested properties:
```javascript
const user = { profile: { name: "Alice" } }

// ❌ Throws if user.profile is undefined
user.profile.name

// ✅ Returns undefined safely
user?.profile?.name
user.address?.street  // undefined, not error
```

> **Rule:** Use dot notation by default. Use brackets for dynamic or special keys.',
'{"type": "comparison", "id": "dot-vs-bracket", "examples": ["static", "dynamic", "special-chars"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('obj-c3', 'objects', 'modifying-objects', 'Modifying Objects', 'Adding, updating, and removing properties', 'crafting', 3, 5, 'Installing modify controls',
'# Modifying Objects

Objects are mutable by default.

## Adding Properties

```javascript
const user = { name: "Alice" }

user.age = 30
user["email"] = "alice@example.com"

// user is now { name: "Alice", age: 30, email: "..." }
```

## Updating Properties

```javascript
const user = { name: "Alice", age: 30 }

user.age = 31           // Update existing
user.age += 1           // Increment
user.name = "Alicia"    // Replace value
```

## Removing Properties

```javascript
const user = { name: "Alice", age: 30, temp: "delete me" }

delete user.temp
// user is now { name: "Alice", age: 30 }
```

## Checking Property Existence

```javascript
const user = { name: "Alice", age: 30 }

// in operator
"name" in user      // true
"email" in user     // false

// hasOwnProperty
user.hasOwnProperty("name")  // true

// Undefined check (careful with intentionally undefined values)
user.name !== undefined  // true
user.email !== undefined // false
```

## Immutable Updates (Spread)

```javascript
const user = { name: "Alice", age: 30 }

// ❌ Mutates original
user.age = 31

// ✅ Creates new object
const updated = { ...user, age: 31 }
// original unchanged, updated has age: 31
```

> **Best Practice:** For state management, prefer immutable updates.',
'{"type": "object-mutator", "id": "modifying-objects", "operations": ["add", "update", "delete"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('obj-c4', 'objects', 'object-iteration', 'Iterating Objects', 'Looping through keys and values', 'crafting', 4, 6, 'Adding the scanner',
'# Iterating Objects

Multiple ways to loop through object properties.

## for...in

```javascript
const user = { name: "Alice", age: 30, city: "NYC" }

for (const key in user) {
    console.log(`${key}: ${user[key]}`)
}
// name: Alice
// age: 30
// city: NYC
```

## Object.keys()

```javascript
const user = { name: "Alice", age: 30 }

Object.keys(user)    // ["name", "age"]
Object.values(user)  // ["Alice", 30]
Object.entries(user) // [["name", "Alice"], ["age", 30]]
```

## Iterating with Object.entries()

```javascript
const user = { name: "Alice", age: 30 }

for (const [key, value] of Object.entries(user)) {
    console.log(`${key}: ${value}`)
}

// Or with forEach
Object.entries(user).forEach(([key, value]) => {
    console.log(`${key}: ${value}`)
})
```

## Transforming Objects

```javascript
const prices = { apple: 1.5, banana: 0.75, cherry: 3.0 }

// Double all prices
const doubled = Object.fromEntries(
    Object.entries(prices).map(([fruit, price]) => [fruit, price * 2])
)
// { apple: 3, banana: 1.5, cherry: 6 }
```

## Object.fromEntries()

Convert entries back to object:
```javascript
const entries = [["a", 1], ["b", 2], ["c", 3]]
const obj = Object.fromEntries(entries)
// { a: 1, b: 2, c: 3 }
```

> **Pattern:** entries → transform → fromEntries for object transformation.',
'{"type": "iteration-visualizer", "id": "object-iteration", "methods": ["for-in", "keys", "values", "entries"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('obj-m1', 'objects', 'objects-cross-language', 'Objects Across Languages', 'Key-value structures in different languages', 'mastery', 1, 7, 'Universal cabinet installed',
'# Objects Across Languages

Every language has key-value data structures.

## JavaScript: Object

```javascript
const user = { name: "Alice", age: 30 }
user.name           // "Alice"
user["name"]        // "Alice"
```
📖 [MDN: Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

## Python: Dictionary

```python
user = {"name": "Alice", "age": 30}
user["name"]        # "Alice"
user.get("name")    # "Alice" (safe access)
user.get("email", "N/A")  # Default value
```
📖 [Python Docs: Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)

## Go: Map and Struct

```go
// Map (dynamic keys)
user := map[string]interface{}{
    "name": "Alice",
    "age":  30,
}
user["name"]  // "Alice"

// Struct (fixed fields)
type User struct {
    Name string
    Age  int
}
user := User{Name: "Alice", Age: 30}
user.Name  // "Alice"
```
📖 [Go Tour: Maps](https://go.dev/tour/moretypes/19)

## Comparison

| Feature | JS Object | Python Dict | Go Map |
|---------|-----------|-------------|--------|
| Syntax | `{}` | `{}` | `map[K]V{}` |
| Access | `.key` or `["key"]` | `["key"]` | `[key]` |
| Safe access | `?.` | `.get()` | `value, ok :=` |
| Iteration | `for...in` | `for k, v in` | `for k, v := range` |

> **Insight:** Same concept, different syntax. Learn once, adapt everywhere.',
'{"type": "language-comparison", "id": "objects-cross-lang", "languages": ["javascript", "python", "go"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- FUNCTIONS: 🛠️ Workbench (Tier 4 - Iron)
-- 14 Total Lessons (Summary - key lessons only)
-- ============================================

INSERT INTO lessons (id, tool_id, slug, title, description, phase, phase_order, sequence_order, metaphor_progress, content_markdown, visual_elements, estimated_minutes, difficulty_modifier, is_premium, is_published, created_at, updated_at)
VALUES
('fn-b1', 'functions', 'why-functions', 'Why Functions?', 'Understanding reusability and abstraction', 'blueprint', 1, 1, 'Understanding the workbench purpose',
'# Why Functions?

Functions are **reusable blocks of code** that perform a specific task.

## The Problem Without Functions

```javascript
// Calculate area of rectangle 1
const width1 = 10, height1 = 5
const area1 = width1 * height1

// Calculate area of rectangle 2
const width2 = 8, height2 = 3
const area2 = width2 * height2

// Same logic repeated!
```

## The Solution: Functions

```javascript
function rectangleArea(width, height) {
    return width * height
}

const area1 = rectangleArea(10, 5)  // 50
const area2 = rectangleArea(8, 3)   // 24
const area3 = rectangleArea(15, 7)  // 105
```

## Benefits

| Without Functions | With Functions |
|------------------|----------------|
| Repeated code | Write once, use anywhere |
| Hard to update | Fix in one place |
| No abstraction | Hide complexity |
| Difficult testing | Test in isolation |

## The Workbench Mental Model

A function is like a **workbench**:
- Put **materials in** (inputs/parameters)
- **Work happens** inside (function body)
- Get **product out** (return value)

```
    ┌─────────────┐
    │  FUNCTION   │
    │             │
───►│  Process    │───►
 in │             │ out
    └─────────────┘
```

> **Key Insight:** Functions turn code into reusable tools.',
'{"type": "comparison", "id": "with-without-functions", "before": "repeated", "after": "function"}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('fn-b2', 'functions', 'function-anatomy', 'Function Anatomy', 'Parameters, body, and return', 'blueprint', 2, 2, 'Designing the workbench layout',
'# Function Anatomy

Every function has these parts.

## The Structure

```javascript
function functionName(parameter1, parameter2) {
    // Function body - the code that runs
    return result  // Optional return value
}
```

## Parts Explained

```javascript
function greet(name, greeting) {
//       │      │      │
//       │      └──────┴── Parameters (inputs)
//       │
//       └── Function name

    const message = `${greeting}, ${name}!`
    //    │
    //    └── Function body (processing)
    
    return message
    //     │
    //     └── Return value (output)
}
```

## Calling (Invoking) a Function

```javascript
const result = greet("Alice", "Hello")
//             │      │        │
//             │      └────────┴── Arguments (actual values)
//             │
//             └── Function call

// result = "Hello, Alice!"
```

## Parameters vs Arguments

- **Parameters**: Variables in function definition
- **Arguments**: Actual values passed when calling

```javascript
function add(a, b) {  // a, b are parameters
    return a + b
}

add(5, 3)  // 5, 3 are arguments
```

> **Remember:** Define with parameters, call with arguments.',
'{"type": "function-visualizer", "id": "function-anatomy", "parts": ["name", "parameters", "body", "return"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('fn-c1', 'functions', 'declaring-functions', 'Declaring Functions', 'Function declarations and expressions', 'crafting', 1, 3, 'Building the workbench frame',
'# Declaring Functions

Multiple ways to create functions in JavaScript.

## Function Declaration

```javascript
function greet(name) {
    return `Hello, ${name}!`
}

// Can be called before declaration (hoisting)
sayHi()  // Works!
function sayHi() {
    console.log("Hi!")
}
```

## Function Expression

```javascript
const greet = function(name) {
    return `Hello, ${name}!`
}

// Cannot be called before declaration
// sayHi()  // Error!
const sayHi = function() {
    console.log("Hi!")
}
```

## Arrow Functions (ES6)

```javascript
// Full syntax
const greet = (name) => {
    return `Hello, ${name}!`
}

// Short syntax (implicit return)
const greet = (name) => `Hello, ${name}!`

// Single parameter (no parentheses needed)
const double = n => n * 2

// No parameters
const sayHi = () => "Hi!"
```

## When to Use Which

| Type | Best For |
|------|----------|
| Declaration | Named, reusable functions |
| Expression | Callbacks, methods |
| Arrow | Short functions, callbacks |

```javascript
// Declaration: Standalone utility
function calculateTax(amount) {
    return amount * 0.08
}

// Arrow: Callback
numbers.map(n => n * 2)

// Arrow: Method in object
const utils = {
    double: (n) => n * 2
}
```

> **Modern Default:** Use arrow functions for most cases.',
'{"type": "syntax-comparison", "id": "function-types", "types": ["declaration", "expression", "arrow"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('fn-c2', 'functions', 'parameters-arguments', 'Parameters & Arguments', 'Working with function inputs', 'crafting', 2, 4, 'Adding input drawers',
'# Parameters & Arguments

Getting data into your functions.

## Basic Parameters

```javascript
function greet(firstName, lastName) {
    return `Hello, ${firstName} ${lastName}!`
}

greet("Alice", "Smith")  // "Hello, Alice Smith!"
```

## Default Parameters

```javascript
function greet(name = "Guest") {
    return `Hello, ${name}!`
}

greet("Alice")  // "Hello, Alice!"
greet()         // "Hello, Guest!"
```

## Rest Parameters

Collect remaining arguments into an array:
```javascript
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0)
}

sum(1, 2, 3)      // 6
sum(1, 2, 3, 4, 5) // 15
```

## Destructuring Parameters

```javascript
// Object destructuring
function greet({ name, age }) {
    return `${name} is ${age} years old`
}
greet({ name: "Alice", age: 30 })

// Array destructuring
function getFirst([first, second]) {
    return first
}
getFirst([1, 2, 3])  // 1
```

## Named Arguments (Object Pattern)

```javascript
// Many parameters? Use an object
function createUser({ name, email, age = 0, role = "user" }) {
    return { name, email, age, role }
}

createUser({ 
    name: "Alice", 
    email: "alice@example.com",
    role: "admin"
})
```

> **Best Practice:** Use defaults, destructuring, and objects for clarity.',
'{"type": "code-editor", "id": "parameters", "starterCode": "// Create a function with defaults and rest params", "tests": ["function-works"]}',
12, 0, 0, 1, datetime('now'), datetime('now')),

('fn-c3', 'functions', 'return-values', 'Return Values', 'Getting data out of functions', 'crafting', 3, 5, 'Installing the output chute',
'# Return Values

Functions can produce output.

## Basic Return

```javascript
function add(a, b) {
    return a + b  // Function ends, sends value back
}

const sum = add(5, 3)  // sum = 8
```

## Return Ends Execution

```javascript
function checkAge(age) {
    if (age < 0) {
        return "Invalid age"  // Exit early
    }
    if (age < 18) {
        return "Minor"
    }
    return "Adult"  // Final return
}
```

## Returning Objects

```javascript
function createUser(name, email) {
    return {
        name,
        email,
        createdAt: new Date()
    }
}

// Note: Wrap object in parentheses for arrow functions
const createUser = (name, email) => ({
    name,
    email,
    createdAt: new Date()
})
```

## Multiple Values (Return Object or Array)

```javascript
// Return object (named values)
function getMinMax(numbers) {
    return {
        min: Math.min(...numbers),
        max: Math.max(...numbers)
    }
}
const { min, max } = getMinMax([3, 1, 4, 1, 5])

// Return array (positional)
function getMinMax(numbers) {
    return [Math.min(...numbers), Math.max(...numbers)]
}
const [min, max] = getMinMax([3, 1, 4, 1, 5])
```

## No Return = undefined

```javascript
function sayHi() {
    console.log("Hi!")
    // No return statement
}

const result = sayHi()  // result = undefined
```

> **Principle:** Functions should either return a value OR cause side effects, rarely both.',
'{"type": "return-visualizer", "id": "return-values", "scenarios": ["simple", "early-exit", "object", "multiple"]}',
10, 0, 0, 1, datetime('now'), datetime('now')),

('fn-m1', 'functions', 'functions-cross-language', 'Functions Across Languages', 'Same concept, different syntax', 'mastery', 1, 10, 'Universal workbench installed',
'# Functions Across Languages

Functions exist in every language.

## JavaScript

```javascript
function greet(name) {
    return `Hello, ${name}!`
}

const greet = (name) => `Hello, ${name}!`
```
📖 [MDN: Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

## Python

```python
def greet(name):
    return f"Hello, {name}!"

# Lambda (single expression)
greet = lambda name: f"Hello, {name}!"
```
📖 [Python Docs: Functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)

## Go

```go
func greet(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}

// Anonymous function
greet := func(name string) string {
    return fmt.Sprintf("Hello, %s!", name)
}
```
📖 [Go Tour: Functions](https://go.dev/tour/basics/4)

## Comparison

| Feature | JavaScript | Python | Go |
|---------|------------|--------|-----|
| Keyword | `function` | `def` | `func` |
| Arrow/Lambda | `=>` | `lambda` | Anonymous func |
| Return type | Implicit | Implicit | Explicit |
| Default params | Yes | Yes | No* |
| Multiple returns | Via object/array | Via tuple | Built-in |

*Go uses variadic or option structs instead

> **Key Pattern:** Function = name + parameters + body + return. Everywhere.',
'{"type": "language-comparison", "id": "functions-cross-lang", "languages": ["javascript", "python", "go"]}',
12, 0.5, 0, 1, datetime('now'), datetime('now')),

('fn-m2', 'functions', 'single-responsibility', 'Single Responsibility', 'One function, one job', 'mastery', 2, 11, 'Focus lens installed',
'# Single Responsibility Principle

A function should do **one thing** and do it well.

## Bad: Does Too Much

```javascript
function processUser(userData) {
    // Validates
    if (!userData.email.includes("@")) {
        throw new Error("Invalid email")
    }
    
    // Formats
    userData.name = userData.name.trim().toLowerCase()
    
    // Saves to database
    database.users.insert(userData)
    
    // Sends email
    emailService.send(userData.email, "Welcome!")
    
    // Logs
    logger.info(`Created user: ${userData.email}`)
    
    return userData
}
```

## Good: Single Responsibilities

```javascript
function validateEmail(email) {
    if (!email.includes("@")) {
        throw new Error("Invalid email")
    }
}

function formatUserData(data) {
    return {
        ...data,
        name: data.name.trim().toLowerCase()
    }
}

function saveUser(data) {
    return database.users.insert(data)
}

function sendWelcomeEmail(email) {
    emailService.send(email, "Welcome!")
}

// Compose them
function createUser(userData) {
    validateEmail(userData.email)
    const formatted = formatUserData(userData)
    const saved = saveUser(formatted)
    sendWelcomeEmail(saved.email)
    return saved
}
```

## Benefits

| Monolithic | Single Responsibility |
|------------|----------------------|
| Hard to test | Test each function |
| Hard to reuse | Reuse validateEmail elsewhere |
| Hard to debug | Know exactly where bug is |
| Hard to modify | Change one thing, one place |

## How to Know If It''s One Thing

- Can you describe it without "and"?
- ❌ "Validates **and** saves **and** emails"
- ✅ "Validates email format"

> **Mantra:** If you need "and" to describe it, split it.',
'{"type": "refactor-challenge", "id": "single-responsibility", "before": "monolithic", "after": "split"}',
15, 1.0, 0, 1, datetime('now'), datetime('now'));
