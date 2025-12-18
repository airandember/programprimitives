// ============================================
// Primitives Seed Data - Frontend Version
// ============================================

import type { Primitive, PrimitiveSyntax } from '@braids/core/types';

export const ALL_PRIMITIVES: Primitive[] = [
	// ============================================
	// FUNDAMENTALS - Variables
	// ============================================
	{
		id: 'variables',
		name: 'Variables',
		category: 'fundamentals',
		subcategory: 'basics',
		difficulty: 1,
		icon: '📦',
		description: 'Named storage locations that hold data values',
		whyItMatters: `Variables are the foundation of programming. They let you store, reference, and manipulate data throughout your program. Understanding variables means understanding how computers remember things.`,
		bestPractices: [
			'Use descriptive names that explain the variable\'s purpose',
			'Follow your language\'s naming conventions (camelCase, snake_case)',
			'Initialize variables when you declare them when possible',
			'Keep variable scope as small as needed',
		],
		pitfalls: [
			'Using single-letter names except for loop counters',
			'Reusing variables for different purposes',
			'Forgetting that some languages have mutable vs immutable variables',
			'Not understanding variable hoisting in JavaScript',
		],
		prerequisites: [],
		related: ['constants', 'data-types'],
		isPremium: false,
	},

	// ============================================
	// FUNDAMENTALS - Conditionals
	// ============================================
	{
		id: 'conditionals',
		name: 'Conditionals',
		category: 'fundamentals',
		subcategory: 'control-flow',
		difficulty: 1,
		icon: '🔀',
		description: 'Execute different code based on whether conditions are true or false',
		whyItMatters: `Conditionals give your program decision-making ability. They're how programs respond differently to different inputs - the difference between a calculator that just adds and one that can add, subtract, multiply, or divide based on what you choose.`,
		bestPractices: [
			'Keep conditions simple and readable',
			'Handle the most common case first',
			'Use early returns to reduce nesting',
			'Consider using switch for multiple specific values',
		],
		pitfalls: [
			'Deeply nested if/else chains (pyramid of doom)',
			'Using = instead of == for comparison',
			'Forgetting to handle the else case',
			'Complex boolean expressions without parentheses',
		],
		prerequisites: ['variables'],
		related: ['switch', 'ternary'],
		isPremium: false,
	},

	// ============================================
	// FUNDAMENTALS - For Loop
	// ============================================
	{
		id: 'for-loop',
		name: 'For Loop',
		category: 'fundamentals',
		subcategory: 'iteration',
		difficulty: 2,
		icon: '🔄',
		description: 'Execute code a specific number of times with a counter',
		whyItMatters: `For loops are your go-to when you know exactly how many times to repeat something. Processing every item in a list? Counting from 1 to 100? Generating a pattern? That's for loop territory. They're one of the most-used constructs in programming.`,
		bestPractices: [
			'Use meaningful iterator names (i for index is fine, but item for items)',
			'Don\'t modify the loop variable inside the loop',
			'Consider forEach/map for array iteration in modern languages',
			'Keep loop bodies focused on one task',
		],
		pitfalls: [
			'Off-by-one errors (i <= n vs i < n)',
			'Infinite loops when condition never becomes false',
			'Modifying array length while iterating',
			'Confusing loop counter scope',
		],
		prerequisites: ['variables', 'conditionals'],
		related: ['while-loop', 'foreach', 'arrays'],
		isPremium: false,
	},

	// ============================================
	// FUNDAMENTALS - While Loop
	// ============================================
	{
		id: 'while-loop',
		name: 'While Loop',
		category: 'fundamentals',
		subcategory: 'iteration',
		difficulty: 2,
		icon: '🔁',
		description: 'Execute code repeatedly while a condition remains true',
		whyItMatters: `While loops shine when you don't know in advance how many iterations you need. Reading user input until they type 'quit'? Searching for something in data? Processing a queue until it's empty? While loops handle uncertainty gracefully.`,
		bestPractices: [
			'Always ensure the condition can eventually become false',
			'Update the condition variable inside the loop',
			'Consider do-while when you need at least one execution',
			'Keep the condition simple and obvious',
		],
		pitfalls: [
			'Infinite loops (forgetting to update condition)',
			'Off-by-one errors in the condition',
			'Complex conditions that are hard to reason about',
			'Not handling edge cases (empty input, zero iterations)',
		],
		prerequisites: ['variables', 'conditionals'],
		related: ['for-loop', 'do-while', 'break-continue'],
		isPremium: false,
	},

	// ============================================
	// FUNDAMENTALS - Functions
	// ============================================
	{
		id: 'functions',
		name: 'Functions',
		category: 'fundamentals',
		subcategory: 'abstraction',
		difficulty: 2,
		icon: '⚡',
		description: 'Reusable blocks of code that perform specific tasks',
		whyItMatters: `Functions are how you organize and reuse code. Instead of copying the same 10 lines everywhere, write them once in a function. They make code readable (what does calculateTax() do? exactly what it says), testable, and maintainable.`,
		bestPractices: [
			'One function, one purpose (Single Responsibility)',
			'Use descriptive names that describe what it does',
			'Keep functions short (under 20-30 lines ideally)',
			'Minimize side effects - prefer returning values',
		],
		pitfalls: [
			'Functions that do too many things',
			'Deeply nested function calls',
			'Not handling edge cases or invalid inputs',
			'Relying on global state instead of parameters',
		],
		prerequisites: ['variables'],
		related: ['parameters', 'return-values', 'scope'],
		isPremium: false,
	},

	// ============================================
	// DATA STRUCTURES - Arrays
	// ============================================
	{
		id: 'arrays',
		name: 'Arrays',
		category: 'data-structures',
		subcategory: 'collections',
		difficulty: 2,
		icon: '📊',
		description: 'Ordered collections of elements accessed by index',
		whyItMatters: `Arrays are everywhere. User lists, shopping carts, search results, image pixels - all arrays. Understanding arrays means understanding how to work with collections of data, which is most of what programs do.`,
		bestPractices: [
			'Use meaningful names that indicate what\'s stored',
			'Check bounds before accessing by index',
			'Prefer array methods (map, filter) over manual loops',
			'Consider if you need an array or a different data structure',
		],
		pitfalls: [
			'Index out of bounds errors',
			'Modifying arrays while iterating',
			'Confusing length with last index (length - 1)',
			'Not understanding reference vs copy behavior',
		],
		prerequisites: ['variables', 'for-loop'],
		related: ['foreach', 'map-filter', 'objects'],
		isPremium: false,
	},

	// ============================================
	// DATA STRUCTURES - Objects
	// ============================================
	{
		id: 'objects',
		name: 'Objects',
		category: 'data-structures',
		subcategory: 'collections',
		difficulty: 2,
		icon: '🗃️',
		description: 'Collections of key-value pairs for structured data',
		whyItMatters: `Objects let you group related data together. A user isn't just a name - they have an email, age, preferences. Objects model real-world things in code, making your data meaningful and organized.`,
		bestPractices: [
			'Use objects to group related data',
			'Keep objects focused (don\'t put everything in one)',
			'Use consistent naming for keys',
			'Consider immutability for predictable code',
		],
		pitfalls: [
			'Accessing undefined properties without checking',
			'Mutating objects unexpectedly (reference issues)',
			'Deeply nested objects that are hard to work with',
			'Confusing object equality (reference vs value)',
		],
		prerequisites: ['variables', 'arrays'],
		related: ['arrays', 'classes', 'json'],
		isPremium: false,
	},

	// ============================================
	// ITERATION - forEach
	// ============================================
	{
		id: 'foreach',
		name: 'ForEach',
		category: 'iteration',
		subcategory: 'array-methods',
		difficulty: 2,
		icon: '🔂',
		description: 'Execute a function for each element in an array',
		whyItMatters: `forEach is the modern way to iterate arrays. It's cleaner than manual for loops, less error-prone (no off-by-one errors), and expresses intent clearly: "do this for each item."`,
		bestPractices: [
			'Use forEach when you need side effects (logging, updating)',
			'Use map/filter when transforming data',
			'Keep the callback function simple',
			'Consider regular for loop if you need break/continue',
		],
		pitfalls: [
			'Can\'t break out early (use for...of or find instead)',
			'Doesn\'t return a new array (use map for that)',
			'Async callbacks don\'t work as expected',
			'Using forEach when map or filter is more appropriate',
		],
		prerequisites: ['arrays', 'functions'],
		related: ['for-loop', 'map-filter', 'reduce'],
		isPremium: false,
	},

	// ============================================
	// ITERATION - Map & Filter
	// ============================================
	{
		id: 'map-filter',
		name: 'Map & Filter',
		category: 'iteration',
		subcategory: 'array-methods',
		difficulty: 3,
		icon: '🎯',
		description: 'Transform arrays (map) or select elements (filter)',
		whyItMatters: `Map and filter are functional programming essentials. Map transforms every element (double all prices). Filter selects elements (only items in stock). Together, they replace most manual loops with cleaner, more expressive code.`,
		bestPractices: [
			'Map: transform each element, return same-length array',
			'Filter: return true to keep, false to remove',
			'Chain them: filter first, then map for efficiency',
			'Keep callbacks pure (no side effects)',
		],
		pitfalls: [
			'Forgetting that map returns a new array',
			'Filter callback must return boolean',
			'Not returning in map callback (returns undefined)',
			'Chaining too many operations (consider readability)',
		],
		prerequisites: ['arrays', 'functions', 'foreach'],
		related: ['reduce', 'foreach', 'find'],
		isPremium: false,
	},

	// ============================================
	// CONTROL FLOW - Switch
	// ============================================
	{
		id: 'switch',
		name: 'Switch Statement',
		category: 'control-flow',
		subcategory: 'branching',
		difficulty: 2,
		icon: '🔀',
		description: 'Multi-way branching based on a single value',
		whyItMatters: `Switch is your friend when you have one value that could be many things. Day of week? Month name? Menu option? Switch is cleaner than a chain of if/else statements and shows your intent more clearly.`,
		bestPractices: [
			'Always include a default case',
			'Keep cases simple - call functions for complex logic',
			'Consider if an object lookup would be cleaner',
			'Use fall-through intentionally and document it',
		],
		pitfalls: [
			'Forgetting break (causes fall-through)',
			'No default case for unexpected values',
			'Using switch when if/else is simpler',
			'Complex logic inside cases (extract to functions)',
		],
		prerequisites: ['conditionals'],
		related: ['conditionals', 'ternary'],
		isPremium: false,
	},

	// ============================================
	// CONTROL FLOW - Try/Catch
	// ============================================
	{
		id: 'try-catch',
		name: 'Try/Catch',
		category: 'control-flow',
		subcategory: 'error-handling',
		difficulty: 3,
		icon: '🛡️',
		description: 'Handle errors gracefully without crashing',
		whyItMatters: `Real programs encounter errors: network fails, files don't exist, users input garbage. Try/catch lets you handle these gracefully - show a message, retry, or recover - instead of crashing and losing work.`,
		bestPractices: [
			'Only catch errors you can actually handle',
			'Be specific about what errors you expect',
			'Always log or report errors for debugging',
			'Use finally for cleanup (close files, connections)',
		],
		pitfalls: [
			'Catching all errors and ignoring them (silent failure)',
			'Try blocks that are too large',
			'Not re-throwing errors you can\'t handle',
			'Using exceptions for normal control flow',
		],
		prerequisites: ['functions', 'conditionals'],
		related: ['error-types', 'promises'],
		isPremium: false,
	},

	// ============================================
	// ADVANCED - Recursion
	// ============================================
	{
		id: 'recursion',
		name: 'Recursion',
		category: 'advanced',
		subcategory: 'problem-solving',
		difficulty: 4,
		icon: '🪆',
		description: 'Functions that call themselves to solve problems',
		whyItMatters: `Some problems are naturally recursive: file systems (folders in folders), family trees, parsing nested data. Recursion lets you express these elegantly. It's also key to understanding many algorithms.`,
		bestPractices: [
			'Always have a base case (stopping condition)',
			'Ensure each call moves toward the base case',
			'Consider tail recursion for optimization',
			'Sometimes iteration is clearer - use judgment',
		],
		pitfalls: [
			'Stack overflow from infinite recursion',
			'Forgetting the base case',
			'Not making progress toward base case',
			'Over-using recursion when loops are simpler',
		],
		prerequisites: ['functions', 'conditionals'],
		related: ['functions', 'trees', 'divide-conquer'],
		isPremium: true,
	},

	// ============================================
	// ADVANCED - Closures
	// ============================================
	{
		id: 'closures',
		name: 'Closures',
		category: 'advanced',
		subcategory: 'scope',
		difficulty: 4,
		icon: '🔒',
		description: 'Functions that remember their creation context',
		whyItMatters: `Closures are powerful for creating private state, callbacks, and factory functions. They're how modern JavaScript works under the hood - understanding them unlocks patterns like module design and data privacy.`,
		bestPractices: [
			'Use closures for data privacy',
			'Be mindful of memory - closures keep variables alive',
			'Name your closures for debugging',
			'Understand when variables are captured',
		],
		pitfalls: [
			'Loop variable capture (classic gotcha)',
			'Memory leaks from unused closures',
			'Overcomplicating simple code with closures',
			'Not understanding when closure variables update',
		],
		prerequisites: ['functions', 'scope'],
		related: ['scope', 'callbacks', 'modules'],
		isPremium: true,
	},

	// ============================================
	// ADVANCED - Async/Await
	// ============================================
	{
		id: 'async-await',
		name: 'Async/Await',
		category: 'advanced',
		subcategory: 'asynchronous',
		difficulty: 4,
		icon: '⏳',
		description: 'Write asynchronous code that looks synchronous',
		whyItMatters: `Modern apps are asynchronous: API calls, file reads, timers. Async/await makes this manageable - your code reads top-to-bottom instead of callback pyramids. It's essential for web development.`,
		bestPractices: [
			'Always handle errors with try/catch',
			'Use Promise.all for parallel operations',
			'Don\'t await in loops when parallel is possible',
			'Understand that async functions return Promises',
		],
		pitfalls: [
			'Forgetting await (gets Promise instead of value)',
			'Sequential awaits when parallel is possible',
			'Not handling rejected promises',
			'Using async when synchronous code works',
		],
		prerequisites: ['functions', 'try-catch', 'callbacks'],
		related: ['promises', 'callbacks', 'try-catch'],
		isPremium: true,
	},
];

