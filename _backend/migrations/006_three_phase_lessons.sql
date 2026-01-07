-- Three-Phase Lesson Structure Migration
-- Adds phases (blueprint/crafting/mastery) and documentation citations
-- Based on CURRICULUM_HIERARCHY.md - Tool-First, Language-Second Philosophy

-- ============================================
-- ADD PHASE COLUMN TO LESSONS
-- ============================================

-- Phase indicates which part of the learning journey
-- blueprint = Understanding the WHY (language-agnostic)
-- crafting = Building proficiency (hands-on practice)
-- mastery = Industry patterns, cross-language (solidifying knowledge)
ALTER TABLE lessons ADD COLUMN phase TEXT DEFAULT 'blueprint' CHECK(phase IN ('blueprint', 'crafting', 'mastery'));

-- Metaphor progress text (what visual element this lesson completes)
ALTER TABLE lessons ADD COLUMN metaphor_progress TEXT;

-- Phase order within the phase (B1, B2, C1, C2, M1, M2, etc.)
ALTER TABLE lessons ADD COLUMN phase_order INTEGER DEFAULT 1;

-- ============================================
-- TOOL METAPHORS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tool_metaphors (
    id TEXT PRIMARY KEY,
    tool_id TEXT NOT NULL UNIQUE,
    metaphor_name TEXT NOT NULL,           -- 'Counting Wheel', 'Container', 'Gate/Switch'
    metaphor_icon TEXT NOT NULL,           -- '🔄', '📦', '🚪'
    
    -- Three progression stages
    stage_1_name TEXT NOT NULL,            -- 'Tally stick'
    stage_1_description TEXT,
    stage_2_name TEXT NOT NULL,            -- 'Abacus'
    stage_2_description TEXT,
    stage_3_name TEXT NOT NULL,            -- 'Mechanical counter'
    stage_3_description TEXT,
    
    -- Visual descriptions for UI
    blueprint_visual TEXT,                 -- "Drawing the counting wheel design"
    crafting_visual TEXT,                  -- "Building your counting wheel"
    mastery_visual TEXT,                   -- "Hardening the tool"
    
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (tool_id) REFERENCES primitives(id)
);

CREATE INDEX IF NOT EXISTS idx_tool_metaphors_tool ON tool_metaphors(tool_id);

-- ============================================
-- LANGUAGE DOCUMENTATION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS language_docs (
    id TEXT PRIMARY KEY,
    language_id TEXT NOT NULL,
    tool_id TEXT NOT NULL,
    
    -- Documentation info
    doc_url TEXT NOT NULL,                 -- 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for'
    doc_title TEXT NOT NULL,               -- 'for - JavaScript | MDN'
    doc_source TEXT NOT NULL,              -- 'MDN', 'Python Docs', 'Go Docs', 'Rust Book'
    
    -- Syntax example from official docs
    official_syntax TEXT,                  -- The canonical syntax from docs
    notes TEXT,                            -- Any special notes about this language's implementation
    
    -- For ordering multiple doc references
    display_order INTEGER DEFAULT 1,
    
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (language_id) REFERENCES languages(id),
    FOREIGN KEY (tool_id) REFERENCES primitives(id),
    UNIQUE(language_id, tool_id, doc_url)
);

CREATE INDEX IF NOT EXISTS idx_lang_docs_lang ON language_docs(language_id);
CREATE INDEX IF NOT EXISTS idx_lang_docs_tool ON language_docs(tool_id);

-- ============================================
-- SEED TOOL METAPHORS
-- ============================================

INSERT OR REPLACE INTO tool_metaphors (id, tool_id, metaphor_name, metaphor_icon, stage_1_name, stage_1_description, stage_2_name, stage_2_description, stage_3_name, stage_3_description, blueprint_visual, crafting_visual, mastery_visual, created_at, updated_at)
VALUES
-- Stone Tier
('meta-variables', 'variables', 'Container', '📦', 
 'Wooden Box', 'A simple unlabeled box to hold one thing',
 'Labeled Jar', 'A clear container with a name tag',
 'Smart Storage Bin', 'Self-organizing with type indicators',
 'Sketching the container blueprints', 'Crafting your storage container', 'Reinforcing the container',
 datetime('now'), datetime('now')),

