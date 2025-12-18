// Package data contains the primitives catalog content
package data

// Primitive represents a programming primitive
type Primitive struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Category      string   `json:"category"`
	Subcategory   string   `json:"subcategory,omitempty"`
	Difficulty    int      `json:"difficulty"`
	Icon          string   `json:"icon"`
	Description   string   `json:"description"`
	WhyItMatters  string   `json:"whyItMatters"`
	BestPractices []string `json:"bestPractices"`
	Pitfalls      []string `json:"pitfalls"`
	Prerequisites []string `json:"prerequisites"`
	Related       []string `json:"related"`
	IsPremium     bool     `json:"isPremium"`
}

// Syntax represents language-specific syntax for a primitive
type Syntax struct {
	PrimitiveID    string   `json:"primitiveId"`
	Language       string   `json:"language"`
	SyntaxTemplate string   `json:"syntaxTemplate"`
	FullExample    string   `json:"fullExample"`
	Explanation    string   `json:"explanation"`
	Tips           []string `json:"tips,omitempty"`
}

// AllPrimitives is the complete catalog
var AllPrimitives = []Primitive{
	// ============================================
	// FUNDAMENTALS - Variables
	// ============================================
	{
		ID:          "variables",
		Name:        "Variables",
		Category:    "fundamentals",
		Subcategory: "basics",
		Difficulty:  1,
		Icon:        "📦",
		Description: "Named storage locations that hold data values",
		WhyItMatters: `Variables are the foundation of programming. They let you store, reference, and manipulate data throughout your program. Understanding variables means understanding how computers remember things.`,
		BestPractices: []string{
			"Use descriptive names that explain the variable's purpose",
			"Follow your language's naming conventions (camelCase, snake_case)",
			"Initialize variables when you declare them when possible",
			"Keep variable scope as small as needed",
		},
		Pitfalls: []string{
			"Using single-letter names except for loop counters",
			"Reusing variables for different purposes",
			"Forgetting that some languages have mutable vs immutable variables",
			"Not understanding variable hoisting in JavaScript",
		},
		Prerequisites: []string{},
		Related:       []string{"constants", "data-types"},
		IsPremium:     false,
	},

	// ============================================
	// FUNDAMENTALS - Conditionals
	// ============================================
	{
		ID:          "conditionals",
		Name:        "Conditionals",
		Category:    "fundamentals",
		Subcategory: "control-flow",
		Difficulty:  1,
		Icon:        "🔀",
		Description: "Execute different code based on whether conditions are true or false",
		WhyItMatters: `Conditionals give your program decision-making ability. They're how programs respond differently to different inputs - the difference between a calculator that just adds and one that can add, subtract, multiply, or divide based on what you choose.`,
		BestPractices: []string{
			"Keep conditions simple and readable",
			"Handle the most common case first",
			"Use early returns to reduce nesting",
			"Consider using switch for multiple specific values",
		},
		Pitfalls: []string{
			"Deeply nested if/else chains (pyramid of doom)",
			"Using = instead of == for comparison",
			"Forgetting to handle the else case",
			"Complex boolean expressions without parentheses",
		},
		Prerequisites: []string{"variables"},
		Related:       []string{"switch", "ternary"},
		IsPremium:     false,
	},

	// ============================================
	// FUNDAMENTALS - For Loop
	// ============================================
	{
		ID:          "for-loop",
		Name:        "For Loop",
		Category:    "fundamentals",
		Subcategory: "iteration",
		Difficulty:  2,
		Icon:        "🔄",
		Description: "Execute code a specific number of times with a counter",
		WhyItMatters: `For loops are your go-to when you know exactly how many times to repeat something. Processing every item in a list? Counting from 1 to 100? Generating a pattern? That's for loop territory. They're one of the most-used constructs in programming.`,
		BestPractices: []string{
			"Use meaningful iterator names (i for index is fine, but item for items)",
			"Don't modify the loop variable inside the loop",
			"Consider forEach/map for array iteration in modern languages",
			"Keep loop bodies focused on one task",
		},
		Pitfalls: []string{
			"Off-by-one errors (i <= n vs i < n)",
			"Infinite loops when condition never becomes false",
			"Modifying array length while iterating",
			"Confusing loop counter scope",
		},
		Prerequisites: []string{"variables", "conditionals"},
		Related:       []string{"while-loop", "foreach", "arrays"},
		IsPremium:     false,
	},

	// ============================================
	// FUNDAMENTALS - While Loop
	// ============================================
	{
		ID:          "while-loop",
		Name:        "While Loop",
		Category:    "fundamentals",
		Subcategory: "iteration",
		Difficulty:  2,
		Icon:        "🔁",
		Description: "Execute code repeatedly while a condition remains true",
		WhyItMatters: `While loops shine when you don't know in advance how many iterations you need. Reading user input until they type 'quit'? Searching for something in data? Processing a queue until it's empty? While loops handle uncertainty gracefully.`,
		BestPractices: []string{
			"Always ensure the condition can eventually become false",
			"Update the condition variable inside the loop",
			"Consider do-while when you need at least one execution",
			"Keep the condition simple and obvious",
		},
		Pitfalls: []string{
			"Infinite loops (forgetting to update condition)",
			"Off-by-one errors in the condition",
			"Complex conditions that are hard to reason about",
			"Not handling edge cases (empty input, zero iterations)",
		},
		Prerequisites: []string{"variables", "conditionals"},
		Related:       []string{"for-loop", "do-while", "break-continue"},
		IsPremium:     false,
	},

	// ============================================
	// FUNDAMENTALS - Functions
	// ============================================
	{
		ID:          "functions",
		Name:        "Functions",
		Category:    "fundamentals",
		Subcategory: "abstraction",
		Difficulty:  2,
		Icon:        "⚡",
		Description: "Reusable blocks of code that perform specific tasks",
		WhyItMatters: `Functions are how you organize and reuse code. Instead of copying the same 10 lines everywhere, write them once in a function. They make code readable (what does calculateTax() do? exactly what it says), testable, and maintainable.`,
		BestPractices: []string{
			"One function, one purpose (Single Responsibility)",
			"Use descriptive names that describe what it does",
			"Keep functions short (under 20-30 lines ideally)",
			"Minimize side effects - prefer returning values",
		},
		Pitfalls: []string{
			"Functions that do too many things",
			"Deeply nested function calls",
			"Not handling edge cases or invalid inputs",
			"Relying on global state instead of parameters",
		},
		Prerequisites: []string{"variables"},
		Related:       []string{"parameters", "return-values", "scope"},
		IsPremium:     false,
	},

	// ============================================
	// DATA STRUCTURES - Arrays
	// ============================================
	{
		ID:          "arrays",
		Name:        "Arrays",
		Category:    "data-structures",
		Subcategory: "collections",
		Difficulty:  2,
		Icon:        "📊",
		Description: "Ordered collections of elements accessed by index",
		WhyItMatters: `Arrays are everywhere. User lists, shopping carts, search results, image pixels - all arrays. Understanding arrays means understanding how to work with collections of data, which is most of what programs do.`,
		BestPractices: []string{
			"Use meaningful names that indicate what's stored",
			"Check bounds before accessing by index",
			"Prefer array methods (map, filter) over manual loops",
			"Consider if you need an array or a different data structure",
		},
		Pitfalls: []string{
			"Index out of bounds errors",
			"Modifying arrays while iterating",
			"Confusing length with last index (length - 1)",
			"Not understanding reference vs copy behavior",
		},
		Prerequisites: []string{"variables", "for-loop"},
		Related:       []string{"foreach", "map-filter", "objects"},
		IsPremium:     false,
	},

	// ============================================
	// DATA STRUCTURES - Objects
	// ============================================
	{
		ID:          "objects",
		Name:        "Objects",
		Category:    "data-structures",
		Subcategory: "collections",
		Difficulty:  2,
		Icon:        "🗃️",
		Description: "Collections of key-value pairs for structured data",
		WhyItMatters: `Objects let you group related data together. A user isn't just a name - they have an email, age, preferences. Objects model real-world things in code, making your data meaningful and organized.`,
		BestPractices: []string{
			"Use objects to group related data",
			"Keep objects focused (don't put everything in one)",
			"Use consistent naming for keys",
			"Consider immutability for predictable code",
		},
		Pitfalls: []string{
			"Accessing undefined properties without checking",
			"Mutating objects unexpectedly (reference issues)",
			"Deeply nested objects that are hard to work with",
			"Confusing object equality (reference vs value)",
		},
		Prerequisites: []string{"variables", "arrays"},
		Related:       []string{"arrays", "classes", "json"},
		IsPremium:     false,
	},

	// ============================================
	// ITERATION - forEach
	// ============================================
	{
		ID:          "foreach",
		Name:        "ForEach",
		Category:    "iteration",
		Subcategory: "array-methods",
		Difficulty:  2,
		Icon:        "🔂",
		Description: "Execute a function for each element in an array",
		WhyItMatters: `forEach is the modern way to iterate arrays. It's cleaner than manual for loops, less error-prone (no off-by-one errors), and expresses intent clearly: "do this for each item."`,
		BestPractices: []string{
			"Use forEach when you need side effects (logging, updating)",
			"Use map/filter when transforming data",
			"Keep the callback function simple",
			"Consider regular for loop if you need break/continue",
		},
		Pitfalls: []string{
			"Can't break out early (use for...of or find instead)",
			"Doesn't return a new array (use map for that)",
			"Async callbacks don't work as expected",
			"Using forEach when map or filter is more appropriate",
		},
		Prerequisites: []string{"arrays", "functions"},
		Related:       []string{"for-loop", "map-filter", "reduce"},
		IsPremium:     false,
	},

	// ============================================
	// ITERATION - Map & Filter
	// ============================================
	{
		ID:          "map-filter",
		Name:        "Map & Filter",
		Category:    "iteration",
		Subcategory: "array-methods",
		Difficulty:  3,
		Icon:        "🎯",
		Description: "Transform arrays (map) or select elements (filter)",
		WhyItMatters: `Map and filter are functional programming essentials. Map transforms every element (double all prices). Filter selects elements (only items in stock). Together, they replace most manual loops with cleaner, more expressive code.`,
		BestPractices: []string{
			"Map: transform each element, return same-length array",
			"Filter: return true to keep, false to remove",
			"Chain them: filter first, then map for efficiency",
			"Keep callbacks pure (no side effects)",
		},
		Pitfalls: []string{
			"Forgetting that map returns a new array",
			"Filter callback must return boolean",
			"Not returning in map callback (returns undefined)",
			"Chaining too many operations (consider readability)",
		},
		Prerequisites: []string{"arrays", "functions", "foreach"},
		Related:       []string{"reduce", "foreach", "find"},
		IsPremium:     false,
	},

	// ============================================
	// CONTROL FLOW - Switch
	// ============================================
	{
		ID:          "switch",
		Name:        "Switch Statement",
		Category:    "control-flow",
		Subcategory: "branching",
		Difficulty:  2,
		Icon:        "🔀",
		Description: "Multi-way branching based on a single value",
		WhyItMatters: `Switch is your friend when you have one value that could be many things. Day of week? Month name? Menu option? Switch is cleaner than a chain of if/else statements and shows your intent more clearly.`,
		BestPractices: []string{
			"Always include a default case",
			"Keep cases simple - call functions for complex logic",
			"Consider if an object lookup would be cleaner",
			"Use fall-through intentionally and document it",
		},
		Pitfalls: []string{
			"Forgetting break (causes fall-through)",
			"No default case for unexpected values",
			"Using switch when if/else is simpler",
			"Complex logic inside cases (extract to functions)",
		},
		Prerequisites: []string{"conditionals"},
		Related:       []string{"conditionals", "ternary"},
		IsPremium:     false,
	},

	// ============================================
	// CONTROL FLOW - Try/Catch
	// ============================================
	{
		ID:          "try-catch",
		Name:        "Try/Catch",
		Category:    "control-flow",
		Subcategory: "error-handling",
		Difficulty:  3,
		Icon:        "🛡️",
		Description: "Handle errors gracefully without crashing",
		WhyItMatters: `Real programs encounter errors: network fails, files don't exist, users input garbage. Try/catch lets you handle these gracefully - show a message, retry, or recover - instead of crashing and losing work.`,
		BestPractices: []string{
			"Only catch errors you can actually handle",
			"Be specific about what errors you expect",
			"Always log or report errors for debugging",
			"Use finally for cleanup (close files, connections)",
		},
		Pitfalls: []string{
			"Catching all errors and ignoring them (silent failure)",
			"Try blocks that are too large",
			"Not re-throwing errors you can't handle",
			"Using exceptions for normal control flow",
		},
		Prerequisites: []string{"functions", "conditionals"},
		Related:       []string{"error-types", "promises"},
		IsPremium:     false,
	},

	// ============================================
	// ADVANCED - Recursion
	// ============================================
	{
		ID:          "recursion",
		Name:        "Recursion",
		Category:    "advanced",
		Subcategory: "problem-solving",
		Difficulty:  4,
		Icon:        "🪆",
		Description: "Functions that call themselves to solve problems",
		WhyItMatters: `Some problems are naturally recursive: file systems (folders in folders), family trees, parsing nested data. Recursion lets you express these elegantly. It's also key to understanding many algorithms.`,
		BestPractices: []string{
			"Always have a base case (stopping condition)",
			"Ensure each call moves toward the base case",
			"Consider tail recursion for optimization",
			"Sometimes iteration is clearer - use judgment",
		},
		Pitfalls: []string{
			"Stack overflow from infinite recursion",
			"Forgetting the base case",
			"Not making progress toward base case",
			"Over-using recursion when loops are simpler",
		},
		Prerequisites: []string{"functions", "conditionals"},
		Related:       []string{"functions", "trees", "divide-conquer"},
		IsPremium:     true,
	},

	// ============================================
	// ADVANCED - Closures
	// ============================================
	{
		ID:          "closures",
		Name:        "Closures",
		Category:    "advanced",
		Subcategory: "scope",
		Difficulty:  4,
		Icon:        "🔒",
		Description: "Functions that remember their creation context",
		WhyItMatters: `Closures are powerful for creating private state, callbacks, and factory functions. They're how modern JavaScript works under the hood - understanding them unlocks patterns like module design and data privacy.`,
		BestPractices: []string{
			"Use closures for data privacy",
			"Be mindful of memory - closures keep variables alive",
			"Name your closures for debugging",
			"Understand when variables are captured",
		},
		Pitfalls: []string{
			"Loop variable capture (classic gotcha)",
			"Memory leaks from unused closures",
			"Overcomplicating simple code with closures",
			"Not understanding when closure variables update",
		},
		Prerequisites: []string{"functions", "scope"},
		Related:       []string{"scope", "callbacks", "modules"},
		IsPremium:     true,
	},

	// ============================================
	// ADVANCED - Async/Await
	// ============================================
	{
		ID:          "async-await",
		Name:        "Async/Await",
		Category:    "advanced",
		Subcategory: "asynchronous",
		Difficulty:  4,
		Icon:        "⏳",
		Description: "Write asynchronous code that looks synchronous",
		WhyItMatters: `Modern apps are asynchronous: API calls, file reads, timers. Async/await makes this manageable - your code reads top-to-bottom instead of callback pyramids. It's essential for web development.`,
		BestPractices: []string{
			"Always handle errors with try/catch",
			"Use Promise.all for parallel operations",
			"Don't await in loops when parallel is possible",
			"Understand that async functions return Promises",
		},
		Pitfalls: []string{
			"Forgetting await (gets Promise instead of value)",
			"Sequential awaits when parallel is possible",
			"Not handling rejected promises",
			"Using async when synchronous code works",
		},
		Prerequisites: []string{"functions", "try-catch", "callbacks"},
		Related:       []string{"promises", "callbacks", "try-catch"},
		IsPremium:     true,
	},
}

// GetPrimitiveByID returns a primitive by its ID
func GetPrimitiveByID(id string) *Primitive {
	for i := range AllPrimitives {
		if AllPrimitives[i].ID == id {
			return &AllPrimitives[i]
		}
	}
	return nil
}

// GetPrimitivesByCategory returns all primitives in a category
func GetPrimitivesByCategory(category string) []Primitive {
	var result []Primitive
	for _, p := range AllPrimitives {
		if p.Category == category {
			result = append(result, p)
		}
	}
	return result
}

// GetFreePrimitives returns all non-premium primitives
func GetFreePrimitives() []Primitive {
	var result []Primitive
	for _, p := range AllPrimitives {
		if !p.IsPremium {
			result = append(result, p)
		}
	}
	return result
}

