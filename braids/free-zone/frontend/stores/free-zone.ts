// ============================================
// Free Zone Store - Track anonymous user progress
// ============================================

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// ============================================
// Configuration
// ============================================

export const FREE_ZONE_CONFIG = {
	maxFreeLessons: 3,          // Total free lessons allowed
	maxFreeExercises: 3,        // Total free exercises allowed
	maxHintsPerExercise: 1,     // Hints allowed per exercise in free mode
	showSignupAfter: 2,         // Show signup prompt after N completions
	storageKey: 'pp_free_zone', // localStorage key
	toolId: 'variables',        // The tool we're showcasing in free zone
};

// ============================================
// Types
// ============================================

export interface FreeZoneState {
	lessonsCompleted: string[];    // Lesson IDs completed
	lessonsStarted: string[];      // Lesson IDs started
	exercisesCompleted: string[];  // Exercise IDs completed
	exercisesStarted: string[];    // Exercise IDs started
	hintsUsed: number;             // Total hints used
	firstVisit: string;            // ISO timestamp
	lastVisit: string;             // ISO timestamp
	signupPromptsSeen: number;     // How many times prompted
	signupDismissedAt?: string;    // When they dismissed
}

// ============================================
// Free Content Definition
// ============================================

// ============================================
// Free Lesson Content - Built-in, no API needed
// ============================================

export interface FreeLesson {
	id: string;
	title: string;
	description: string;
	estimatedMinutes: number;
	content: string; // Markdown content
}

export const FREE_LESSONS_DATA: FreeLesson[] = [
	{
		id: 'free-lesson-001',
		title: 'What is a Variable?',
		description: 'Understand the concept of variables as containers for data.',
		estimatedMinutes: 4,
		content: `## The Container Metaphor

Think of a variable as a **labeled box** that holds something. Just like you might have a box labeled "Books" in your room, a variable has a name and stores a value.

### Why Use Variables?

Variables let us:
- **Store data** to use later
- **Give meaningful names** to values
- **Change values** as our program runs
- **Reuse information** without repeating ourselves

### Real World Example

Imagine keeping score in a game:
- You need a place to store the score (a variable)
- The score starts at 0
- Every time someone scores, you update it
- You can check the score at any time

\`\`\`javascript
// This is how we'd do it in code:
let score = 0;      // Start with 0
score = score + 10; // Add 10 points
score = score + 5;  // Add 5 more
// score is now 15
\`\`\`

### Key Takeaway

A variable is simply a **name that refers to a value**. The value can be a number, text, or many other types of data.`
	},
	{
		id: 'free-lesson-002', 
		title: 'Declaring Variables',
		description: 'Learn how to create variables in your code.',
		estimatedMinutes: 5,
		content: `## Creating Your First Variable

To use a variable, you first need to **declare** it - tell the computer "I want to create a variable with this name."

### The Syntax

In JavaScript, we use keywords to declare variables:

\`\`\`javascript
let playerName;     // Declares a variable called playerName
let score;          // Declares a variable called score
let isGameOver;     // Declares a variable called isGameOver
\`\`\`

### let vs const

There are two main ways to declare variables:

**\`let\`** - For values that might change:
\`\`\`javascript
let score = 0;       // Score will change during the game
let currentLevel = 1; // Level increases as you progress
\`\`\`

**\`const\`** - For values that stay the same:
\`\`\`javascript
const maxLives = 3;      // This never changes
const gameName = "Quest"; // The name stays constant
\`\`\`

### Naming Rules

Variable names must:
- Start with a letter, \`_\`, or \`$\`
- Contain only letters, numbers, \`_\`, or \`$\`
- Not be a reserved word (like \`let\` or \`if\`)

\`\`\`javascript
// Good names ✓
let userName;
let player1Score;
let _privateValue;

// Bad names ✗
let 1stPlace;    // Can't start with number
let user-name;   // Can't use hyphens
let let;         // Can't use reserved words
\`\`\`

### Best Practice: Use Descriptive Names

\`\`\`javascript
// Unclear
let x = 25;

// Clear and descriptive  
let playerAge = 25;
\`\`\``
	},
	{
		id: 'free-lesson-003',
		title: 'Assigning Values',
		description: 'Learn how to give variables their values.',
		estimatedMinutes: 4,
		content: `## Putting Values in Variables

**Assignment** is when we put a value into a variable. We use the \`=\` sign (called the assignment operator).

### Basic Assignment

\`\`\`javascript
let greeting = "Hello!";  // Assign text (a string)
let age = 25;             // Assign a number
let isActive = true;      // Assign a boolean (true/false)
\`\`\`

### Changing Values

With \`let\`, you can change a variable's value anytime:

\`\`\`javascript
let mood = "happy";
console.log(mood);  // Output: happy

mood = "excited";   // Change the value
console.log(mood);  // Output: excited

mood = "hungry";    // Change it again
console.log(mood);  // Output: hungry
\`\`\`

### Types of Values

Variables can hold different **types** of data:

| Type | Example | Description |
|------|---------|-------------|
| String | \`"Hello"\` | Text in quotes |
| Number | \`42\` | Numbers (no quotes) |
| Boolean | \`true\` | True or false |

\`\`\`javascript
let name = "Alex";        // String - text
let score = 100;          // Number - whole number  
let price = 19.99;        // Number - decimal
let isWinner = true;      // Boolean - true/false
\`\`\`

### Common Mistake: Quotes Matter!

\`\`\`javascript
let age = 25;      // This is a NUMBER
let age = "25";    // This is a STRING (text)

// They look similar but behave differently:
let a = 5 + 5;     // Result: 10 (math)
let b = "5" + "5"; // Result: "55" (text joined together)
\`\`\`

### Key Takeaway

The \`=\` sign doesn't mean "equals" in programming - it means "store this value in this variable."`
	}
];

