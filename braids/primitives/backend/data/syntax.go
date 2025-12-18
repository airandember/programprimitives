// Package data contains syntax examples for all primitives
package data

// AllSyntax contains language-specific syntax for each primitive
var AllSyntax = map[string]map[string]Syntax{
	// ============================================
	// VARIABLES
	// ============================================
	"variables": {
		"javascript": {
			PrimitiveID:    "variables",
			Language:       "javascript",
			SyntaxTemplate: "let variableName = value;\nconst constantName = value;",
			FullExample: `// Declaring variables
let userName = "Alice";
let userAge = 25;
let isLoggedIn = true;

// Constants (can't be reassigned)
const MAX_ATTEMPTS = 3;
const API_URL = "https://api.example.com";

// Updating variables
userName = "Bob";  // ✓ Works
userAge = userAge + 1;  // ✓ Now 26

// MAX_ATTEMPTS = 5;  // ✗ Error! Can't reassign const`,
			Explanation: "JavaScript uses 'let' for variables that can change and 'const' for values that stay the same. Avoid 'var' in modern code.",
			Tips: []string{
				"Use const by default, let only when needed",
				"camelCase is the convention",
				"Variables declared with let/const are block-scoped",
			},
		},
		"python": {
			PrimitiveID:    "variables",
			Language:       "python",
			SyntaxTemplate: "variable_name = value",
			FullExample: `# Declaring variables
user_name = "Alice"
user_age = 25
is_logged_in = True

# Python doesn't have built-in constants, but convention uses UPPERCASE
MAX_ATTEMPTS = 3
API_URL = "https://api.example.com"

# Updating variables
user_name = "Bob"
user_age = user_age + 1  # Now 26
user_age += 1  # Shorthand, now 27`,
			Explanation: "Python uses dynamic typing - no need to declare types. Just assign values. Use snake_case for variable names.",
			Tips: []string{
				"snake_case is the Python convention",
				"UPPER_CASE for 'constants' (by convention)",
				"Python is dynamically typed - variables can change type",
			},
		},
		"go": {
			PrimitiveID:    "variables",
			Language:       "go",
			SyntaxTemplate: "var variableName type = value\nvariableName := value",
			FullExample: `package main

// Declaring variables
var userName string = "Alice"
var userAge int = 25
var isLoggedIn bool = true

// Short declaration (type inferred)
maxAttempts := 3
apiURL := "https://api.example.com"

// Constants
const MaxRetries = 5
const Pi = 3.14159

func main() {
    // Update variables
    userName = "Bob"
    userAge = userAge + 1  // Now 26
    userAge++  // Shorthand, now 27
}`,
			Explanation: "Go is statically typed but can infer types with :=. Use var for explicit types, := for short declarations inside functions.",
			Tips: []string{
				"Use := inside functions for brevity",
				"camelCase for private, PascalCase for exported",
				"Constants can be typed or untyped",
			},
		},
	},

	// ============================================
	// CONDITIONALS
	// ============================================
	"conditionals": {
		"javascript": {
			PrimitiveID:    "conditionals",
			Language:       "javascript",
			SyntaxTemplate: "if (condition) {\n  // code\n} else if (other) {\n  // code\n} else {\n  // code\n}",
			FullExample: `// Simple if
if (age >= 18) {
  console.log("You can vote!");
}

// if-else
if (temperature > 30) {
  console.log("It's hot!");
} else {
  console.log("It's comfortable.");
}

// if-else if-else
if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else {
  grade = "F";
}

// Early return pattern (cleaner)
function canDrive(age) {
  if (age < 16) return false;
  if (!hasLicense) return false;
  return true;
}`,
			Explanation: "Conditions must be in parentheses. Use === for strict equality (recommended over ==).",
			Tips: []string{
				"Use === instead of == to avoid type coercion",
				"Early returns reduce nesting",
				"Braces are optional for single statements but recommended",
			},
		},
		"python": {
			PrimitiveID:    "conditionals",
			Language:       "python",
			SyntaxTemplate: "if condition:\n    # code\nelif other:\n    # code\nelse:\n    # code",
			FullExample: `# Simple if
if age >= 18:
    print("You can vote!")

# if-else
if temperature > 30:
    print("It's hot!")
else:
    print("It's comfortable.")

# if-elif-else
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# Early return pattern
def can_drive(age, has_license):
    if age < 16:
        return False
    if not has_license:
        return False
    return True`,
			Explanation: "Python uses 'elif' (not 'else if'). Indentation matters - it defines the code blocks.",
			Tips: []string{
				"No parentheses needed around conditions",
				"Colon : is required after each condition",
				"Use 'and', 'or', 'not' for boolean logic",
			},
		},
		"go": {
			PrimitiveID:    "conditionals",
			Language:       "go",
			SyntaxTemplate: "if condition {\n    // code\n} else if other {\n    // code\n} else {\n    // code\n}",
			FullExample: `package main

import "fmt"

func main() {
    age := 25

    // Simple if
    if age >= 18 {
        fmt.Println("You can vote!")
    }

    // if-else
    temperature := 35
    if temperature > 30 {
        fmt.Println("It's hot!")
    } else {
        fmt.Println("It's comfortable.")
    }

    // if with initialization
    if score := getScore(); score >= 90 {
        fmt.Println("Grade: A")
    } else if score >= 80 {
        fmt.Println("Grade: B")
    } else {
        fmt.Println("Grade: F")
    }
}`,
			Explanation: "Go doesn't need parentheses around conditions. You can initialize a variable in the if statement (scoped to that block).",
			Tips: []string{
				"No parentheses around conditions",
				"Braces are always required",
				"Can initialize variables in if (scoped to block)",
			},
		},
	},

	// ============================================
	// FOR LOOP
	// ============================================
	"for-loop": {
		"javascript": {
			PrimitiveID:    "for-loop",
			Language:       "javascript",
			SyntaxTemplate: "for (let i = 0; i < n; i++) {\n  // code to repeat\n}",
			FullExample: `// Count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
// Output: 1, 2, 3, 4, 5

// Loop through array by index
const fruits = ["apple", "banana", "cherry"];
for (let i = 0; i < fruits.length; i++) {
  console.log(i, fruits[i]);
}

// Count down
for (let i = 10; i >= 0; i--) {
  console.log(i);
}

// Step by 2
for (let i = 0; i <= 10; i += 2) {
  console.log(i);  // 0, 2, 4, 6, 8, 10
}`,
			Explanation: "The for loop has three parts: initialization (let i = 0), condition (i < n), and increment (i++). The loop continues while the condition is true.",
			Tips: []string{
				"Use let, not var, for the loop variable",
				"For arrays, consider for...of or forEach",
				"i++ is shorthand for i = i + 1",
			},
		},
		"python": {
			PrimitiveID:    "for-loop",
			Language:       "python",
			SyntaxTemplate: "for i in range(n):\n    # code to repeat",
			FullExample: `# Count from 0 to 4
for i in range(5):
    print(i)
# Output: 0, 1, 2, 3, 4

# Count from 1 to 5
for i in range(1, 6):
    print(i)
# Output: 1, 2, 3, 4, 5

# Loop through list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# With index using enumerate
for i, fruit in enumerate(fruits):
    print(i, fruit)

# Step by 2
for i in range(0, 11, 2):
    print(i)  # 0, 2, 4, 6, 8, 10`,
			Explanation: "Python uses range() to generate a sequence. range(5) gives 0-4, range(1, 6) gives 1-5 (end is exclusive).",
			Tips: []string{
				"range(n) goes from 0 to n-1",
				"Use enumerate() to get index and value",
				"Direct iteration (for item in list) is preferred",
			},
		},
		"go": {
			PrimitiveID:    "for-loop",
			Language:       "go",
			SyntaxTemplate: "for i := 0; i < n; i++ {\n    // code to repeat\n}",
			FullExample: `package main

import "fmt"

func main() {
    // Count from 1 to 5
    for i := 1; i <= 5; i++ {
        fmt.Println(i)
    }

    // Loop through slice
    fruits := []string{"apple", "banana", "cherry"}
    for i := 0; i < len(fruits); i++ {
        fmt.Println(i, fruits[i])
    }

    // Using range (preferred for slices)
    for i, fruit := range fruits {
        fmt.Println(i, fruit)
    }

    // Range without index
    for _, fruit := range fruits {
        fmt.Println(fruit)
    }
}`,
			Explanation: "Go only has the for loop (no while). Use := for short declaration. The 'range' keyword is idiomatic for slices.",
			Tips: []string{
				"Go only has 'for' - it covers all loop types",
				"Use range for iterating slices and maps",
				"_ ignores the index when not needed",
			},
		},
	},

	// ============================================
	// WHILE LOOP
	// ============================================
	"while-loop": {
		"javascript": {
			PrimitiveID:    "while-loop",
			Language:       "javascript",
			SyntaxTemplate: "while (condition) {\n  // code to repeat\n}",
			FullExample: `// Count down
let count = 5;
while (count > 0) {
  console.log(count);
  count--;
}

// Read until quit
let input;
while (input !== "quit") {
  input = prompt("Enter command:");
  console.log("You entered:", input);
}

// Find first even number
let num = 1;
while (num % 2 !== 0) {
  num = Math.floor(Math.random() * 100);
}
console.log("Found even:", num);

// do-while (runs at least once)
do {
  input = prompt("Enter password:");
} while (input !== "secret");`,
			Explanation: "While loops run as long as the condition is true. Make sure something in the loop changes to eventually make the condition false!",
			Tips: []string{
				"Always ensure condition can become false",
				"Use do...while when you need at least one iteration",
				"For infinite loops, use while(true) with break",
			},
		},
		"python": {
			PrimitiveID:    "while-loop",
			Language:       "python",
			SyntaxTemplate: "while condition:\n    # code to repeat",
			FullExample: `# Count down
count = 5
while count > 0:
    print(count)
    count -= 1

# Read until quit
user_input = ""
while user_input != "quit":
    user_input = input("Enter command: ")
    print("You entered:", user_input)

# Find first even number
import random
num = 1
while num % 2 != 0:
    num = random.randint(1, 100)
print("Found even:", num)

# While-else (runs if no break)
while count > 0:
    if count == secret:
        break
    count -= 1
else:
    print("Secret not found")`,
			Explanation: "Python's while loop can have an else clause that runs if the loop completes without breaking.",
			Tips: []string{
				"Use 'while True' with 'break' for complex conditions",
				"else clause runs if loop completes normally",
				"Python has no do-while; use while True with break",
			},
		},
		"go": {
			PrimitiveID:    "while-loop",
			Language:       "go",
			SyntaxTemplate: "for condition {\n    // code to repeat\n}",
			FullExample: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    // Count down (Go uses 'for' as while)
    count := 5
    for count > 0 {
        fmt.Println(count)
        count--
    }

    // Infinite loop with break
    scanner := bufio.NewScanner(os.Stdin)
    for {
        fmt.Print("Enter command: ")
        scanner.Scan()
        input := scanner.Text()
        if input == "quit" {
            break
        }
        fmt.Println("You entered:", input)
    }
}`,
			Explanation: "Go uses 'for' for while loops too! Just omit the init and post statements. 'for { }' is an infinite loop.",
			Tips: []string{
				"Go uses 'for' with just a condition (no while keyword)",
				"'for { }' is an infinite loop",
				"Use break and continue as normal",
			},
		},
	},

	// ============================================
	// FUNCTIONS
	// ============================================
	"functions": {
		"javascript": {
			PrimitiveID:    "functions",
			Language:       "javascript",
			SyntaxTemplate: "function name(param1, param2) {\n  // code\n  return result;\n}",
			FullExample: `// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Alice")); // "Hello, Alice!"

// Arrow function (modern)
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5

// Default parameters
function greet(name = "friend") {
  return "Hello, " + name + "!";
}
console.log(greet()); // "Hello, friend!"

// Multiple returns
function divide(a, b) {
  if (b === 0) {
    return { error: "Division by zero" };
  }
  return { result: a / b };
}`,
			Explanation: "Functions can be declared with 'function' keyword or as arrow functions. They can take parameters and return values.",
			Tips: []string{
				"Arrow functions are concise but have different 'this'",
				"Use default parameters for optional values",
				"Functions are first-class (can be passed around)",
			},
		},
		"python": {
			PrimitiveID:    "functions",
			Language:       "python",
			SyntaxTemplate: "def function_name(param1, param2):\n    # code\n    return result",
			FullExample: `# Basic function
def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))  # "Hello, Alice!"