('meta-operators', 'operators', 'Measuring Tools', '📏',
 'Hand Span', 'Rough estimation using body',
 'Ruler', 'Precise measurement with markings',
 'Laser Measure', 'Instant, accurate calculations',
 'Understanding measurement principles', 'Learning to measure precisely', 'Mastering precision tools',
 datetime('now'), datetime('now')),

-- Wood Tier  
('meta-conditionals', 'conditionals', 'Gate/Switch', '🚪',
 'Simple Gate', 'Open or closed, nothing else',
 'Locked Door', 'Requires a key (condition) to open',
 'Smart Lock', 'Multiple conditions, automatic responses',
 'Designing the gate mechanism', 'Building your gate system', 'Installing smart controls',
 datetime('now'), datetime('now')),

('meta-for-loop', 'for-loop', 'Counting Wheel', '🔄',
 'Tally Stick', 'Manual marks for each count',
 'Abacus', 'Organized counting with positions',
 'Mechanical Counter', 'Automatic, precise counting',
 'Drawing the counting wheel design', 'Building your counting wheel', 'Hardening the tool',
 datetime('now'), datetime('now')),

('meta-while-loop', 'while-loop', 'Mill/Crank', '⚙️',
 'Hand Crank', 'Manual repetition until done',
 'Water Wheel', 'Continuous motion while water flows',
 'Electric Motor', 'Runs until condition changes',
 'Understanding continuous motion', 'Building your mill mechanism', 'Optimizing the motor',
 datetime('now'), datetime('now')),

-- Bronze Tier
('meta-arrays', 'arrays', 'Tool Rack', '🗄️',
 'Simple Hook', 'One place to hang one thing',
 'Pegboard', 'Organized slots in a row',
 'Automated Carousel', 'Indexed retrieval system',
 'Planning the rack layout', 'Building your tool rack', 'Installing the retrieval system',
 datetime('now'), datetime('now')),

('meta-objects', 'objects', 'Blueprint Case', '📋',
 'Sketch Folder', 'Loose papers with labels',
 'Drawing Cabinet', 'Organized compartments by name',
 'CAD System', 'Structured, relational data storage',
 'Understanding structured storage', 'Organizing your blueprints', 'Implementing the system',
 datetime('now'), datetime('now')),

-- Iron Tier
('meta-functions', 'functions', 'Workbench', '🛠️',
 'Simple Table', 'A flat surface to work on',
 'Full Workbench', 'Organized tools, vices, drawers',
 'Modular Station', 'Configurable, specialized setups',
 'Designing the workbench', 'Building your workbench', 'Adding modular capabilities',
 datetime('now'), datetime('now'));

-- ============================================
-- SEED OFFICIAL DOCUMENTATION REFERENCES
-- ============================================

-- JavaScript Documentation (MDN)
INSERT OR REPLACE INTO language_docs (id, language_id, tool_id, doc_url, doc_title, doc_source, official_syntax, notes, display_order, created_at, updated_at)
VALUES
('doc-js-variables', 'javascript', 'variables',
 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations',
 'Declarations - JavaScript | MDN', 'MDN Web Docs',
 'let variableName = value;
const CONSTANT_NAME = value;
var oldStyleVariable = value;',
 'Modern JS prefers const by default, let when reassignment needed. Avoid var.',
 1, datetime('now'), datetime('now')),

('doc-js-for', 'javascript', 'for-loop',
 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for',
 'for - JavaScript | MDN', 'MDN Web Docs',
 'for (initialization; condition; afterthought) {
    statement
}',
 'Also see for...of for iterables and for...in for object properties.',
 1, datetime('now'), datetime('now')),

('doc-js-while', 'javascript', 'while-loop',
 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while',
 'while - JavaScript | MDN', 'MDN Web Docs',
 'while (condition) {
    statement
}',
 'Use when iteration count is unknown. Consider do...while for at-least-once execution.',
 1, datetime('now'), datetime('now')),