/** Free practice exercises */
export interface FreeExercise {
	id: string;
	title: string;
	description: string;
	difficulty: number;
	estimatedMinutes: number;
	instructions: string;
	hints: string[];
	starterCode: Record<string, string>;
	testCases: { input: string; expected: string; name: string }[];
}

export const FREE_EXERCISES_DATA: FreeExercise[] = [
	{
		id: 'free-ex-001',
		title: 'Create Your First Variable',
		description: 'Practice what you learned - create any variable!',
		difficulty: 1,
		estimatedMinutes: 2,
		instructions: `## Your First Variable! 🎉

Now it's your turn! Create a variable that holds some text.

## What to do

Type this pattern:
\`\`\`
let myName = "your text here"
\`\`\`

**Replace** \`myName\` with any name you want, and \`"your text here"\` with any text you like!

## Examples that work ✓

\`\`\`javascript
let greeting = "Hello"
\`\`\`

\`\`\`javascript
let favoriteColor = "blue"
\`\`\`

\`\`\`javascript
const myPet = "dog"
\`\`\`

## Remember
- Start with \`let\` or \`const\`
- Then your variable name (letters only, no spaces)
- Then \`=\`
- Then your text in quotes \`"like this"\``,
		hints: ['Try: let name = "Alex"', 'Make sure your text is wrapped in quotes like "hello"'],
		starterCode: {
			javascript: '// Type your variable below:\n\n',
			python: '# Type your variable below:\n\n',
		},
		testCases: [
			{ input: '', expected: 'variable_declaration', name: 'Created a variable with a string value' }
		]
	},
	{
		id: 'free-ex-002',
		title: 'Text vs Numbers',
		description: 'Learn the difference between text and number values.',
		difficulty: 1,
		estimatedMinutes: 3,
		instructions: `## Two Types of Values 📝🔢

Variables can hold different types of data. Let's try two:

**Text (Strings)** - Always use quotes:
\`\`\`javascript
let firstName = "Alex"
\`\`\`

**Numbers** - No quotes needed:
\`\`\`javascript
let age = 25
\`\`\`

## Your Task

Create these two variables:

1. **firstName** - set it to your name (in quotes)
2. **age** - set it to your age (no quotes!)

## Example Solution

\`\`\`javascript
let firstName = "Sam"
let age = 30
\`\`\`

## Remember
- Text goes in quotes: \`"hello"\`
- Numbers have no quotes: \`42\``,
		hints: ['Numbers don\'t need quotes - just type: let age = 25', 'Text needs quotes - type: let firstName = "Alex"'],
		starterCode: {
			javascript: '// Create your firstName variable (text in quotes)\n\n// Create your age variable (number, no quotes)\n\n',
			python: '# Create your two variables here\n\n',
		},
		testCases: [
			{ input: '', expected: 'string', name: 'firstName is a string' },
			{ input: '', expected: 'number', name: 'age is a number' }
		]
	},
	{
		id: 'free-ex-003',
		title: 'Combine Variables',
		description: 'Join two text variables together.',
		difficulty: 1,
		estimatedMinutes: 4,
		instructions: `## Joining Text Together ➕

You can combine (concatenate) text using the \`+\` symbol!

\`\`\`javascript
let first = "Hello"
let second = "World"
let combined = first + second  // "HelloWorld"
\`\`\`

**Tip:** Add a space between words:
\`\`\`javascript
let combined = first + " " + second  // "Hello World"
\`\`\`

## Your Task

Create a full name from first and last name:

1. Create \`firstName\` with any name you like
2. Create \`lastName\` with any last name  
3. Create \`fullName\` by combining them with a space

## Example

\`\`\`javascript
let firstName = "Jane"
let lastName = "Doe"
let fullName = firstName + " " + lastName
// fullName is now "Jane Doe"
\`\`\`

Use your own name or make one up!`,
		hints: ['Don\'t forget the space! Use: firstName + " " + lastName', 'fullName should equal firstName, a space, then lastName'],
		starterCode: {
			javascript: '// Step 1: Create firstName (any name you want!)\n\n// Step 2: Create lastName\n\n// Step 3: Combine them into fullName\n\n',
			python: '# Create firstName, lastName, and fullName\n\n',
		},
		testCases: [
			{ input: '', expected: 'combined', name: 'fullName combines firstName and lastName' }
		]
	}
];