# Default parameters
def greet(name="friend"):
    return f"Hello, {name}!"

print(greet())  # "Hello, friend!"

# Multiple return values (tuple)
def divide(a, b):
    if b == 0:
        return None, "Division by zero"
    return a / b, None

result, error = divide(10, 2)

# Type hints (optional but helpful)
def add(a: int, b: int) -> int:
    return a + b`,
			Explanation: "Python uses 'def' to define functions. Indentation defines the function body. Can return multiple values via tuple.",
			Tips: []string{
				"Use type hints for better documentation",
				"*args and **kwargs for variable arguments",
				"Docstrings describe what functions do",
			},
		},
		"go": {
			PrimitiveID:    "functions",
			Language:       "go",
			SyntaxTemplate: "func name(param1 type, param2 type) returnType {\n    // code\n    return result\n}",
			FullExample: `package main

import "fmt"

// Basic function
func greet(name string) string {
    return "Hello, " + name + "!"
}

// Multiple return values
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

// Named return values
func getCoords() (x, y int) {
    x = 10
    y = 20
    return // naked return
}

func main() {
    fmt.Println(greet("Alice"))

    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", result)
    }
}`,
			Explanation: "Go functions can return multiple values, which is idiomatic for error handling. Types come after parameter names.",
			Tips: []string{
				"Multiple return values are idiomatic",
				"Error is typically the last return value",
				"Named returns can make code cleaner",
			},
		},
	},

	// ============================================
	// ARRAYS
	// ============================================
	"arrays": {
		"javascript": {
			PrimitiveID:    "arrays",
			Language:       "javascript",
			SyntaxTemplate: "const array = [item1, item2, item3];\narray[0]  // first item",
			FullExample: `// Create arrays