('doc-js-if', 'javascript', 'conditionals',
 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else',
 'if...else - JavaScript | MDN', 'MDN Web Docs',
 'if (condition) {
    statement1
} else {
    statement2
}',
 'Be aware of truthy/falsy values in JavaScript.',
 1, datetime('now'), datetime('now')),

('doc-js-arrays', 'javascript', 'arrays',
 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
 'Array - JavaScript | MDN', 'MDN Web Docs',
 'const arr = [element0, element1, /* …, */ elementN];
const arr = new Array(element0, element1, /* …, */ elementN);',
 'Arrays in JS are objects and can hold mixed types (not recommended).',
 1, datetime('now'), datetime('now')),

('doc-js-objects', 'javascript', 'objects',
 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
 'Object - JavaScript | MDN', 'MDN Web Docs',
 'const obj = {
    property1: value1,
    property2: value2
};',
 'Objects are key-value stores. Keys are strings or Symbols.',
 1, datetime('now'), datetime('now')),

('doc-js-functions', 'javascript', 'functions',
 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
 'Functions - JavaScript | MDN', 'MDN Web Docs',
 'function name(param0, param1, /* …, */ paramN) {
    statements
}

// Arrow function
const name = (param) => expression;',
 'Arrow functions have lexical this binding. Function declarations are hoisted.',
 1, datetime('now'), datetime('now')),

('doc-js-operators', 'javascript', 'operators',
 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators',
 'Expressions and operators - JavaScript | MDN', 'MDN Web Docs',
 '// Arithmetic: + - * / % **
// Comparison: == === != !== > < >= <=
// Logical: && || !
// Assignment: = += -= *= /=',
 'Use === for strict equality (no type coercion).',
 1, datetime('now'), datetime('now')),

-- Python Documentation
('doc-py-variables', 'python', 'variables',
 'https://docs.python.org/3/tutorial/introduction.html#numbers',
 'An Informal Introduction to Python | Python Docs', 'Python Official Docs',
 'variable_name = value
CONSTANT_NAME = value  # Convention only',
 'Python has no const keyword - uppercase is convention for constants.',
 1, datetime('now'), datetime('now')),

('doc-py-for', 'python', 'for-loop',
 'https://docs.python.org/3/tutorial/controlflow.html#for-statements',
 'for Statements | Python Docs', 'Python Official Docs',
 'for variable in iterable:
    statement

for i in range(n):
    statement',
 'Python for loops iterate over sequences. Use range() for counting.',
 1, datetime('now'), datetime('now')),

('doc-py-while', 'python', 'while-loop',
 'https://docs.python.org/3/reference/compound_stmts.html#while',
 'The while statement | Python Docs', 'Python Official Docs',
 'while condition:
    statement',
 'Python has while-else for loops that complete without break.',
 1, datetime('now'), datetime('now')),

('doc-py-if', 'python', 'conditionals',
 'https://docs.python.org/3/tutorial/controlflow.html#if-statements',
 'if Statements | Python Docs', 'Python Official Docs',
 'if condition:
    statement
elif condition:
    statement
else:
    statement',
 'Python uses elif instead of else if. Indentation is significant.',
 1, datetime('now'), datetime('now')),

('doc-py-arrays', 'python', 'arrays',
 'https://docs.python.org/3/tutorial/introduction.html#lists',
 'Lists | Python Docs', 'Python Official Docs',
 'my_list = [element0, element1, element2]
my_list = list(iterable)',
 'Python uses lists (dynamic arrays). For fixed-size, see array module.',
 1, datetime('now'), datetime('now')),

('doc-py-objects', 'python', 'objects',
 'https://docs.python.org/3/tutorial/datastructures.html#dictionaries',
 'Dictionaries | Python Docs', 'Python Official Docs',
 'my_dict = {"key1": value1, "key2": value2}
my_dict = dict(key1=value1, key2=value2)',
 'Python uses dictionaries for key-value storage. Keys must be hashable.',
 1, datetime('now'), datetime('now')),

