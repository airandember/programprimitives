-- Seed data for ProgramPrimitives
-- Initial primitives and exercises

-- ============================================
-- Fundamentals Category
-- ============================================

INSERT INTO primitives (id, name, category, subcategory, description, why_it_matters, best_practices, pitfalls, difficulty, prerequisites, related, icon, category_order, is_premium, is_published, created_at, updated_at)
VALUES 
('variables', 'Variables', 'fundamentals', 'basics', 
 'Named storage locations that hold data values', 
 'Variables are the foundation of all programming. They allow you to store, retrieve, and manipulate data throughout your program.',
 '["Use descriptive names that indicate purpose", "Follow naming conventions (camelCase, snake_case)", "Initialize variables before use", "Use const/final for values that won''t change"]',
 '["Using single-letter names except for loop counters", "Shadowing variables in nested scopes", "Not initializing before use", "Using var when let/const is better (JS)"]',
 1, '[]', '["operators", "data-types"]', 'variable', 1, 0, 1, datetime('now'), datetime('now')),

('operators', 'Operators', 'fundamentals', 'basics',
 'Symbols that perform operations on values and variables',
 'Operators let you manipulate data - from simple math to complex logical decisions. Understanding them is essential for any computation.',
 '["Use parentheses for clarity in complex expressions", "Understand operator precedence", "Use === over == in JavaScript for type safety", "Be careful with floating point comparisons"]',
 '["Confusing = (assignment) with == (comparison)", "Integer division truncation", "Short-circuit evaluation surprises", "Operator precedence mistakes"]',
 1, '["variables"]', '["conditionals", "expressions"]', 'operator', 2, 0, 1, datetime('now'), datetime('now')),

('conditionals', 'Conditionals', 'fundamentals', 'control-flow',
 'Execute different code based on whether conditions are true or false',
 'Conditionals let your program make decisions. They''re how you handle different scenarios and respond to user input or data state.',
 '["Keep conditions simple and readable", "Use early returns to reduce nesting", "Consider switch for multiple discrete values", "Always handle the else case, even if empty"]',
 '["Deeply nested if statements", "Using == instead of === in JS", "Forgetting break in switch cases", "Not considering all edge cases"]',
 1, '["variables", "operators"]', '["switch", "ternary"]', 'condition', 3, 0, 1, datetime('now'), datetime('now')),

('for-loop', 'For Loop', 'fundamentals', 'loops',
 'Execute code a specific number of times with a counter',
 'For loops are essential for processing collections, repeating operations, and iterating through data. They''re one of the most frequently used constructs.',
 '["Use meaningful iterator variable names", "Avoid modifying loop variable inside the loop", "Consider forEach/map for array iteration", "Keep loop bodies focused"]',
 '["Off-by-one errors (i <= n vs i < n)", "Infinite loops when condition never false", "Modifying array length while iterating", "Using var instead of let in JS"]',
 2, '["variables", "operators", "conditionals"]', '["while-loop", "foreach", "array-iteration"]', 'loop', 4, 0, 1, datetime('now'), datetime('now')),

('while-loop', 'While Loop', 'fundamentals', 'loops',
 'Execute code repeatedly while a condition remains true',
 'While loops are perfect when you don''t know how many iterations you need. They continue until a condition changes.',
 '["Ensure the condition will eventually become false", "Consider do-while when you need at least one iteration", "Update loop variables inside the loop", "Add safety limits for potentially infinite loops"]',
 '["Forgetting to update the condition variable", "Creating infinite loops", "Off-by-one errors", "Using while when for is clearer"]',
 2, '["variables", "operators", "conditionals"]', '["for-loop", "do-while"]', 'loop', 5, 0, 1, datetime('now'), datetime('now')),

