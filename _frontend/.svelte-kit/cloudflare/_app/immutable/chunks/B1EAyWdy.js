const r=[{id:"variables",name:"Variables",category:"fundamentals",subcategory:"basics",description:"Named storage locations that hold data values",whyItMatters:"Variables are the foundation of all programming. They allow you to store, retrieve, and manipulate data.",bestPractices:["Use descriptive names that indicate purpose","Follow naming conventions (camelCase, snake_case)","Initialize variables before use","Use const/final for values that won't change"],pitfalls:["Using single-letter names except for loop counters","Shadowing variables in nested scopes","Not initializing before use"],difficulty:1,icon:"📦",isPremium:!1},{id:"operators",name:"Operators",category:"fundamentals",subcategory:"basics",description:"Symbols that perform operations on values and variables",whyItMatters:"Operators let you manipulate data - from simple math to complex logical decisions.",bestPractices:["Use parentheses for clarity in complex expressions","Understand operator precedence","Use === over == in JavaScript for type safety"],pitfalls:["Confusing = (assignment) with == (comparison)","Integer division truncation","Operator precedence mistakes"],difficulty:1,icon:"➕",isPremium:!1},{id:"conditionals",name:"Conditionals",category:"fundamentals",subcategory:"control-flow",description:"Execute different code based on whether conditions are true or false",whyItMatters:"Conditionals let your program make decisions. They're how you handle different scenarios.",bestPractices:["Keep conditions simple and readable","Use early returns to reduce nesting","Consider switch for multiple discrete values"],pitfalls:["Deeply nested if statements","Using == instead of === in JS","Not considering all edge cases"],difficulty:1,icon:"🔀",isPremium:!1},{id:"for-loop",name:"For Loop",category:"fundamentals",subcategory:"loops",description:"Execute code a specific number of times with a counter",whyItMatters:"For loops are essential for processing collections and repeating operations. They're one of the most frequently used constructs.",bestPractices:["Use meaningful iterator variable names","Avoid modifying loop variable inside the loop","Consider forEach/map for array iteration"],pitfalls:["Off-by-one errors (i <= n vs i < n)","Infinite loops when condition never false","Modifying array length while iterating"],difficulty:2,icon:"🔄",isPremium:!1},{id:"while-loop",name:"While Loop",category:"fundamentals",subcategory:"loops",description:"Execute code repeatedly while a condition remains true",whyItMatters:"While loops are perfect when you don't know how many iterations you need.",bestPractices:["Ensure the condition will eventually become false","Consider do-while when you need at least one iteration","Add safety limits for potentially infinite loops"],pitfalls:["Forgetting to update the condition variable","Creating infinite loops","Using while when for is clearer"],difficulty:2,icon:"🔁",isPremium:!1},{id:"functions",name:"Functions",category:"fundamentals",subcategory:"modularity",description:"Reusable blocks of code that perform specific tasks",whyItMatters:"Functions are the building blocks of organized code. They promote reuse and make complex programs manageable.",bestPractices:["Single responsibility - one function, one job","Use descriptive names that indicate action","Keep functions short (under 20 lines ideal)"],pitfalls:["Functions that do too many things","Side effects that aren't obvious","Too many parameters"],difficulty:2,icon:"⚡",isPremium:!1},{id:"arrays",name:"Arrays",category:"data-structures",subcategory:"linear",description:"Ordered collections of elements accessed by index",whyItMatters:"Arrays are fundamental for storing lists of data. They're used everywhere - from user lists to game scores.",bestPractices:["Use meaningful variable names","Check bounds before accessing","Consider using array methods over manual loops"],pitfalls:["Index out of bounds errors","Mutating arrays when you shouldn't","Off-by-one with array length"],difficulty:2,icon:"📊",isPremium:!1},{id:"objects",name:"Objects / Dictionaries",category:"data-structures",subcategory:"associative",description:"Collections of key-value pairs for structured data",whyItMatters:"Objects let you group related data together with meaningful names. They're essential for representing real-world entities.",bestPractices:["Use descriptive key names","Keep objects focused on one concept","Consider immutability for shared state"],pitfalls:["Accessing non-existent keys","Mutating shared objects","Deep vs shallow copy confusion"],difficulty:2,icon:"🗂️",isPremium:!1},{id:"recursion",name:"Recursion",category:"advanced",subcategory:"patterns",description:"Functions that call themselves to solve problems",whyItMatters:"Recursion is powerful for solving problems that have self-similar subproblems, like tree traversal.",bestPractices:["Always have a base case","Ensure progress toward base case","Consider tail recursion for optimization"],pitfalls:["Missing or wrong base case","Stack overflow from too many calls","Using recursion when iteration is simpler"],difficulty:4,icon:"🌀",isPremium:!0},{id:"async",name:"Async Programming",category:"advanced",subcategory:"concurrency",description:"Handle operations that take time without blocking",whyItMatters:"Modern apps need to handle network requests, file I/O, and user interactions without freezing.",bestPractices:["Use async/await over raw promises","Handle errors with try/catch","Avoid callback hell"],pitfalls:["Forgetting await keyword","Unhandled promise rejections","Race conditions"],difficulty:4,icon:"⏳",isPremium:!0}],a=[{id:"ex-001",primitiveId:"for-loop",title:"Sum of Numbers",slug:"sum-of-numbers",description:"Calculate the sum of all numbers from 1 to n using a for loop",difficulty:2,estimatedMinutes:5,instructions:`## Your Task

Create a function \`sumToN(n)\` that returns the sum of all integers from 1 to n.

### Requirements
- Use a for loop (not a mathematical formula)
- Handle edge cases (n < 1 should return 0)

### Examples
\`\`\`
sumToN(5)  → 15   // 1+2+3+4+5 = 15
sumToN(10) → 55
sumToN(0)  → 0
\`\`\``,hints:["Start with a variable to store your running total, initialized to 0","Loop from 1 to n (inclusive) using i <= n","Add each number i to your total inside the loop"],starterCode:`function sumToN(n) {
  // Your code here
  
}`,isPremium:!1},{id:"ex-002",primitiveId:"for-loop",title:"Array Sum",slug:"array-sum",description:"Calculate the sum of all elements in an array",difficulty:2,estimatedMinutes:5,instructions:`## Your Task

Create a function \`arraySum(arr)\` that returns the sum of all numbers in the array.

### Requirements
- Use a for loop to iterate through the array
- Handle empty arrays (return 0)

### Examples
\`\`\`
arraySum([1, 2, 3, 4, 5]) → 15
arraySum([10, 20, 30])    → 60
arraySum([])              → 0
\`\`\``,hints:["Initialize a sum variable to 0","Loop from i = 0 to i < arr.length","Access each element with arr[i]"],starterCode:`function arraySum(arr) {
  // Your code here
  
}`,isPremium:!1},{id:"ex-003",primitiveId:"for-loop",title:"FizzBuzz",slug:"fizzbuzz",description:"The classic FizzBuzz challenge",difficulty:3,estimatedMinutes:10,instructions:`## Your Task

Create a function \`fizzBuzz(n)\` that returns an array of strings from 1 to n where:
- Numbers divisible by 3 are replaced with "Fizz"
- Numbers divisible by 5 are replaced with "Buzz"  
- Numbers divisible by both are replaced with "FizzBuzz"
- Other numbers are converted to strings

### Examples
\`\`\`
fizzBuzz(5) → ["1", "2", "Fizz", "4", "Buzz"]
fizzBuzz(15) → ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
\`\`\``,hints:["Use the modulo operator (%) to check divisibility","Check for divisibility by both 3 AND 5 first","Convert numbers to strings with String(n) or n.toString()"],starterCode:`function fizzBuzz(n) {
  // Your code here
  
}`,isPremium:!1},{id:"ex-004",primitiveId:"variables",title:"Variable Swap",slug:"variable-swap",description:"Swap the values of two variables",difficulty:1,estimatedMinutes:3,instructions:`## Your Task

Create a function \`swap(a, b)\` that returns an array with the values swapped.

### Requirements
- Use a temporary variable to perform the swap

### Examples
\`\`\`
swap(1, 2) → [2, 1]
swap("hello", "world") → ["world", "hello"]
\`\`\``,hints:["You'll need a third variable to temporarily hold one value","Store a in temp, then assign b to a, then assign temp to b"],starterCode:`function swap(a, b) {
  // Your code here
  
}`,isPremium:!1},{id:"ex-005",primitiveId:"conditionals",title:"Grade Calculator",slug:"grade-calculator",description:"Convert a numeric score to a letter grade",difficulty:1,estimatedMinutes:5,instructions:`## Your Task

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
\`\`\``,hints:["Start with the highest grade and work down","Use >= for the comparisons","Remember to handle the 'F' case at the end"],starterCode:`function getGrade(score) {
  // Your code here
  
}`,isPremium:!1},{id:"ex-006",primitiveId:"functions",title:"Temperature Converter",slug:"temperature-converter",description:"Convert temperatures between Celsius and Fahrenheit",difficulty:2,estimatedMinutes:8,instructions:`## Your Task

Create two functions:
- \`celsiusToFahrenheit(c)\` - converts Celsius to Fahrenheit
- \`fahrenheitToCelsius(f)\` - converts Fahrenheit to Celsius

### Formulas
- F = (C × 9/5) + 32
- C = (F - 32) × 5/9

### Examples
\`\`\`
celsiusToFahrenheit(0)   → 32
celsiusToFahrenheit(100) → 212
fahrenheitToCelsius(32)  → 0
fahrenheitToCelsius(212) → 100
\`\`\``,hints:["Apply the formula directly in your return statement","Be careful with the order of operations","Test with known values: 0°C = 32°F, 100°C = 212°F"],starterCode:`function celsiusToFahrenheit(c) {
  // Your code here
}

function fahrenheitToCelsius(f) {
  // Your code here
}`,isPremium:!1},{id:"ex-007",primitiveId:"arrays",title:"Find Maximum",slug:"find-maximum",description:"Find the largest number in an array",difficulty:2,estimatedMinutes:5,instructions:`## Your Task

Create a function \`findMax(arr)\` that returns the largest number in the array.

### Requirements
- Handle empty arrays (return null or undefined)
- Don't use Math.max

### Examples
\`\`\`
findMax([1, 5, 3, 9, 2]) → 9
findMax([-5, -1, -10])   → -1
findMax([42])            → 42
\`\`\``,hints:["Start by assuming the first element is the maximum","Loop through and compare each element","Update max when you find something larger"],starterCode:`function findMax(arr) {
  // Your code here
  
}`,isPremium:!1},{id:"ex-008",primitiveId:"while-loop",title:"Countdown",slug:"countdown",description:"Create a countdown from n to 1",difficulty:2,estimatedMinutes:5,instructions:`## Your Task

Create a function \`countdown(n)\` that returns an array counting down from n to 1.

### Examples
\`\`\`
countdown(5) → [5, 4, 3, 2, 1]
countdown(3) → [3, 2, 1]
countdown(1) → [1]
\`\`\``,hints:["Use a while loop that continues while n > 0","Push n to the array, then decrement n","Make sure you're adding numbers, not just modifying n"],starterCode:`function countdown(n) {
  // Your code here
  
}`,isPremium:!1}],s=[{id:"1",name:"First Steps",description:"Complete your first exercise",category:"milestone",icon:"👣",xpReward:50,rarity:"common",unlocked:!0,unlockedAt:"2024-01-15"},{id:"2",name:"Getting Started",description:"Complete 5 exercises",category:"milestone",icon:"🚀",xpReward:100,rarity:"common",unlocked:!0,unlockedAt:"2024-01-18"},{id:"3",name:"Streak Starter",description:"7-day streak",category:"consistency",icon:"🔥",xpReward:100,rarity:"common",unlocked:!0,unlockedAt:"2024-01-22"},{id:"4",name:"Loop Legend",description:"Master all loop primitives",category:"mastery",icon:"🔄",xpReward:300,rarity:"rare",unlocked:!1},{id:"5",name:"Week Warrior",description:"14-day streak",category:"consistency",icon:"⚔️",xpReward:200,rarity:"rare",unlocked:!1},{id:"6",name:"Century Club",description:"Complete 100 exercises",category:"milestone",icon:"🏆",xpReward:500,rarity:"epic",unlocked:!1},{id:"7",name:"Polyglot",description:"Use 3 different languages",category:"skill",icon:"🌍",xpReward:150,rarity:"rare",unlocked:!1},{id:"8",name:"Perfect Score",description:"Get 100% on first attempt",category:"skill",icon:"💯",xpReward:75,rarity:"common",unlocked:!0,unlockedAt:"2024-01-20"},{id:"9",name:"Speed Demon",description:"Complete exercise in under 1 minute",category:"skill",icon:"⏱️",xpReward:100,rarity:"rare",unlocked:!1},{id:"10",name:"Year of Code",description:"365-day streak",category:"consistency",icon:"🌟",xpReward:2e3,rarity:"legendary",unlocked:!1}],n={totalExercisesCompleted:23,totalPrimitivesMastered:3,totalTimeSpentMinutes:245,totalXp:1850,currentLevel:7,currentDailyStreak:12,longestDailyStreak:23,lastActivityAt:new Date().toISOString()},o=[{primitiveId:"for-loop",primitiveName:"For Loop",language:"javascript",level:5,exercisesCompleted:8,exercisesAvailable:8,averageScore:94},{primitiveId:"variables",primitiveName:"Variables",language:"javascript",level:5,exercisesCompleted:5,exercisesAvailable:5,averageScore:98},{primitiveId:"conditionals",primitiveName:"Conditionals",language:"javascript",level:4,exercisesCompleted:6,exercisesAvailable:7,averageScore:89},{primitiveId:"while-loop",primitiveName:"While Loop",language:"javascript",level:3,exercisesCompleted:4,exercisesAvailable:6,averageScore:82},{primitiveId:"functions",primitiveName:"Functions",language:"javascript",level:3,exercisesCompleted:5,exercisesAvailable:8,averageScore:85},{primitiveId:"arrays",primitiveName:"Arrays",language:"javascript",level:2,exercisesCompleted:3,exercisesAvailable:7,averageScore:78},{primitiveId:"for-loop",primitiveName:"For Loop",language:"python",level:2,exercisesCompleted:3,exercisesAvailable:8,averageScore:88},{primitiveId:"objects",primitiveName:"Objects",language:"javascript",level:1,exercisesCompleted:1,exercisesAvailable:6,averageScore:72}],l={id:"demo-user",email:"demo@programprimitives.com",displayName:"Demo User",preferredLanguage:"javascript",subscriptionTier:"free"};function c(e){return a.filter(t=>t.primitiveId===e)}function u(e){return r.find(t=>t.id===e)}function d(e,t="javascript"){return o.find(i=>i.primitiveId===e&&i.language===t)}export{a,r as b,o as c,c as d,d as e,l as f,u as g,n as h,s as m};