const fruits = ["apple", "banana", "cherry"];
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "two", true, null];

// Access elements (0-indexed)
console.log(fruits[0]);  // "apple"
console.log(fruits[fruits.length - 1]);  // "cherry" (last)

// Modify elements
fruits[1] = "blueberry";

// Add/remove elements
fruits.push("date");      // Add to end
fruits.pop();             // Remove from end
fruits.unshift("apricot"); // Add to start
fruits.shift();           // Remove from start

// Check length
console.log(fruits.length);  // 3

// Check if array includes item
console.log(fruits.includes("apple"));  // true`,
			Explanation: "JavaScript arrays are zero-indexed and can hold mixed types. They have many built-in methods for manipulation.",
			Tips: []string{
				"Arrays are zero-indexed (first item is [0])",
				"Use .length - 1 for the last index",
				"Arrays can grow dynamically",
			},
		},
		"python": {
			PrimitiveID:    "arrays",
			Language:       "python",
			SyntaxTemplate: "my_list = [item1, item2, item3]\nmy_list[0]  # first item",
			FullExample: `# Create lists (Python's arrays)
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "two", True, None]

# Access elements (0-indexed)
print(fruits[0])   # "apple"
print(fruits[-1])  # "cherry" (last - negative indexing!)

# Slicing
print(fruits[0:2])  # ["apple", "banana"]
print(fruits[1:])   # ["banana", "cherry"]

# Modify elements
fruits[1] = "blueberry"

# Add/remove elements
fruits.append("date")       # Add to end
fruits.pop()                # Remove from end
fruits.insert(0, "apricot") # Add at index
fruits.remove("apple")      # Remove by value

# Check if in list
print("apple" in fruits)  # True or False`,
			Explanation: "Python calls them 'lists'. They support negative indexing ([-1] is last item) and powerful slicing.",
			Tips: []string{
				"Negative indexing: [-1] is last, [-2] is second-to-last",
				"Slicing: [start:end:step]",
				"List comprehensions are powerful: [x*2 for x in list]",
			},
		},
		"go": {
			PrimitiveID:    "arrays",
			Language:       "go",
			SyntaxTemplate: "var arr [size]type\nslice := []type{item1, item2}",
			FullExample: `package main

import "fmt"

func main() {
    // Arrays (fixed size)
    var arr [3]string
    arr[0] = "apple"
    
    // Slices (dynamic, more common)
    fruits := []string{"apple", "banana", "cherry"}
    numbers := []int{1, 2, 3, 4, 5}

    // Access elements
    fmt.Println(fruits[0])              // "apple"
    fmt.Println(fruits[len(fruits)-1])  // "cherry"

    // Add elements
    fruits = append(fruits, "date")

    // Slicing
    fmt.Println(fruits[0:2])  // ["apple", "banana"]

    // Length and capacity
    fmt.Println(len(fruits))  // 4
    fmt.Println(cap(fruits))  // capacity

    // Iterate
    for i, fruit := range fruits {
        fmt.Println(i, fruit)
    }
}`,
			Explanation: "Go has fixed-size arrays and dynamic slices. Slices are more common. Use append() to add elements.",
			Tips: []string{
				"Slices ([]type) are more flexible than arrays ([n]type)",
				"Use append() to grow slices",
				"range gives both index and value",
			},
		},
	},
}

// GetSyntax returns syntax for a primitive and language
func GetSyntax(primitiveID, language string) *Syntax {
	if primitiveSyntax, ok := AllSyntax[primitiveID]; ok {
		if syntax, ok := primitiveSyntax[language]; ok {
			return &syntax
		}
	}
	return nil
}

// GetAllSyntaxForPrimitive returns all language syntax for a primitive
func GetAllSyntaxForPrimitive(primitiveID string) map[string]Syntax {
	if syntax, ok := AllSyntax[primitiveID]; ok {
		return syntax
	}
	return nil
}