// ============================================
// Default State
// ============================================

const defaultState: FreeZoneState = {
	lessonsCompleted: [],
	lessonsStarted: [],
	exercisesCompleted: [],
	exercisesStarted: [],
	hintsUsed: 0,
	firstVisit: new Date().toISOString(),
	lastVisit: new Date().toISOString(),
	signupPromptsSeen: 0,
};

// ============================================
// Load/Save from localStorage
// ============================================

function loadState(): FreeZoneState {
	if (!browser) return { ...defaultState };
	
	try {
		const stored = localStorage.getItem(FREE_ZONE_CONFIG.storageKey);
		if (stored) {
			const parsed = JSON.parse(stored);
			// Merge with defaults to ensure all fields exist (handles schema migrations)
			const merged: FreeZoneState = {
				...defaultState,
				...parsed,
				// Ensure arrays exist (in case of old localStorage data)
				lessonsCompleted: parsed.lessonsCompleted || [],
				lessonsStarted: parsed.lessonsStarted || [],
				exercisesCompleted: parsed.exercisesCompleted || [],
				exercisesStarted: parsed.exercisesStarted || [],
				lastVisit: new Date().toISOString(),
			};
			return merged;
		}
	} catch (e) {
		console.error('Failed to load free zone state:', e);
	}
	
	return { ...defaultState };
}

function saveState(state: FreeZoneState): void {
	if (!browser) return;
	
	try {
		localStorage.setItem(FREE_ZONE_CONFIG.storageKey, JSON.stringify(state));
	} catch (e) {
		console.error('Failed to save free zone state:', e);
	}
}

// ============================================
// Store
// ============================================