('doc-py-functions', 'python', 'functions',
 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
 'Defining Functions | Python Docs', 'Python Official Docs',
 'def function_name(param1, param2):
    """Docstring"""
    statement
    return value',
 'Python functions can have docstrings, default args, *args, **kwargs.',
 1, datetime('now'), datetime('now')),

('doc-py-operators', 'python', 'operators',
 'https://docs.python.org/3/library/operator.html',
 'operator — Standard operators | Python Docs', 'Python Official Docs',
 '# Arithmetic: + - * / // % **
# Comparison: == != > < >= <=
# Logical: and or not
# Assignment: = += -= *= /=',
 'Python uses // for integer division, ** for power. and/or instead of &&/||.',
 1, datetime('now'), datetime('now')),

-- Go Documentation
('doc-go-variables', 'go', 'variables',
 'https://go.dev/tour/basics/8',
 'Variables | A Tour of Go', 'Go Official Docs',
 'var name type = value
var name = value    // type inferred
name := value       // short declaration',
 'Go uses := for short variable declaration. var for package-level.',
 1, datetime('now'), datetime('now')),

('doc-go-for', 'go', 'for-loop',
 'https://go.dev/tour/flowcontrol/1',
 'For | A Tour of Go', 'Go Official Docs',
 'for i := 0; i < n; i++ {
    statement
}

for condition {  // like while
    statement
}

for {  // infinite loop
    statement
}',
 'Go only has for loops - no while or do-while. for replaces all.',
 1, datetime('now'), datetime('now')),

('doc-go-if', 'go', 'conditionals',
 'https://go.dev/tour/flowcontrol/5',
 'If | A Tour of Go', 'Go Official Docs',
 'if condition {
    statement
} else if condition {
    statement
} else {
    statement
}',
 'Go if can have a short statement before the condition.',
 1, datetime('now'), datetime('now')),

('doc-go-arrays', 'go', 'arrays',
 'https://go.dev/tour/moretypes/6',
 'Arrays | A Tour of Go', 'Go Official Docs',
 'var a [10]int           // array of 10 ints
primes := [6]int{2, 3, 5, 7, 11, 13}

// Slices (more common)
s := []int{1, 2, 3}',
 'Go arrays have fixed size. Use slices for dynamic arrays.',
 1, datetime('now'), datetime('now')),

('doc-go-objects', 'go', 'objects',
 'https://go.dev/tour/moretypes/19',
 'Maps | A Tour of Go', 'Go Official Docs',
 'var m map[string]int
m = make(map[string]int)
m["key"] = value

// Struct for object-like
type Person struct {
    Name string
    Age  int
}',
 'Go uses maps for key-value and structs for structured data.',
 1, datetime('now'), datetime('now')),

('doc-go-functions', 'go', 'functions',
 'https://go.dev/tour/basics/4',
 'Functions | A Tour of Go', 'Go Official Docs',
 'func name(param1 type1, param2 type2) returnType {
    statement
    return value
}

// Multiple returns
func swap(x, y string) (string, string) {
    return y, x
}',
 'Go functions can return multiple values. Named returns allowed.',
 1, datetime('now'), datetime('now'));

-- ============================================
-- UPDATE EXISTING LESSONS WITH PHASES
-- ============================================

-- Variables lessons
UPDATE lessons SET phase = 'blueprint', phase_order = 1, metaphor_progress = 'Sketching the box outline' WHERE tool_id = 'variables' AND slug = 'what-is-variable';
UPDATE lessons SET phase = 'crafting', phase_order = 1, metaphor_progress = 'Cutting the wood panels' WHERE tool_id = 'variables' AND slug = 'declaration';
UPDATE lessons SET phase = 'crafting', phase_order = 2, metaphor_progress = 'Adding the hinged lid' WHERE tool_id = 'variables' AND slug = 'assignment';
UPDATE lessons SET phase = 'mastery', phase_order = 1, metaphor_progress = 'Labeling the container' WHERE tool_id = 'variables' AND slug = 'naming-conventions';
UPDATE lessons SET phase = 'mastery', phase_order = 2, metaphor_progress = 'Adding the lock mechanism' WHERE tool_id = 'variables' AND slug = 'const-vs-let';

