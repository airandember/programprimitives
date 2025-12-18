// ============================================
// Mock Data - Temporary data for development
// ============================================
//
// This file contains mock data for features that haven't been
// fully implemented yet. Data is progressively removed as
// real implementations are built.
//
// ✅ REMOVED: mockUser (see braids/auth)
// ✅ REMOVED: mockPrimitives (see braids/primitives)
// ⏳ TODO: mockExercises (will be in braids/exercises)
// ⏳ TODO: mockAchievements (will be in braids/gamification)
// ⏳ TODO: mockProgress (will be in braids/progress)
// ⏳ TODO: mockMastery (will be in braids/progress)
//

import type { Exercise, Achievement, UserProgress, MasteryLevel } from './types';

// ============================================
// Exercises (TODO: Move to braids/exercises)
// ============================================

export const mockExercises: Exercise[] = [
	{
		id: 'ex-001',
		primitiveId: 'for-loop',
		title: 'Sum of Numbers',
		slug: 'sum-of-numbers',
		description: 'Calculate the sum of all numbers from 1 to n using a for loop',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`sumToN(n)\` that returns the sum of all integers from 1 to n.

### Requirements
- Use a for loop (not a mathematical formula)
- Handle edge cases (n < 1 should return 0)

### Examples
\`\`\`
sumToN(5)  → 15   // 1+2+3+4+5 = 15
sumToN(10) → 55
sumToN(0)  → 0
\`\`\``,
		hints: [
			'Start with a variable to store your running total, initialized to 0',
			'Loop from 1 to n (inclusive) using i <= n',
			'Add each number i to your total inside the loop'
		],
		starterCode: 'function sumToN(n) {\n  // Your code here\n  \n}',
		isPremium: false
	},
	{
		id: 'ex-002',
		primitiveId: 'for-loop',
		title: 'Array Sum',
		slug: 'array-sum',
		description: 'Calculate the sum of all elements in an array',
		difficulty: 2,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`arraySum(arr)\` that returns the sum of all numbers in the array.

### Requirements
- Use a for loop to iterate through the array
- Handle empty arrays (return 0)

### Examples
\`\`\`
arraySum([1, 2, 3, 4, 5]) → 15
arraySum([10, 20, 30])    → 60
arraySum([])              → 0
\`\`\``,
		hints: [
			'Initialize a sum variable to 0',
			'Loop from i = 0 to i < arr.length',
			'Access each element with arr[i]'
		],
		starterCode: 'function arraySum(arr) {\n  // Your code here\n  \n}',
		isPremium: false
	},
	{
		id: 'ex-003',
		primitiveId: 'for-loop',
		title: 'FizzBuzz',
		slug: 'fizzbuzz',
		description: 'The classic FizzBuzz challenge',
		difficulty: 3,
		estimatedMinutes: 10,
		instructions: `## Your Task

Create a function \`fizzBuzz(n)\` that returns an array of strings from 1 to n where:
- Numbers divisible by 3 are replaced with "Fizz"
- Numbers divisible by 5 are replaced with "Buzz"  
- Numbers divisible by both are replaced with "FizzBuzz"
- Other numbers are converted to strings

### Examples
\`\`\`
fizzBuzz(5) → ["1", "2", "Fizz", "4", "Buzz"]
fizzBuzz(15) → ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
\`\`\``,
		hints: [
			'Use the modulo operator (%) to check divisibility',
			'Check for divisibility by both 3 AND 5 first',
			'Convert numbers to strings with String(n) or n.toString()'
		],
		starterCode: 'function fizzBuzz(n) {\n  // Your code here\n  \n}',
		isPremium: false
	},
	{
		id: 'ex-004',
		primitiveId: 'variables',
		title: 'Variable Swap',
		slug: 'variable-swap',
		description: 'Swap the values of two variables',
		difficulty: 1,
		estimatedMinutes: 3,
		instructions: `## Your Task

Create a function \`swap(a, b)\` that returns an array with the values swapped.

### Requirements
- Use a temporary variable to perform the swap

### Examples
\`\`\`
swap(1, 2) → [2, 1]
swap("hello", "world") → ["world", "hello"]
\`\`\``,
		hints: [
			"You'll need a third variable to temporarily hold one value",
			'Store a in temp, then assign b to a, then assign temp to b'
		],
		starterCode: 'function swap(a, b) {\n  // Your code here\n  \n}',
		isPremium: false
	},
	{
		id: 'ex-005',
		primitiveId: 'conditionals',
		title: 'Grade Calculator',
		slug: 'grade-calculator',
		description: 'Convert a numeric score to a letter grade',
		difficulty: 1,
		estimatedMinutes: 5,
		instructions: `## Your Task

Create a function \`getGrade(score)\` that returns the letter grade:
- 90-100: "A"
- 80-89: "B"
- 70-79: "C"
- 60-69: "D"
- Below 60: "F"

### Examples
\`\`\`
getGrade(95) → "A"
getGrade(82) → "B"
getGrade(45) → "F"
\`\`\``,
		hints: [
			'Start with the highest grade and work down',
			'Use >= for the comparisons',
			"Remember to handle the 'F' case at the end"
		],
		starterCode: 'function getGrade(score) {\n  // Your code here\n  \n}',
		isPremium: false
	},
];