function createFreeZoneStore() {
	const { subscribe, set, update } = writable<FreeZoneState>(loadState());
	
	// Auto-save on changes
	subscribe((state) => {
		saveState(state);
	});
	
	return {
		subscribe,
		set,
		update,
		
		/**
		 * Mark a lesson as started
		 */
		startLesson: (lessonId: string) => {
			update(state => {
				if (!state.lessonsStarted.includes(lessonId)) {
					return {
						...state,
						lessonsStarted: [...state.lessonsStarted, lessonId],
						lastVisit: new Date().toISOString(),
					};
				}
				return state;
			});
		},
		
		/**
		 * Mark a lesson as completed
		 */
		completeLesson: (lessonId: string) => {
			update(state => {
				if (!state.lessonsCompleted.includes(lessonId)) {
					return {
						...state,
						lessonsCompleted: [...state.lessonsCompleted, lessonId],
						lastVisit: new Date().toISOString(),
					};
				}
				return state;
			});
		},
		
		/**
		 * Mark an exercise as started
		 */
		startExercise: (exerciseId: string) => {
			update(state => {
				if (!state.exercisesStarted.includes(exerciseId)) {
					return {
						...state,
						exercisesStarted: [...state.exercisesStarted, exerciseId],
						lastVisit: new Date().toISOString(),
					};
				}
				return state;
			});
		},
		
		/**
		 * Mark an exercise as completed
		 */
		completeExercise: (exerciseId: string) => {
			update(state => {
				if (!state.exercisesCompleted.includes(exerciseId)) {
					return {
						...state,
						exercisesCompleted: [...state.exercisesCompleted, exerciseId],
						lastVisit: new Date().toISOString(),
					};
				}
				return state;
			});
		},
		
		/**
		 * Use a hint
		 */
		useHint: () => {
			update(state => ({
				...state,
				hintsUsed: state.hintsUsed + 1,
				lastVisit: new Date().toISOString(),
			}));
		},
		
		/**
		 * Record that user saw signup prompt
		 */
		sawSignupPrompt: () => {
			update(state => ({
				...state,
				signupPromptsSeen: state.signupPromptsSeen + 1,
				lastVisit: new Date().toISOString(),
			}));
		},
		
		/**
		 * Record that user dismissed signup
		 */
		dismissedSignup: () => {
			update(state => ({
				...state,
				signupDismissedAt: new Date().toISOString(),
				lastVisit: new Date().toISOString(),
			}));
		},
		
		/**
		 * Reset all progress (for testing)
		 */
		reset: () => {
			set({ ...defaultState, firstVisit: new Date().toISOString() });
		},
	};
}

export const freeZone = createFreeZoneStore();

// ============================================
// Derived Stores
// ============================================

/** Number of lessons completed */
export const completedLessonsCount = derived(freeZone, $state => 
	($state.lessonsCompleted || []).length
);

/** Number of exercises completed */
export const completedExercisesCount = derived(freeZone, $state => 
	($state.exercisesCompleted || []).length
);

/** Total items completed (lessons + exercises) */
export const totalCompletedCount = derived(freeZone, $state => 
	($state.lessonsCompleted || []).length + ($state.exercisesCompleted || []).length
);

/** Number of lessons remaining */
export const remainingLessons = derived(freeZone, $state => 
	Math.max(0, FREE_ZONE_CONFIG.maxFreeLessons - ($state.lessonsCompleted || []).length)
);

/** Number of exercises remaining */
export const remainingExercises = derived(freeZone, $state => 
	Math.max(0, FREE_ZONE_CONFIG.maxFreeExercises - ($state.exercisesCompleted || []).length)
);

/** Has completed all free content? */
export const hasCompletedAllFree = derived(freeZone, $state => 
	($state.lessonsCompleted || []).length >= FREE_ZONE_CONFIG.maxFreeLessons &&
	($state.exercisesCompleted || []).length >= FREE_ZONE_CONFIG.maxFreeExercises
);

/** Should show signup prompt? */
export const shouldShowSignupPrompt = derived(freeZone, $state => {
	const totalCompleted = ($state.lessonsCompleted || []).length + ($state.exercisesCompleted || []).length;
	// Show after completing showSignupAfter items
	if (totalCompleted >= FREE_ZONE_CONFIG.showSignupAfter) {
		// But not if they just dismissed it recently (within 5 min)
		if ($state.signupDismissedAt) {
			const dismissedAt = new Date($state.signupDismissedAt);
			const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
			if (dismissedAt > fiveMinAgo) {
				return false;
			}
		}
		return true;
	}
	return false;
});

/** Can use hint in current exercise? */
export const canUseHint = derived(freeZone, $state => 
	$state.hintsUsed < FREE_ZONE_CONFIG.maxHintsPerExercise * ($state.exercisesStarted.length || 1)
);

/** Check if user has completed a lesson */
export function hasCompletedLesson(lessonId: string): boolean {
	const state = get(freeZone);
	return state.lessonsCompleted.includes(lessonId);
}

/** Check if user has completed an exercise */
export function hasCompletedExercise(exerciseId: string): boolean {
	const state = get(freeZone);
	return state.exercisesCompleted.includes(exerciseId);
}

/** Get a free exercise by ID */
export function getFreeExercise(id: string): FreeExercise | undefined {
	return FREE_EXERCISES_DATA.find(ex => ex.id === id);
}

/** For backwards compatibility */
export const hasReachedLimit = hasCompletedAllFree;
export const completedCount = totalCompletedCount;

