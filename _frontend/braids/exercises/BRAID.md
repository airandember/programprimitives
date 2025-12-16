# Exercises Braid (Frontend)

## Purpose
Provides the interactive coding environment where users practice primitives. This is the core learning experience - the code editor, execution, and feedback loop.

## Scope
- Code editor component (Monaco/CodeMirror)
- Exercise instructions display
- Run/Submit functionality
- Output console
- Test results display
- Hint system UI
- Timer and progress indicators
- Language selector for exercise

## Dependencies
- **External**: 
  - Monaco Editor or CodeMirror
  - Syntax themes
- **Internal (Backend)**: Exercises Braid API
- **Internal (Frontend)**: 
  - Primitives Braid (context)
  - Progress Braid (completion state)

## Current Status
- [ ] Presentation Layer
- [ ] Application Layer
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **code-editor** - Monaco/CodeMirror integration
2. **exercise-runner** - Execute and display results
3. **feedback-display** - Show hints, errors, success
4. **exercise-navigation** - Next/previous exercises
5. **timer** - Time tracking UI

## Pages & Routes
```
/practice                         - Exercise hub
/practice/:primitive              - Exercises for primitive
/practice/:primitive/:exercise    - Specific exercise
/practice/:primitive/:exercise/:lang - Language-specific
```

## Components
```
src/lib/components/exercises/
├── ExerciseWorkspace.svelte   - Main exercise layout
├── CodeEditor.svelte          - Monaco/CodeMirror wrapper
├── Instructions.svelte        - Exercise instructions panel
├── OutputConsole.svelte       - Execution output
├── TestResults.svelte         - Pass/fail test cases
├── HintButton.svelte          - Progressive hints
├── RunButton.svelte           - Execute code
├── SubmitButton.svelte        - Submit solution
├── LanguageSelect.svelte      - Exercise language picker
├── ExerciseTimer.svelte       - Time tracker
├── ExerciseNav.svelte         - Prev/Next navigation
└── SuccessModal.svelte        - Completion celebration
```

## State Management
```typescript
// src/lib/stores/exercises.ts
export const currentExercise = writable<Exercise | null>(null);
export const userCode = writable<string>('');
export const output = writable<string>('');
export const testResults = writable<TestResult[]>([]);
export const isRunning = writable<boolean>(false);
export const hintsUsed = writable<number>(0);
export const startTime = writable<Date | null>(null);

// Actions
export async function runCode(): Promise<void>;
export async function submitSolution(): Promise<void>;
export async function getHint(): Promise<string>;
export function resetExercise(): void;
```

## Editor Configuration
```typescript
// Monaco Editor settings
{
  theme: 'vs-dark', // or custom theme
  fontSize: 14,
  minimap: { enabled: false },
  lineNumbers: 'on',
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
}
```

## UI/UX Guidelines
- Split-pane layout (instructions | editor | output)
- Resizable panels
- Keyboard shortcuts (Ctrl+Enter to run)
- Syntax errors shown inline
- Test results with clear pass/fail icons
- Confetti/celebration on completion
- Mobile: stacked layout with tabs
- Dark mode default for editor
- Auto-save code to localStorage