// ============================================
// Syntax Examples
// ============================================

export const ALL_SYNTAX: Record<string, Record<string, PrimitiveSyntax>> = {
	'for-loop': {
		javascript: {
			primitiveId: 'for-loop',
			language: 'javascript',
			syntaxTemplate: 'for (let i = 0; i < n; i++) {\n  // code to repeat\n}',
			fullExample: `// Count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
// Output: 1, 2, 3, 4, 5

// Loop through array by index
const fruits = ["apple", "banana", "cherry"];
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}`,
			explanation: 'The for loop has three parts: initialization (let i = 0), condition (i < n), and increment (i++). The loop continues while the condition is true.',
			tips: [
				'Use let, not var, for the loop variable',
				'For arrays, consider for...of or forEach',
				'i++ is shorthand for i = i + 1',
			],
		},
		python: {
			primitiveId: 'for-loop',
			language: 'python',
			syntaxTemplate: 'for i in range(n):\n    # code to repeat',
			fullExample: `# Count from 0 to 4
for i in range(5):
    print(i)
# Output: 0, 1, 2, 3, 4

# Count from 1 to 5
for i in range(1, 6):
    print(i)
# Output: 1, 2, 3, 4, 5`,
			explanation: 'Python uses range() to generate a sequence. range(5) gives 0-4, range(1, 6) gives 1-5 (end is exclusive).',
			tips: [
				'range(n) goes from 0 to n-1',
				'Use enumerate() to get index and value',
				'Direct iteration (for item in list) is preferred',
			],
		},
		go: {
			primitiveId: 'for-loop',
			language: 'go',
			syntaxTemplate: 'for i := 0; i < n; i++ {\n    // code to repeat\n}',
			fullExample: `// Count from 1 to 5
for i := 1; i <= 5; i++ {
    fmt.Println(i)
}

// Using range for slices
for i, val := range slice {
    fmt.Println(i, val)
}`,
			explanation: 'Go only has the for loop (no while). Use := for short declaration. The \'range\' keyword is idiomatic for slices.',
			tips: [
				'Go only has \'for\' - it covers all loop types',
				'Use range for iterating slices and maps',
				'_ ignores the index when not needed',
			],
		},
	},
	'conditionals': {
		javascript: {
			primitiveId: 'conditionals',
			language: 'javascript',
			syntaxTemplate: 'if (condition) {\n  // code\n} else if (other) {\n  // code\n} else {\n  // code\n}',
			fullExample: `if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else {
  grade = "F";
}`,
			explanation: 'Conditions must be in parentheses. Use === for strict equality (recommended over ==).',
			tips: [
				'Use === instead of == to avoid type coercion',
				'Early returns reduce nesting',
				'Braces are optional for single statements but recommended',
			],
		},
		python: {
			primitiveId: 'conditionals',
			language: 'python',
			syntaxTemplate: 'if condition:\n    # code\nelif other:\n    # code\nelse:\n    # code',
			fullExample: `if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"`,
			explanation: 'Python uses \'elif\' (not \'else if\'). Indentation matters - it defines the code blocks.',
			tips: [
				'No parentheses needed around conditions',
				'Colon : is required after each condition',
				'Use \'and\', \'or\', \'not\' for boolean logic',
			],
		},
		go: {
			primitiveId: 'conditionals',
			language: 'go',
			syntaxTemplate: 'if condition {\n    // code\n} else if other {\n    // code\n} else {\n    // code\n}',
			fullExample: `if score >= 90 {
    fmt.Println("A")
} else if score >= 80 {
    fmt.Println("B")
} else {
    fmt.Println("F")
}`,
			explanation: 'Go doesn\'t need parentheses around conditions. You can initialize a variable in the if statement.',
			tips: [
				'No parentheses around conditions',
				'Braces are always required',
				'Can initialize variables in if (scoped to block)',
			],
		},
	},
	'variables': {
		javascript: {
			primitiveId: 'variables',
			language: 'javascript',
			syntaxTemplate: 'let variableName = value;\nconst constantName = value;',
			fullExample: `// Variables (can change)
let userName = "Alice";
let userAge = 25;

// Constants (can't reassign)
const MAX_ATTEMPTS = 3;
const API_URL = "https://api.example.com";

// Updating
userName = "Bob";  // ✓ Works
userAge++;         // ✓ Now 26`,
			explanation: 'JavaScript uses \'let\' for variables that can change and \'const\' for values that stay the same.',
			tips: [
				'Use const by default, let only when needed',
				'camelCase is the convention',
				'Avoid var in modern code',
			],
		},
		python: {
			primitiveId: 'variables',
			language: 'python',
			syntaxTemplate: 'variable_name = value',
			fullExample: `# Variables
user_name = "Alice"
user_age = 25

# "Constants" (by convention, UPPERCASE)
MAX_ATTEMPTS = 3
API_URL = "https://api.example.com"

# Updating
user_name = "Bob"
user_age += 1  # Now 26`,
			explanation: 'Python is dynamically typed - just assign values. Use snake_case for variables.',
			tips: [
				'snake_case is the Python convention',
				'UPPER_CASE for constants (by convention)',
				'Variables can change type dynamically',
			],
		},
		go: {
			primitiveId: 'variables',
			language: 'go',
			syntaxTemplate: 'var name type = value\nname := value',
			fullExample: `// Explicit type
var userName string = "Alice"
var userAge int = 25

// Short declaration (type inferred)
userName := "Alice"
userAge := 25

// Constants
const MaxAttempts = 3`,
			explanation: 'Go is statically typed. Use := for short declarations inside functions.',
			tips: [
				'Use := inside functions for brevity',
				'camelCase for private, PascalCase for exported',
				'Constants use const keyword',
			],
		},
	},
};