('functions', 'Functions', 'fundamentals', 'modularity',
 'Reusable blocks of code that perform specific tasks',
 'Functions are the building blocks of organized code. They promote reuse, testing, and make complex programs manageable.',
 '["Single responsibility - one function, one job", "Use descriptive names that indicate action", "Keep functions short (under 20 lines ideal)", "Document parameters and return values"]',
 '["Functions that do too many things", "Side effects that aren''t obvious", "Too many parameters", "Not handling edge cases"]',
 2, '["variables", "operators"]', '["parameters", "return-values", "scope"]', 'function', 6, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- Data Structures Category
-- ============================================

INSERT INTO primitives (id, name, category, subcategory, description, why_it_matters, best_practices, pitfalls, difficulty, prerequisites, related, icon, category_order, is_premium, is_published, created_at, updated_at)
VALUES 
('arrays', 'Arrays', 'data-structures', 'linear',
 'Ordered collections of elements accessed by index',
 'Arrays are fundamental for storing lists of data. They''re used everywhere - from user lists to game high scores to shopping carts.',
 '["Use meaningful variable names", "Check bounds before accessing", "Consider using array methods over manual loops", "Initialize with appropriate size when possible"]',
 '["Index out of bounds errors", "Mutating arrays when you shouldn''t", "Confusing array methods (splice vs slice)", "Off-by-one with array length"]',
 2, '["variables", "for-loop"]', '["array-methods", "iteration", "lists"]', 'array', 1, 0, 1, datetime('now'), datetime('now')),

('objects', 'Objects / Dictionaries', 'data-structures', 'associative',
 'Collections of key-value pairs for structured data',
 'Objects let you group related data together with meaningful names. They''re essential for representing real-world entities in code.',
 '["Use descriptive key names", "Keep objects focused on one concept", "Use dot notation when possible", "Consider immutability for shared state"]',
 '["Accessing non-existent keys", "Mutating shared objects", "Deep vs shallow copy confusion", "Using objects when arrays are better"]',
 2, '["variables", "arrays"]', '["classes", "json", "maps"]', 'object', 2, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- Primitive Syntax Examples
-- ============================================

INSERT INTO primitive_syntax (id, primitive_id, language, syntax_template, full_example, explanation, variations, is_primary, created_at, updated_at)
VALUES
-- For Loop - JavaScript
(lower(hex(randomblob(16))), 'for-loop', 'javascript',
 'for (let i = 0; i < count; i++) {\n  // code\n}',
 'for (let i = 0; i < 5; i++) {\n  console.log(`Iteration ${i}`);\n}\n// Output: Iteration 0, 1, 2, 3, 4',
 'Initialization (let i = 0) runs once. Condition (i < 5) checks before each iteration. Update (i++) runs after each iteration.',
 '["for (let i = arr.length - 1; i >= 0; i--) // reverse", "for (let i = 0; i < arr.length; i += 2) // skip"]',
 1, datetime('now'), datetime('now')),

-- For Loop - Python  
(lower(hex(randomblob(16))), 'for-loop', 'python',
 'for i in range(count):\n    # code',
 'for i in range(5):\n    print(f"Iteration {i}")\n# Output: Iteration 0, 1, 2, 3, 4',
 'range(5) generates numbers 0-4. Python uses indentation instead of braces. The variable i automatically iterates through each value.',
 '["for i in range(start, end) # custom range", "for i in range(start, end, step) # with step", "for i in reversed(range(5)) # reverse"]',
 1, datetime('now'), datetime('now')),

-- For Loop - Go
(lower(hex(randomblob(16))), 'for-loop', 'go',
 'for i := 0; i < count; i++ {\n    // code\n}',
 'for i := 0; i < 5; i++ {\n    fmt.Printf("Iteration %d\\n", i)\n}\n// Output: Iteration 0, 1, 2, 3, 4',
 ':= declares and initializes i. Go only has for loops (no while). Braces are required even for single statements.',
 '["for i := range slice // range over slice", "for key, value := range map // range over map", "for { } // infinite loop"]',
 1, datetime('now'), datetime('now')),

-- Variables - JavaScript
(lower(hex(randomblob(16))), 'variables', 'javascript',
 'let name = value;\nconst name = value;',
 'let count = 0;        // Can be reassigned\nconst MAX = 100;      // Cannot be reassigned\nlet name = "Alice";   // String\nlet active = true;    // Boolean',
 'Use let for values that change, const for constants. JavaScript is dynamically typed - no need to declare types.',
 '["var name = value // old way, avoid", "let a, b, c; // multiple declarations"]',
 1, datetime('now'), datetime('now')),

-- Variables - Python
(lower(hex(randomblob(16))), 'variables', 'python',
 'name = value',
 'count = 0           # Integer\nMAX = 100           # Convention: UPPERCASE for constants\nname = "Alice"      # String\nactive = True       # Boolean (capital T)',
 'Python uses dynamic typing - just assign a value. Constants are by convention (UPPERCASE) but not enforced.',
 '["a, b = 1, 2 # multiple assignment", "a = b = c = 0 # same value to multiple"]',
 1, datetime('now'), datetime('now')),

-- Functions - JavaScript
(lower(hex(randomblob(16))), 'functions', 'javascript',
 'function name(params) {\n  // code\n  return value;\n}',
 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst result = greet("Alice");\nconsole.log(result); // "Hello, Alice!"',
 'function keyword declares a function. Parameters are inputs. return sends back a value. Call with functionName(args).',
 '["const fn = (x) => x * 2; // arrow function", "const fn = function(x) { }; // function expression"]',
 1, datetime('now'), datetime('now')),

-- Functions - Python
(lower(hex(randomblob(16))), 'functions', 'python',
 'def name(params):\n    # code\n    return value',
 'def greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("Alice")\nprint(result)  # "Hello, Alice!"',
 'def keyword declares a function. Colon starts the body. Indentation defines scope. return sends back a value.',
 '["def fn(x=10): # default parameter", "def fn(*args): # variable arguments", "lambda x: x * 2 # anonymous function"]',
 1, datetime('now'), datetime('now'));

-- ============================================
-- Sample Exercises
-- ============================================

INSERT INTO exercises (id, primitive_id, title, slug, description, difficulty, estimated_minutes, instructions, hints, sequence_order, is_premium, is_published, created_at, updated_at)
VALUES
(lower(hex(randomblob(16))), 'for-loop', 'Sum of Numbers', 'sum-of-numbers',
 'Calculate the sum of all numbers from 1 to n using a for loop',
 2, 5,
 '## Your Task\n\nCreate a function `sumToN(n)` that returns the sum of all integers from 1 to n.\n\n### Requirements\n- Use a for loop (not a mathematical formula)\n- Handle edge cases (n < 1 should return 0)\n\n### Examples\n```\nsumToN(5)  → 15   // 1+2+3+4+5 = 15\nsumToN(10) → 55\nsumToN(0)  → 0\nsumToN(-5) → 0\n```',
 '["Start with a variable to store your running total, initialized to 0", "Loop from 1 to n (inclusive) using i <= n", "Add each number i to your total inside the loop", "Don''t forget to check if n < 1 at the start"]',
 1, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'for-loop', 'Array Sum', 'array-sum',
 'Calculate the sum of all elements in an array',
 2, 5,
 '## Your Task\n\nCreate a function `arraySum(arr)` that returns the sum of all numbers in the array.\n\n### Requirements\n- Use a for loop to iterate through the array\n- Handle empty arrays (return 0)\n\n### Examples\n```\narraySum([1, 2, 3, 4, 5]) → 15\narraySum([10, 20, 30])    → 60\narraySum([])              → 0\n```',
 '["Initialize a sum variable to 0", "Loop from i = 0 to i < arr.length", "Access each element with arr[i]", "Add each element to your sum"]',
 2, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'for-loop', 'Multiplication Table', 'multiplication-table',
 'Generate a multiplication table for a given number',
 3, 10,
 '## Your Task\n\nCreate a function `multiplicationTable(n, limit)` that returns an array containing the multiplication table for n, up to limit.\n\n### Requirements\n- Use a for loop\n- Return an array of results\n\n### Examples\n```\nmultiplicationTable(5, 3) → [5, 10, 15]\nmultiplicationTable(7, 5) → [7, 14, 21, 28, 35]\nmultiplicationTable(3, 1) → [3]\n```',
 '["Create an empty array to store results", "Loop from 1 to limit (inclusive)", "Multiply n by the current loop counter", "Push each product to your array"]',
 3, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'variables', 'Variable Swap', 'variable-swap',
 'Swap the values of two variables',
 1, 3,
 '## Your Task\n\nCreate a function `swap(a, b)` that returns an array with the values swapped.\n\n### Requirements\n- Use a temporary variable\n- Return [b, a]\n\n### Examples\n```\nswap(1, 2) → [2, 1]\nswap("hello", "world") → ["world", "hello"]\n```',
 '["You''ll need a third variable to temporarily hold one value", "Store a in temp, then assign b to a, then assign temp to b", "Return the swapped values as an array"]',
 1, 0, 1, datetime('now'), datetime('now')),

(lower(hex(randomblob(16))), 'functions', 'Temperature Converter', 'temperature-converter',
 'Convert temperatures between Celsius and Fahrenheit',
 2, 8,
 '## Your Task\n\nCreate two functions:\n- `celsiusToFahrenheit(c)` - converts Celsius to Fahrenheit\n- `fahrenheitToCelsius(f)` - converts Fahrenheit to Celsius\n\n### Formulas\n- F = (C × 9/5) + 32\n- C = (F - 32) × 5/9\n\n### Examples\n```\ncelsiusToFahrenheit(0)   → 32\ncelsiusToFahrenheit(100) → 212\nfahrenheitToCelsius(32)  → 0\nfahrenheitToCelsius(212) → 100\n```',
 '["Apply the formula directly in your return statement", "Be careful with the order of operations", "Test with known values: 0°C = 32°F, 100°C = 212°F"]',
 1, 0, 1, datetime('now'), datetime('now'));

-- ============================================
-- Exercise Starter Code
-- ============================================

INSERT INTO exercise_starter_code (id, exercise_id, language, starter_code, solution_code, created_at, updated_at)
SELECT 
    lower(hex(randomblob(16))),
    e.id,
    'javascript',
    CASE e.slug
        WHEN 'sum-of-numbers' THEN 'function sumToN(n) {\n  // Your code here\n  \n}'
        WHEN 'array-sum' THEN 'function arraySum(arr) {\n  // Your code here\n  \n}'
        WHEN 'multiplication-table' THEN 'function multiplicationTable(n, limit) {\n  // Your code here\n  \n}'
        WHEN 'variable-swap' THEN 'function swap(a, b) {\n  // Your code here\n  \n}'
        WHEN 'temperature-converter' THEN 'function celsiusToFahrenheit(c) {\n  // Your code here\n}\n\nfunction fahrenheitToCelsius(f) {\n  // Your code here\n}'
    END,
    CASE e.slug
        WHEN 'sum-of-numbers' THEN 'function sumToN(n) {\n  if (n < 1) return 0;\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum += i;\n  }\n  return sum;\n}'
        WHEN 'array-sum' THEN 'function arraySum(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}'
        WHEN 'multiplication-table' THEN 'function multiplicationTable(n, limit) {\n  const result = [];\n  for (let i = 1; i <= limit; i++) {\n    result.push(n * i);\n  }\n  return result;\n}'
        WHEN 'variable-swap' THEN 'function swap(a, b) {\n  let temp = a;\n  a = b;\n  b = temp;\n  return [a, b];\n}'
        WHEN 'temperature-converter' THEN 'function celsiusToFahrenheit(c) {\n  return (c * 9/5) + 32;\n}\n\nfunction fahrenheitToCelsius(f) {\n  return (f - 32) * 5/9;\n}'
    END,
    datetime('now'),
    datetime('now')
FROM exercises e
WHERE e.slug IN ('sum-of-numbers', 'array-sum', 'multiplication-table', 'variable-swap', 'temperature-converter');

-- Python starter code
INSERT INTO exercise_starter_code (id, exercise_id, language, starter_code, solution_code, created_at, updated_at)
SELECT 
    lower(hex(randomblob(16))),
    e.id,
    'python',
    CASE e.slug
        WHEN 'sum-of-numbers' THEN 'def sum_to_n(n):\n    # Your code here\n    pass'
        WHEN 'array-sum' THEN 'def array_sum(arr):\n    # Your code here\n    pass'
        WHEN 'multiplication-table' THEN 'def multiplication_table(n, limit):\n    # Your code here\n    pass'
        WHEN 'variable-swap' THEN 'def swap(a, b):\n    # Your code here\n    pass'
        WHEN 'temperature-converter' THEN 'def celsius_to_fahrenheit(c):\n    # Your code here\n    pass\n\ndef fahrenheit_to_celsius(f):\n    # Your code here\n    pass'
    END,
    CASE e.slug
        WHEN 'sum-of-numbers' THEN 'def sum_to_n(n):\n    if n < 1:\n        return 0\n    total = 0\n    for i in range(1, n + 1):\n        total += i\n    return total'
        WHEN 'array-sum' THEN 'def array_sum(arr):\n    total = 0\n    for num in arr:\n        total += num\n    return total'
        WHEN 'multiplication-table' THEN 'def multiplication_table(n, limit):\n    result = []\n    for i in range(1, limit + 1):\n        result.append(n * i)\n    return result'
        WHEN 'variable-swap' THEN 'def swap(a, b):\n    temp = a\n    a = b\n    b = temp\n    return [a, b]'
        WHEN 'temperature-converter' THEN 'def celsius_to_fahrenheit(c):\n    return (c * 9/5) + 32\n\ndef fahrenheit_to_celsius(f):\n    return (f - 32) * 5/9'
    END,
    datetime('now'),
    datetime('now')
FROM exercises e
WHERE e.slug IN ('sum-of-numbers', 'array-sum', 'multiplication-table', 'variable-swap', 'temperature-converter');

-- ============================================
-- Achievements
-- ============================================

INSERT INTO achievements (id, name, description, category, icon, xp_reward, rarity, trigger_condition, created_at)
VALUES
(lower(hex(randomblob(16))), 'First Steps', 'Complete your first exercise', 'milestone', '👣', 50, 'common', '{"type": "exercises_completed", "count": 1}', datetime('now')),
(lower(hex(randomblob(16))), 'Getting Started', 'Complete 5 exercises', 'milestone', '🚀', 100, 'common', '{"type": "exercises_completed", "count": 5}', datetime('now')),
(lower(hex(randomblob(16))), 'Practice Makes Perfect', 'Complete 25 exercises', 'milestone', '💪', 250, 'rare', '{"type": "exercises_completed", "count": 25}', datetime('now')),
(lower(hex(randomblob(16))), 'Century Club', 'Complete 100 exercises', 'milestone', '🏆', 500, 'epic', '{"type": "exercises_completed", "count": 100}', datetime('now')),

(lower(hex(randomblob(16))), 'Streak Starter', '7-day streak', 'consistency', '🔥', 100, 'common', '{"type": "streak", "days": 7}', datetime('now')),
(lower(hex(randomblob(16))), 'Week Warrior', '14-day streak', 'consistency', '⚔️', 200, 'rare', '{"type": "streak", "days": 14}', datetime('now')),
(lower(hex(randomblob(16))), 'Month Master', '30-day streak', 'consistency', '👑', 500, 'epic', '{"type": "streak", "days": 30}', datetime('now')),
(lower(hex(randomblob(16))), 'Year of Code', '365-day streak', 'consistency', '🌟', 2000, 'legendary', '{"type": "streak", "days": 365}', datetime('now')),

(lower(hex(randomblob(16))), 'Loop Legend', 'Master all loop primitives', 'mastery', '🔄', 300, 'rare', '{"type": "primitive_mastery", "category": "loops", "level": 5}', datetime('now')),
(lower(hex(randomblob(16))), 'Function Fanatic', 'Master all function primitives', 'mastery', '⚡', 300, 'rare', '{"type": "primitive_mastery", "category": "functions", "level": 5}', datetime('now')),
(lower(hex(randomblob(16))), 'Data Wizard', 'Master all data structure primitives', 'mastery', '📊', 400, 'epic', '{"type": "primitive_mastery", "category": "data-structures", "level": 5}', datetime('now')),

(lower(hex(randomblob(16))), 'Polyglot', 'Use 3 different languages', 'skill', '🌍', 150, 'rare', '{"type": "languages_used", "count": 3}', datetime('now')),
(lower(hex(randomblob(16))), 'Speed Demon', 'Complete an exercise in under 1 minute', 'skill', '⏱️', 100, 'rare', '{"type": "time_under", "seconds": 60}', datetime('now')),
(lower(hex(randomblob(16))), 'Perfect Score', 'Get 100% on first attempt', 'skill', '💯', 75, 'common', '{"type": "first_try_perfect", "count": 1}', datetime('now')),
(lower(hex(randomblob(16))), 'No Hints Needed', 'Complete 10 exercises without hints', 'skill', '🧠', 200, 'rare', '{"type": "no_hints", "count": 10}', datetime('now'));