-- For-loop lessons
UPDATE lessons SET phase = 'blueprint', phase_order = 1, metaphor_progress = 'Understanding the wheel concept' WHERE tool_id = 'for-loop' AND slug = 'why-loops';
UPDATE lessons SET phase = 'blueprint', phase_order = 2, metaphor_progress = 'Drawing the three-part mechanism' WHERE tool_id = 'for-loop' AND slug = 'for-syntax';
UPDATE lessons SET phase = 'crafting', phase_order = 1, metaphor_progress = 'Carving the first spoke' WHERE tool_id = 'for-loop' AND slug = 'counting-up';
UPDATE lessons SET phase = 'crafting', phase_order = 2, metaphor_progress = 'Adding boundary markers' WHERE tool_id = 'for-loop' AND slug = 'off-by-one';
UPDATE lessons SET phase = 'crafting', phase_order = 3, metaphor_progress = 'Connecting to the data belt' WHERE tool_id = 'for-loop' AND slug = 'array-iteration';
UPDATE lessons SET phase = 'crafting', phase_order = 4, metaphor_progress = 'Building the gear train' WHERE tool_id = 'for-loop' AND slug = 'nested-loops';
UPDATE lessons SET phase = 'mastery', phase_order = 1, metaphor_progress = 'Hardening with industry patterns' WHERE tool_id = 'for-loop' AND slug = 'loop-patterns';

-- Conditionals lessons
UPDATE lessons SET phase = 'blueprint', phase_order = 1, metaphor_progress = 'Understanding gates and switches' WHERE tool_id = 'conditionals' AND slug = 'what-is-conditional';
UPDATE lessons SET phase = 'crafting', phase_order = 1, metaphor_progress = 'Building the basic gate' WHERE tool_id = 'conditionals' AND slug = 'if-statement';
UPDATE lessons SET phase = 'crafting', phase_order = 2, metaphor_progress = 'Adding the alternate path' WHERE tool_id = 'conditionals' AND slug = 'if-else';
UPDATE lessons SET phase = 'crafting', phase_order = 3, metaphor_progress = 'Installing multiple switches' WHERE tool_id = 'conditionals' AND slug = 'else-if';
UPDATE lessons SET phase = 'mastery', phase_order = 1, metaphor_progress = 'Installing early-exit sensors' WHERE tool_id = 'conditionals' AND slug = 'guard-clauses';

-- Arrays lessons
UPDATE lessons SET phase = 'blueprint', phase_order = 1, metaphor_progress = 'Designing the rack layout' WHERE tool_id = 'arrays' AND slug = 'what-is-array';
UPDATE lessons SET phase = 'crafting', phase_order = 1, metaphor_progress = 'Building the frame' WHERE tool_id = 'arrays' AND slug = 'creating-arrays';
UPDATE lessons SET phase = 'crafting', phase_order = 2, metaphor_progress = 'Adding slot markers' WHERE tool_id = 'arrays' AND slug = 'accessing-elements';
UPDATE lessons SET phase = 'mastery', phase_order = 1, metaphor_progress = 'Installing safety stops' WHERE tool_id = 'arrays' AND slug = 'index-bounds';

-- Functions lessons
UPDATE lessons SET phase = 'blueprint', phase_order = 1, metaphor_progress = 'Understanding the workbench purpose' WHERE tool_id = 'functions' AND slug = 'why-functions';
UPDATE lessons SET phase = 'crafting', phase_order = 1, metaphor_progress = 'Building the table surface' WHERE tool_id = 'functions' AND slug = 'function-declaration';
UPDATE lessons SET phase = 'crafting', phase_order = 2, metaphor_progress = 'Adding input drawers' WHERE tool_id = 'functions' AND slug = 'parameters-arguments';
UPDATE lessons SET phase = 'crafting', phase_order = 3, metaphor_progress = 'Installing the output chute' WHERE tool_id = 'functions' AND slug = 'return-values';
UPDATE lessons SET phase = 'mastery', phase_order = 1, metaphor_progress = 'Organizing for single tasks' WHERE tool_id = 'functions' AND slug = 'single-responsibility';