// ============================================
// Helper Functions
// ============================================

export function getPrimitiveById(id: string): Primitive | undefined {
	return ALL_PRIMITIVES.find(p => p.id === id);
}

export function getPrimitivesByCategory(category: string): Primitive[] {
	return ALL_PRIMITIVES.filter(p => p.category === category);
}

export function getFreePrimitives(): Primitive[] {
	return ALL_PRIMITIVES.filter(p => !p.isPremium);
}

export function getSyntax(primitiveId: string, language: string): PrimitiveSyntax | undefined {
	return ALL_SYNTAX[primitiveId]?.[language];
}

export function getAllSyntaxForPrimitive(primitiveId: string): Record<string, PrimitiveSyntax> | undefined {
	return ALL_SYNTAX[primitiveId];
}

// ============================================
// Categories
// ============================================

export const CATEGORIES = [
	{ id: 'fundamentals', name: 'Fundamentals', icon: '📚', description: 'Core building blocks' },
	{ id: 'data-structures', name: 'Data Structures', icon: '🗄️', description: 'Organizing data' },
	{ id: 'iteration', name: 'Iteration', icon: '🔄', description: 'Looping patterns' },
	{ id: 'control-flow', name: 'Control Flow', icon: '🔀', description: 'Program flow' },
	{ id: 'advanced', name: 'Advanced', icon: '🚀', description: 'Power patterns' },
];