// ============================================
// Achievements (TODO: Move to braids/gamification)
// ============================================

export const mockAchievements: Achievement[] = [
	{ id: '1', name: 'First Steps', description: 'Complete your first exercise', category: 'milestone', icon: '👣', xpReward: 50, rarity: 'common', unlocked: true, unlockedAt: '2024-01-15' },
	{ id: '2', name: 'Getting Started', description: 'Complete 5 exercises', category: 'milestone', icon: '🚀', xpReward: 100, rarity: 'common', unlocked: true, unlockedAt: '2024-01-18' },
	{ id: '3', name: 'Streak Starter', description: '7-day streak', category: 'consistency', icon: '🔥', xpReward: 100, rarity: 'common', unlocked: true, unlockedAt: '2024-01-22' },
	{ id: '4', name: 'Loop Legend', description: 'Master all loop primitives', category: 'mastery', icon: '🔄', xpReward: 300, rarity: 'rare', unlocked: false },
	{ id: '5', name: 'Week Warrior', description: '14-day streak', category: 'consistency', icon: '⚔️', xpReward: 200, rarity: 'rare', unlocked: false },
	{ id: '6', name: 'Century Club', description: 'Complete 100 exercises', category: 'milestone', icon: '🏆', xpReward: 500, rarity: 'epic', unlocked: false },
	{ id: '7', name: 'Polyglot', description: 'Use 3 different languages', category: 'skill', icon: '🌍', xpReward: 150, rarity: 'rare', unlocked: false },
	{ id: '8', name: 'Perfect Score', description: 'Get 100% on first attempt', category: 'skill', icon: '💯', xpReward: 75, rarity: 'common', unlocked: true, unlockedAt: '2024-01-20' },
];

// ============================================
// Progress (TODO: Move to braids/progress)
// ============================================

export const mockProgress: UserProgress = {
	totalExercisesCompleted: 23,
	totalPrimitivesMastered: 3,
	totalTimeSpentMinutes: 245,
	totalXp: 1850,
	currentLevel: 7,
	currentDailyStreak: 12,
	longestDailyStreak: 23,
	lastActivityAt: new Date().toISOString()
};

export const mockMastery: MasteryLevel[] = [
	{ primitiveId: 'for-loop', primitiveName: 'For Loop', language: 'javascript', level: 5, exercisesCompleted: 8, exercisesAvailable: 8, averageScore: 94 },
	{ primitiveId: 'variables', primitiveName: 'Variables', language: 'javascript', level: 5, exercisesCompleted: 5, exercisesAvailable: 5, averageScore: 98 },
	{ primitiveId: 'conditionals', primitiveName: 'Conditionals', language: 'javascript', level: 4, exercisesCompleted: 6, exercisesAvailable: 7, averageScore: 89 },
	{ primitiveId: 'while-loop', primitiveName: 'While Loop', language: 'javascript', level: 3, exercisesCompleted: 4, exercisesAvailable: 6, averageScore: 82 },
	{ primitiveId: 'functions', primitiveName: 'Functions', language: 'javascript', level: 3, exercisesCompleted: 5, exercisesAvailable: 8, averageScore: 85 },
	{ primitiveId: 'arrays', primitiveName: 'Arrays', language: 'javascript', level: 2, exercisesCompleted: 3, exercisesAvailable: 7, averageScore: 78 },
	{ primitiveId: 'for-loop', primitiveName: 'For Loop', language: 'python', level: 2, exercisesCompleted: 3, exercisesAvailable: 8, averageScore: 88 },
	{ primitiveId: 'objects', primitiveName: 'Objects', language: 'javascript', level: 1, exercisesCompleted: 1, exercisesAvailable: 6, averageScore: 72 }
];

// ============================================
// Helper Functions
// ============================================

/** Get exercises for a primitive */
export function getExercisesForPrimitive(primitiveId: string): Exercise[] {
	return mockExercises.filter(e => e.primitiveId === primitiveId);
}

/** Get mastery for a primitive in a language */
export function getMasteryForPrimitive(primitiveId: string, language: string = 'javascript'): MasteryLevel | undefined {
	return mockMastery.find(m => m.primitiveId === primitiveId && m.language === language);
}
