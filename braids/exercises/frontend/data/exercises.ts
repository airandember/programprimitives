// ============================================
// Exercises Seed Data
// ============================================

import type { Exercise, TestCase } from '@braids/core/types';

// ============================================
// Test Cases Helper
// ============================================

function tc(id: string, name: string, input: unknown, expected: unknown, isHidden = false): TestCase {
	return { id, name, input, expected, isHidden };
}

// ============================================
// EXERCISES DATA
// ============================================

export const ALL_EXERCISES: Exercise[] = [
	// ============================================
	// VARIABLES EXERCISES
	// ============================================
	{
		id: 'ex-var-001',
		primitiveId: 'variables',
		title: 'Variable Swap',
		slug: 'variable-swap',
		description: 'Swap the values of two variables using a temporary variable',
		difficulty: 1,
		estimatedMinutes: 3,
		instructions: `## Your Task

Create a function \`swap(a, b)\` that returns an array with the values swapped.

### Requirements
- Use a temporary variable to perform the swap
- Return an array with [b, a]

### Examples
\`\`\`
swap(1, 2)           → [2, 1]
swap("hello", "world") → ["world", "hello"]
swap(true, false)    → [false, true]
\`\`\`

### Why This Matters
Understanding how to swap values is fundamental. It teaches you about variable assignment and the fact that you need temporary storage to avoid losing data.`,
		hints: [
			'You need a third variable to temporarily hold one of the values',
			'Store `a` in a temp variable first, then you can safely overwrite `a`',
			'After storing temp=a, set a=b, then set b=temp',
		],
		starterCode: {
			javascript: `function swap(a, b) {
  // Your code here
  
}`,
			python: `def swap(a, b):
    # Your code here
    pass`,
			go: `func swap(a, b interface{}) []interface{} {
    // Your code here
    return nil
}`,
		},
		testCases: [
			tc('1', 'Swap numbers', [1, 2], [2, 1]),
			tc('2', 'Swap strings', ['hello', 'world'], ['world', 'hello']),
			tc('3', 'Swap booleans', [true, false], [false, true]),
			tc('4', 'Same values', [5, 5], [5, 5]),
		],
		isPremium: false,
	},
	{
		id: 'ex-var-002',
		primitiveId: 'variables',
		title: 'Temperature Tracker',
		slug: 'temperature-tracker',
		description: 'Track and calculate temperature statistics',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`tempStats(temps)\` that takes an array of temperatures and returns an object with min, max, and average.

### Requirements
- Calculate minimum temperature
- Calculate maximum temperature  
- Calculate average (mean) temperature
- Return an object: \`{ min, max, avg }\`

### Examples
\`\`\`
tempStats([72, 68, 75, 70, 73])
→ { min: 68, max: 75, avg: 71.6 }

tempStats([32])
→ { min: 32, max: 32, avg: 32 }
\`\`\``,
		hints: [
			'Initialize min and max with the first element',
			'Loop through and update min/max as you find smaller/larger values',
			'For average: sum all values, then divide by the count',
		],
		starterCode: {
			javascript: `function tempStats(temps) {
  // Your code here
  
}`,
			python: `def temp_stats(temps):
    # Your code here
    pass`,
			go: `func tempStats(temps []float64) map[string]float64 {
    // Your code here
    return nil
}`,
		},
		testCases: [
			tc('1', 'Normal temps', [[72, 68, 75, 70, 73]], { min: 68, max: 75, avg: 71.6 }),
			tc('2', 'Single temp', [[32]], { min: 32, max: 32, avg: 32 }),
			tc('3', 'Negative temps', [[-5, -10, 0, 5]], { min: -10, max: 5, avg: -2.5 }),
		],
		isPremium: false,
	},

	// ============================================
	// CONDITIONALS EXERCISES
	// ============================================
	{
		id: 'ex-cond-001',
		primitiveId: 'conditionals',
		title: 'Grade Calculator',
		slug: 'grade-calculator',
		description: 'Convert a numeric score to a letter grade',
		difficulty: 1,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`getGrade(score)\` that returns the letter grade:

| Score Range | Grade |
|-------------|-------|
| 90-100 | A |
| 80-89 | B |
| 70-79 | C |
| 60-69 | D |
| Below 60 | F |

### Examples
\`\`\`
getGrade(95) → "A"
getGrade(82) → "B"
getGrade(71) → "C"
getGrade(65) → "D"
getGrade(45) → "F"
\`\`\``,
		hints: [
			'Start with the highest grade and work down using else if',
			'Use >= for the comparisons',
			'The last else handles everything below 60',
		],
		starterCode: {
			javascript: `function getGrade(score) {
  // Your code here
  
}`,
			python: `def get_grade(score):
    # Your code here
    pass`,
			go: `func getGrade(score int) string {
    // Your code here
    return ""
}`,
		},
		testCases: [
			tc('1', 'A grade', [95], 'A'),
			tc('2', 'B grade', [82], 'B'),
			tc('3', 'C grade', [71], 'C'),
			tc('4', 'D grade', [65], 'D'),
			tc('5', 'F grade', [45], 'F'),
			tc('6', 'Edge: exactly 90', [90], 'A'),
			tc('7', 'Edge: exactly 80', [80], 'B'),
		],
		isPremium: false,
	},
	{
		id: 'ex-cond-002',
		primitiveId: 'conditionals',
		title: 'Leap Year Checker',
		slug: 'leap-year',
		description: 'Determine if a year is a leap year',
		difficulty: 2,
		estimatedMinutes: 8,
		instructions: `## Your Task

Create a function \`isLeapYear(year)\` that returns true if the year is a leap year.

### Leap Year Rules
1. Divisible by 4 → leap year
2. BUT if divisible by 100 → NOT a leap year
3. UNLESS also divisible by 400 → IS a leap year

### Examples
\`\`\`
isLeapYear(2024) → true   // divisible by 4
isLeapYear(2023) → false  // not divisible by 4
isLeapYear(1900) → false  // divisible by 100, not 400
isLeapYear(2000) → true   // divisible by 400
\`\`\``,
		hints: [
			'Check the most specific condition first (divisible by 400)',
			'Use the modulo operator (%) to check divisibility',
			'year % 4 === 0 means divisible by 4',
		],
		starterCode: {
			javascript: `function isLeapYear(year) {
  // Your code here
  
}`,
			python: `def is_leap_year(year):
    # Your code here
    pass`,
			go: `func isLeapYear(year int) bool {
    // Your code here
    return false
}`,
		},
		testCases: [
			tc('1', 'Regular leap year', [2024], true),
			tc('2', 'Non-leap year', [2023], false),
			tc('3', 'Century non-leap', [1900], false),
			tc('4', 'Century leap (400)', [2000], true),
			tc('5', 'Another regular leap', [2020], true),
		],
		isPremium: false,
	},
	{
		id: 'ex-cond-003',
		primitiveId: 'conditionals',
		title: 'Sign Checker',
		slug: 'sign-checker',
		description: 'Determine if a number is positive, negative, or zero',
		difficulty: 1,
		estimatedMinutes: 3,
		instructions: `## Your Task

Create a function \`getSign(num)\` that returns:
- "positive" if num > 0
- "negative" if num < 0
- "zero" if num === 0

### Examples
\`\`\`
getSign(5)  → "positive"
getSign(-3) → "negative"
getSign(0)  → "zero"
\`\`\``,
		hints: [
			'Use simple comparison operators: >, <, ===',
			'Handle the zero case explicitly',
		],
		starterCode: {
			javascript: `function getSign(num) {
  // Your code here
  
}`,
			python: `def get_sign(num):
    # Your code here
    pass`,
			go: `func getSign(num int) string {
    // Your code here
    return ""
}`,
		},
		testCases: [
			tc('1', 'Positive', [5], 'positive'),
			tc('2', 'Negative', [-3], 'negative'),
			tc('3', 'Zero', [0], 'zero'),
			tc('4', 'Large positive', [1000000], 'positive'),
			tc('5', 'Small negative', [-0.001], 'negative'),
		],
		isPremium: false,
	},

	// ============================================
	// FOR LOOP EXERCISES
	// ============================================
	{
		id: 'ex-for-001',
		primitiveId: 'for-loop',
		title: 'Sum to N',
		slug: 'sum-to-n',
		description: 'Calculate the sum of all numbers from 1 to n',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`sumToN(n)\` that returns the sum of all integers from 1 to n.

### Requirements
- Use a for loop (not a mathematical formula)
- Handle edge cases: n < 1 should return 0

### Examples
\`\`\`
sumToN(5)  → 15   // 1+2+3+4+5 = 15
sumToN(10) → 55   // 1+2+...+10 = 55
sumToN(1)  → 1
sumToN(0)  → 0
sumToN(-5) → 0
\`\`\``,
		hints: [
			'Initialize a sum variable to 0',
			'Loop from 1 to n (inclusive) using i <= n',
			'Add each i to your sum inside the loop',
		],
		starterCode: {
			javascript: `function sumToN(n) {
  // Your code here
  
}`,
			python: `def sum_to_n(n):
    # Your code here
    pass`,
			go: `func sumToN(n int) int {
    // Your code here
    return 0
}`,
		},
		testCases: [
			tc('1', 'Sum to 5', [5], 15),
			tc('2', 'Sum to 10', [10], 55),
			tc('3', 'Sum to 1', [1], 1),
			tc('4', 'Sum to 0', [0], 0),
			tc('5', 'Negative input', [-5], 0),
			tc('6', 'Larger number', [100], 5050, true),
		],
		isPremium: false,
	},
	{
		id: 'ex-for-002',
		primitiveId: 'for-loop',
		title: 'Array Sum',
		slug: 'array-sum',
		description: 'Calculate the sum of all elements in an array',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`arraySum(arr)\` that returns the sum of all numbers in the array.

### Requirements
- Use a for loop to iterate
- Handle empty arrays (return 0)

### Examples
\`\`\`
arraySum([1, 2, 3, 4, 5]) → 15
arraySum([10, 20, 30])    → 60
arraySum([])              → 0
arraySum([-1, 1])         → 0
\`\`\``,
		hints: [
			'Initialize sum to 0',
			'Loop with i from 0 to arr.length - 1',
			'Access each element with arr[i]',
		],
		starterCode: {
			javascript: `function arraySum(arr) {
  // Your code here
  
}`,
			python: `def array_sum(arr):
    # Your code here
    pass`,
			go: `func arraySum(arr []int) int {
    // Your code here
    return 0
}`,
		},
		testCases: [
			tc('1', 'Normal array', [[1, 2, 3, 4, 5]], 15),
			tc('2', 'Three elements', [[10, 20, 30]], 60),
			tc('3', 'Empty array', [[]], 0),
			tc('4', 'Canceling values', [[-1, 1]], 0),
			tc('5', 'Single element', [[42]], 42),
		],
		isPremium: false,
	},
	{
		id: 'ex-for-003',
		primitiveId: 'for-loop',
		title: 'FizzBuzz',
		slug: 'fizzbuzz',
		description: 'The classic FizzBuzz challenge',
		difficulty: 3,
		estimatedMinutes: 10,
		instructions: `## Your Task

Create a function \`fizzBuzz(n)\` that returns an array from 1 to n where:
- Numbers divisible by 3 → "Fizz"
- Numbers divisible by 5 → "Buzz"
- Numbers divisible by both → "FizzBuzz"
- Other numbers → string version of the number

### Examples
\`\`\`
fizzBuzz(5)
→ ["1", "2", "Fizz", "4", "Buzz"]

fizzBuzz(15)
→ ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
\`\`\``,
		hints: [
			'Check divisibility by both 3 AND 5 first',
			'Use modulo: n % 3 === 0 means divisible by 3',
			'Convert numbers to strings with String(n)',
		],
		starterCode: {
			javascript: `function fizzBuzz(n) {
  // Your code here
  
}`,
			python: `def fizz_buzz(n):
    # Your code here
    pass`,
			go: `func fizzBuzz(n int) []string {
    // Your code here
    return nil
}`,
		},
		testCases: [
			tc('1', 'First 5', [5], ['1', '2', 'Fizz', '4', 'Buzz']),
			tc('2', 'First 15', [15], ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']),
			tc('3', 'Just 1', [1], ['1']),
		],
		isPremium: false,
	},
	{
		id: 'ex-for-004',
		primitiveId: 'for-loop',
		title: 'Reverse String',
		slug: 'reverse-string',
		description: 'Reverse a string using a for loop',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`reverseString(str)\` that reverses a string.

### Requirements
- Use a for loop (not built-in reverse)
- Handle empty strings

### Examples
\`\`\`
reverseString("hello")  → "olleh"
reverseString("world")  → "dlrow"
reverseString("a")      → "a"
reverseString("")       → ""
\`\`\``,
		hints: [
			'Start with an empty result string',
			'Loop through the original string and add each character to the front of result',
			'Or loop backwards from the end to the start',
		],
		starterCode: {
			javascript: `function reverseString(str) {
  // Your code here
  
}`,
			python: `def reverse_string(s):
    # Your code here
    pass`,
			go: `func reverseString(s string) string {
    // Your code here
    return ""
}`,
		},
		testCases: [
			tc('1', 'Hello', ['hello'], 'olleh'),
			tc('2', 'World', ['world'], 'dlrow'),
			tc('3', 'Single char', ['a'], 'a'),
			tc('4', 'Empty', [''], ''),
			tc('5', 'Palindrome', ['racecar'], 'racecar'),
		],
		isPremium: false,
	},

	// ============================================
	// WHILE LOOP EXERCISES
	// ============================================
	{
		id: 'ex-while-001',
		primitiveId: 'while-loop',
		title: 'Countdown',
		slug: 'countdown',
		description: 'Create a countdown from n to 1',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`countdown(n)\` that returns an array counting down from n to 1.

### Examples
\`\`\`
countdown(5) → [5, 4, 3, 2, 1]
countdown(3) → [3, 2, 1]
countdown(1) → [1]
countdown(0) → []
\`\`\``,
		hints: [
			'Use a while loop that continues while n > 0',
			'Push n to the array, then decrement n',
			'Make sure you create a new array to return',
		],
		starterCode: {
			javascript: `function countdown(n) {
  // Your code here
  
}`,
			python: `def countdown(n):
    # Your code here
    pass`,
			go: `func countdown(n int) []int {
    // Your code here
    return nil
}`,
		},
		testCases: [
			tc('1', 'From 5', [5], [5, 4, 3, 2, 1]),
			tc('2', 'From 3', [3], [3, 2, 1]),
			tc('3', 'From 1', [1], [1]),
			tc('4', 'From 0', [0], []),
		],
		isPremium: false,
	},
	{
		id: 'ex-while-002',
		primitiveId: 'while-loop',
		title: 'Digit Sum',
		slug: 'digit-sum',
		description: 'Sum all digits of a number',
		difficulty: 2,
		estimatedMinutes: 8,
		instructions: `## Your Task

Create a function \`digitSum(n)\` that returns the sum of all digits in a positive integer.

### Examples
\`\`\`
digitSum(123)   → 6    // 1+2+3
digitSum(9999)  → 36   // 9+9+9+9
digitSum(5)     → 5
digitSum(0)     → 0
\`\`\`

### Hint
Use modulo (%) to get the last digit and integer division to remove it.`,
		hints: [
			'n % 10 gives you the last digit',
			'Math.floor(n / 10) removes the last digit',
			'Keep going while n > 0',
		],
		starterCode: {
			javascript: `function digitSum(n) {
  // Your code here
  
}`,
			python: `def digit_sum(n):
    # Your code here
    pass`,
			go: `func digitSum(n int) int {
    // Your code here
    return 0
}`,
		},
		testCases: [
			tc('1', 'Three digits', [123], 6),
			tc('2', 'All nines', [9999], 36),
			tc('3', 'Single digit', [5], 5),
			tc('4', 'Zero', [0], 0),
			tc('5', 'Large number', [12345], 15),
		],
		isPremium: false,
	},

	// ============================================
	// FUNCTIONS EXERCISES
	// ============================================
	{
		id: 'ex-func-001',
		primitiveId: 'functions',
		title: 'Temperature Converter',
		slug: 'temperature-converter',
		description: 'Convert between Celsius and Fahrenheit',
		difficulty: 2,
		estimatedMinutes: 8,
		instructions: `## Your Task

Create two functions:
- \`celsiusToFahrenheit(c)\` → converts Celsius to Fahrenheit
- \`fahrenheitToCelsius(f)\` → converts Fahrenheit to Celsius

### Formulas
- F = (C × 9/5) + 32
- C = (F - 32) × 5/9

### Examples
\`\`\`
celsiusToFahrenheit(0)   → 32
celsiusToFahrenheit(100) → 212
fahrenheitToCelsius(32)  → 0
fahrenheitToCelsius(212) → 100
\`\`\``,
		hints: [
			'Apply the formula directly in the return statement',
			'Be careful with order of operations',
			'Test with known values: 0°C = 32°F, 100°C = 212°F',
		],
		starterCode: {
			javascript: `function celsiusToFahrenheit(c) {
  // Your code here
}

function fahrenheitToCelsius(f) {
  // Your code here
}`,
			python: `def celsius_to_fahrenheit(c):
    # Your code here
    pass

def fahrenheit_to_celsius(f):
    # Your code here
    pass`,
			go: `func celsiusToFahrenheit(c float64) float64 {
    // Your code here
    return 0
}

func fahrenheitToCelsius(f float64) float64 {
    // Your code here
    return 0
}`,
		},
		testCases: [
			tc('1', 'Freezing C→F', [0, 'ctof'], 32),
			tc('2', 'Boiling C→F', [100, 'ctof'], 212),
			tc('3', 'Freezing F→C', [32, 'ftoc'], 0),
			tc('4', 'Boiling F→C', [212, 'ftoc'], 100),
		],
		isPremium: false,
	},
	{
		id: 'ex-func-002',
		primitiveId: 'functions',
		title: 'Calculator Functions',
		slug: 'calculator-functions',
		description: 'Create basic arithmetic functions',
		difficulty: 1,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create four functions:
- \`add(a, b)\` → returns a + b
- \`subtract(a, b)\` → returns a - b
- \`multiply(a, b)\` → returns a * b
- \`divide(a, b)\` → returns a / b (return null if b is 0)

### Examples
\`\`\`
add(5, 3)      → 8
subtract(10, 4) → 6
multiply(3, 4)  → 12
divide(10, 2)   → 5
divide(5, 0)    → null
\`\`\``,
		hints: [
			'Each function is a simple one-liner',
			'For divide, check if b is 0 first',
		],
		starterCode: {
			javascript: `function add(a, b) {
  // Your code here
}

function subtract(a, b) {
  // Your code here
}

function multiply(a, b) {
  // Your code here
}

function divide(a, b) {
  // Your code here
}`,
			python: `def add(a, b):
    pass

def subtract(a, b):
    pass

def multiply(a, b):
    pass

def divide(a, b):
    pass`,
			go: `func add(a, b float64) float64 {
    return 0
}

func subtract(a, b float64) float64 {
    return 0
}

func multiply(a, b float64) float64 {
    return 0
}

func divide(a, b float64) *float64 {
    return nil
}`,
		},
		testCases: [
			tc('1', 'Add', [5, 3, 'add'], 8),
			tc('2', 'Subtract', [10, 4, 'subtract'], 6),
			tc('3', 'Multiply', [3, 4, 'multiply'], 12),
			tc('4', 'Divide', [10, 2, 'divide'], 5),
			tc('5', 'Divide by zero', [5, 0, 'divide'], null),
		],
		isPremium: false,
	},

	// ============================================
	// ARRAYS EXERCISES
	// ============================================
	{
		id: 'ex-arr-001',
		primitiveId: 'arrays',
		title: 'Find Maximum',
		slug: 'find-maximum',
		description: 'Find the largest number in an array',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`findMax(arr)\` that returns the largest number in the array.

### Requirements
- Don't use Math.max or built-in max functions
- Handle empty arrays (return null/None)

### Examples
\`\`\`
findMax([1, 5, 3, 9, 2]) → 9
findMax([-5, -1, -10])   → -1
findMax([42])            → 42
findMax([])              → null
\`\`\``,
		hints: [
			'Handle empty array first',
			'Assume the first element is the max',
			'Loop through and update max when you find larger',
		],
		starterCode: {
			javascript: `function findMax(arr) {
  // Your code here
  
}`,
			python: `def find_max(arr):
    # Your code here
    pass`,
			go: `func findMax(arr []int) *int {
    // Your code here
    return nil
}`,
		},
		testCases: [
			tc('1', 'Mixed positives', [[1, 5, 3, 9, 2]], 9),
			tc('2', 'All negatives', [[-5, -1, -10]], -1),
			tc('3', 'Single element', [[42]], 42),
			tc('4', 'Empty array', [[]], null),
			tc('5', 'Duplicates', [[7, 7, 7]], 7),
		],
		isPremium: false,
	},
	{
		id: 'ex-arr-002',
		primitiveId: 'arrays',
		title: 'Count Occurrences',
		slug: 'count-occurrences',
		description: 'Count how many times a value appears in an array',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`countOccurrences(arr, target)\` that counts how many times target appears.

### Examples
\`\`\`
countOccurrences([1, 2, 3, 2, 2], 2)    → 3
countOccurrences(["a", "b", "a"], "a") → 2
countOccurrences([1, 2, 3], 5)          → 0
countOccurrences([], 1)                 → 0
\`\`\``,
		hints: [
			'Initialize a counter to 0',
			'Loop through and increment when you find a match',
			'Use === for comparison',
		],
		starterCode: {
			javascript: `function countOccurrences(arr, target) {
  // Your code here
  
}`,
			python: `def count_occurrences(arr, target):
    # Your code here
    pass`,
			go: `func countOccurrences(arr []interface{}, target interface{}) int {
    // Your code here
    return 0
}`,
		},
		testCases: [
			tc('1', 'Multiple matches', [[1, 2, 3, 2, 2], 2], 3),
			tc('2', 'String matches', [['a', 'b', 'a'], 'a'], 2),
			tc('3', 'No matches', [[1, 2, 3], 5], 0),
			tc('4', 'Empty array', [[], 1], 0),
		],
		isPremium: false,
	},
	{
		id: 'ex-arr-003',
		primitiveId: 'arrays',
		title: 'Remove Duplicates',
		slug: 'remove-duplicates',
		description: 'Remove duplicate values from an array',
		difficulty: 3,
		estimatedMinutes: 10,
		instructions: `## Your Task

Create a function \`removeDuplicates(arr)\` that returns a new array with duplicates removed.

### Requirements
- Preserve the original order (first occurrence)
- Don't modify the original array

### Examples
\`\`\`
removeDuplicates([1, 2, 2, 3, 1]) → [1, 2, 3]
removeDuplicates(["a", "b", "a"]) → ["a", "b"]
removeDuplicates([1, 1, 1])       → [1]
removeDuplicates([])              → []
\`\`\``,
		hints: [
			'Create a new empty array for results',
			'For each element, check if it\'s already in results',
			'Only add if not already present',
		],
		starterCode: {
			javascript: `function removeDuplicates(arr) {
  // Your code here
  
}`,
			python: `def remove_duplicates(arr):
    # Your code here
    pass`,
			go: `func removeDuplicates(arr []interface{}) []interface{} {
    // Your code here
    return nil
}`,
		},
		testCases: [
			tc('1', 'Numbers', [[1, 2, 2, 3, 1]], [1, 2, 3]),
			tc('2', 'Strings', [['a', 'b', 'a']], ['a', 'b']),
			tc('3', 'All same', [[1, 1, 1]], [1]),
			tc('4', 'Empty', [[]], []),
			tc('5', 'No duplicates', [[1, 2, 3]], [1, 2, 3]),
		],
		isPremium: false,
	},

	// ============================================
	// MAP & FILTER EXERCISES
	// ============================================
	{
		id: 'ex-mapfilter-001',
		primitiveId: 'map-filter',
		title: 'Double All',
		slug: 'double-all',
		description: 'Double every number in an array using map',
		difficulty: 2,
		estimatedMinutes: 3,
		instructions: `## Your Task

Create a function \`doubleAll(arr)\` that returns a new array with all numbers doubled.

### Requirements
- Use map (not a manual loop)

### Examples
\`\`\`
doubleAll([1, 2, 3])  → [2, 4, 6]
doubleAll([0, 5, 10]) → [0, 10, 20]
doubleAll([])         → []
\`\`\``,
		hints: [
			'Use arr.map() with a callback function',
			'The callback receives each element',
			'Return the doubled value from the callback',
		],
		starterCode: {
			javascript: `function doubleAll(arr) {
  // Your code here - use map!
  
}`,
			python: `def double_all(arr):
    # Your code here - use list comprehension or map!
    pass`,
			go: `func doubleAll(arr []int) []int {
    // Your code here
    return nil
}`,
		},
		testCases: [
			tc('1', 'Basic', [[1, 2, 3]], [2, 4, 6]),
			tc('2', 'With zero', [[0, 5, 10]], [0, 10, 20]),
			tc('3', 'Empty', [[]], []),
			tc('4', 'Negatives', [[-1, -2]], [-2, -4]),
		],
		isPremium: false,
	},
	{
		id: 'ex-mapfilter-002',
		primitiveId: 'map-filter',
		title: 'Filter Evens',
		slug: 'filter-evens',
		description: 'Keep only even numbers using filter',
		difficulty: 2,
		estimatedMinutes: 3,
		instructions: `## Your Task

Create a function \`filterEvens(arr)\` that returns only the even numbers.

### Requirements
- Use filter (not a manual loop)

### Examples
\`\`\`
filterEvens([1, 2, 3, 4, 5]) → [2, 4]
filterEvens([1, 3, 5])       → []
filterEvens([2, 4, 6])       → [2, 4, 6]
\`\`\``,
		hints: [
			'Use arr.filter() with a callback',
			'Return true to keep the element',
			'n % 2 === 0 checks if even',
		],
		starterCode: {
			javascript: `function filterEvens(arr) {
  // Your code here - use filter!
  
}`,
			python: `def filter_evens(arr):
    # Your code here - use list comprehension or filter!
    pass`,
			go: `func filterEvens(arr []int) []int {
    // Your code here
    return nil
}`,
		},
		testCases: [
			tc('1', 'Mixed', [[1, 2, 3, 4, 5]], [2, 4]),
			tc('2', 'All odds', [[1, 3, 5]], []),
			tc('3', 'All evens', [[2, 4, 6]], [2, 4, 6]),
			tc('4', 'With zero', [[0, 1, 2]], [0, 2]),
		],
		isPremium: false,
	},
];

// ============================================
// Helper Functions
// ============================================

export function getExerciseById(id: string): Exercise | undefined {
	return ALL_EXERCISES.find(e => e.id === id);
}

export function getExercisesForPrimitive(primitiveId: string): Exercise[] {
	return ALL_EXERCISES.filter(e => e.primitiveId === primitiveId);
}

export function getFreeExercises(): Exercise[] {
	return ALL_EXERCISES.filter(e => !e.isPremium);
}

export function getExercisesByDifficulty(difficulty: number): Exercise[] {
	return ALL_EXERCISES.filter(e => e.difficulty === difficulty);
}

