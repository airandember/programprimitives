import { c as create_ssr_component, v as validate_component, a as subscribe, b as escape, e as each, d as add_attribute } from "../../../../../chunks/ssr.js";
import { p as page } from "../../../../../chunks/stores.js";
import { d as derived, w as writable } from "../../../../../chunks/index.js";
import { g as getPrimitiveById } from "../../../../../chunks/mock-data.js";
import { s as selectedLanguage, a as supportedLanguages } from "../../../../../chunks/primitives.js";
import { A as Arrow_left, L as Lightbulb, X } from "../../../../../chunks/x.js";
import { C as Clock } from "../../../../../chunks/clock.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { P as Play } from "../../../../../chunks/play.js";
import { C as Check } from "../../../../../chunks/check.js";
import { T as Trophy } from "../../../../../chunks/trophy.js";
import { C as Chevron_right } from "../../../../../chunks/chevron-right.js";
const Rotate_ccw = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      }
    ],
    ["path", { "d": "M3 3v5h5" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "rotate-ccw" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Send = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m22 2-7 20-4-9-9-4Z" }], ["path", { "d": "M22 2 11 13" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "send" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const currentExercise = writable(null);
const userCode = writable("");
const output = writable("");
const testResults = writable([]);
const isRunning = writable(false);
const isSubmitting = writable(false);
const hintsUsed = writable(0);
const currentHint = writable(null);
const showSuccess = writable(false);
derived(
  testResults,
  ($results) => $results.length > 0 && $results.every((r) => r.passed)
);
const availableHints = derived(
  [currentExercise, hintsUsed],
  ([$exercise, $used]) => {
    if (!$exercise) return 0;
    return Math.max(0, $exercise.hints.length - $used);
  }
);
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let primitiveId;
  let primitive;
  let $userCode, $$unsubscribe_userCode;
  let $page, $$unsubscribe_page;
  let $currentExercise, $$unsubscribe_currentExercise;
  let $selectedLanguage, $$unsubscribe_selectedLanguage;
  let $availableHints, $$unsubscribe_availableHints;
  let $currentHint, $$unsubscribe_currentHint;
  let $hintsUsed, $$unsubscribe_hintsUsed;
  let $isRunning, $$unsubscribe_isRunning;
  let $isSubmitting, $$unsubscribe_isSubmitting;
  let $output, $$unsubscribe_output;
  let $testResults, $$unsubscribe_testResults;
  let $showSuccess, $$unsubscribe_showSuccess;
  $$unsubscribe_userCode = subscribe(userCode, (value) => $userCode = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_currentExercise = subscribe(currentExercise, (value) => $currentExercise = value);
  $$unsubscribe_selectedLanguage = subscribe(selectedLanguage, (value) => $selectedLanguage = value);
  $$unsubscribe_availableHints = subscribe(availableHints, (value) => $availableHints = value);
  $$unsubscribe_currentHint = subscribe(currentHint, (value) => $currentHint = value);
  $$unsubscribe_hintsUsed = subscribe(hintsUsed, (value) => $hintsUsed = value);
  $$unsubscribe_isRunning = subscribe(isRunning, (value) => $isRunning = value);
  $$unsubscribe_isSubmitting = subscribe(isSubmitting, (value) => $isSubmitting = value);
  $$unsubscribe_output = subscribe(output, (value) => $output = value);
  $$unsubscribe_testResults = subscribe(testResults, (value) => $testResults = value);
  $$unsubscribe_showSuccess = subscribe(showSuccess, (value) => $showSuccess = value);
  let editorElement;
  $page.params.exercise;
  primitiveId = $page.params.primitive;
  primitive = getPrimitiveById(primitiveId);
  $$unsubscribe_userCode();
  $$unsubscribe_page();
  $$unsubscribe_currentExercise();
  $$unsubscribe_selectedLanguage();
  $$unsubscribe_availableHints();
  $$unsubscribe_currentHint();
  $$unsubscribe_hintsUsed();
  $$unsubscribe_isRunning();
  $$unsubscribe_isSubmitting();
  $$unsubscribe_output();
  $$unsubscribe_testResults();
  $$unsubscribe_showSuccess();
  return `${$currentExercise ? `<div class="min-h-screen flex flex-col"> <header class="bg-surface-900 border-b border-surface-800 px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><a href="/practice" class="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors">${validate_component(Arrow_left, "ArrowLeft").$$render($$result, { size: 20 }, {}, {})}</a> <div><div class="text-sm text-surface-500">${escape(primitive?.name || primitiveId)}</div> <h1 class="font-semibold">${escape($currentExercise.title)}</h1></div></div> <div class="flex items-center gap-3"> <select class="input py-1.5 text-sm w-36">${each(supportedLanguages.slice(0, 3), (lang) => {
    return `<option${add_attribute("value", lang.id, 0)}>${escape(lang.icon)} ${escape(lang.name)}</option>`;
  })}</select>  <div class="flex items-center gap-2 text-surface-400 text-sm">${validate_component(Clock, "Clock").$$render($$result, { size: 16 }, {}, {})} <span>${escape($currentExercise.estimatedMinutes)} min</span></div></div></div></header>  <div class="flex-1 flex overflow-hidden"> <div class="w-96 border-r border-surface-800 overflow-y-auto bg-surface-950/50"><div class="p-6"><h2 class="text-lg font-semibold mb-4" data-svelte-h="svelte-pfme3u">Instructions</h2>  <div class="prose prose-invert prose-sm max-w-none"><!-- HTML_TAG_START -->${$currentExercise.instructions.replace(/^## (.+)$/gm, '<h3 class="text-base font-semibold mt-6 mb-2">$1</h3>').replace(/^### (.+)$/gm, '<h4 class="text-sm font-medium mt-4 mb-2">$1</h4>').replace(/^- (.+)$/gm, '<li class="text-surface-300">$1</li>').replace(/```([^`]+)```/g, '<pre class="bg-surface-900 rounded p-3 text-sm overflow-x-auto my-3"><code>$1</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-surface-800 px-1.5 py-0.5 rounded text-primary-400">$1</code>').replace(/\n\n/g, '</p><p class="text-surface-300 mb-3">').replace(/^(?!<)(.+)$/gm, '<p class="text-surface-300 mb-3">$1</p>')}<!-- HTML_TAG_END --></div>  <div class="mt-8 pt-6 border-t border-surface-800"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold flex items-center gap-2">${validate_component(Lightbulb, "Lightbulb").$$render($$result, { size: 18, class: "text-yellow-500" }, {}, {})}
								Hints</h3> <span class="text-sm text-surface-500">${escape($availableHints)} remaining</span></div> ${$currentHint ? `<div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4"><p class="text-sm text-yellow-200">${escape($currentHint)}</p></div>` : ``} <button ${$availableHints === 0 ? "disabled" : ""} class="btn btn-secondary w-full justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed">${validate_component(Lightbulb, "Lightbulb").$$render($$result, { size: 16 }, {}, {})} ${escape($availableHints > 0 ? "Get a Hint" : "No more hints")}</button> ${$hintsUsed > 0 ? `<p class="text-xs text-surface-500 mt-2 text-center" data-svelte-h="svelte-18xxvox">Using hints reduces your score (-10% per hint)</p>` : ``}</div></div></div>  <div class="flex-1 flex flex-col overflow-hidden"> <div class="bg-surface-900 border-b border-surface-800 px-4 py-2 flex items-center justify-between"><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-red-500"></div> <div class="w-3 h-3 rounded-full bg-yellow-500"></div> <div class="w-3 h-3 rounded-full bg-green-500"></div> <span class="ml-2 text-surface-500 text-sm">solution.${escape($selectedLanguage === "python" ? "py" : "js")}</span></div> <div class="flex items-center gap-2"><button class="btn btn-ghost text-sm py-1" title="Reset code">${validate_component(Rotate_ccw, "RotateCcw").$$render($$result, { size: 16 }, {}, {})}
							Reset</button></div></div>  <div class="flex-1 bg-surface-950 relative overflow-hidden"><textarea spellcheck="false" class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent text-surface-200 resize-none focus:outline-none leading-relaxed" style="tab-size: 2;"${add_attribute("this", editorElement, 0)}>${escape($userCode, false)}</textarea></div>  <div class="bg-surface-900 border-t border-surface-800 px-4 py-3 flex items-center justify-between"><div class="text-sm text-surface-500" data-svelte-h="svelte-jlzpi1"><kbd class="px-1.5 py-0.5 rounded bg-surface-800 text-xs">Ctrl</kbd> +
						<kbd class="px-1.5 py-0.5 rounded bg-surface-800 text-xs">Enter</kbd> to run</div> <div class="flex items-center gap-3"><button ${$isRunning ? "disabled" : ""} class="btn btn-secondary">${$isRunning ? `<div class="w-4 h-4 border-2 border-surface-400 border-t-transparent rounded-full animate-spin"></div>` : `${validate_component(Play, "Play").$$render($$result, { size: 18 }, {}, {})}`}
							Run</button> <button ${$isSubmitting ? "disabled" : ""} class="btn btn-primary">${$isSubmitting ? `<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>` : `${validate_component(Send, "Send").$$render($$result, { size: 18 }, {}, {})}`}
							Submit</button></div></div></div>  <div class="w-96 border-l border-surface-800 flex flex-col bg-surface-950/50"> <div class="flex-1 flex flex-col overflow-hidden"><div class="px-4 py-3 border-b border-surface-800" data-svelte-h="svelte-lmu4n8"><h3 class="font-semibold">Output</h3></div> <div class="flex-1 overflow-y-auto p-4"><pre class="font-mono text-sm text-surface-300 whitespace-pre-wrap">${escape($output || "Run your code to see output...")}</pre></div></div>  ${$testResults.length > 0 ? `<div class="border-t border-surface-800"><div class="px-4 py-3 border-b border-surface-800" data-svelte-h="svelte-1sb2n2b"><h3 class="font-semibold">Test Results</h3></div> <div class="p-4 space-y-2 max-h-64 overflow-y-auto">${each($testResults, (result) => {
    return `<div class="${"flex items-center gap-3 p-3 rounded-lg " + escape(
      result.passed ? "bg-primary-500/10 border border-primary-500/30" : "bg-red-500/10 border border-red-500/30",
      true
    )}">${result.passed ? `${validate_component(Check, "Check").$$render(
      $$result,
      {
        size: 18,
        class: "text-primary-500 shrink-0"
      },
      {},
      {}
    )}` : `${validate_component(X, "X").$$render($$result, { size: 18, class: "text-red-500 shrink-0" }, {}, {})}`} <div class="flex-1 min-w-0"><div class="font-medium text-sm">${escape(result.name)}</div> ${result.message ? `<div class="text-xs text-surface-500 truncate">${escape(result.message)}</div>` : ``}</div> </div>`;
  })}</div></div>` : ``}</div></div>  ${$showSuccess ? `<div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"><div class="card p-8 max-w-md mx-4 text-center animate-slide-up"><div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6">${validate_component(Trophy, "Trophy").$$render($$result, { size: 40, class: "text-white" }, {}, {})}</div> <h2 class="text-2xl font-bold mb-2" data-svelte-h="svelte-lz7pyp">Exercise Complete! 🎉</h2> <p class="text-surface-400 mb-6" data-svelte-h="svelte-10y3f4h">Great job! You&#39;ve mastered this challenge.</p> <div class="flex items-center justify-center gap-8 mb-8" data-svelte-h="svelte-14hewvg"><div><div class="text-3xl font-bold text-primary-400">+25</div> <div class="text-sm text-surface-500">XP Earned</div></div> <div><div class="text-3xl font-bold text-accent-400">95%</div> <div class="text-sm text-surface-500">Score</div></div></div> <div class="flex gap-3"><button class="btn btn-secondary flex-1 justify-center" data-svelte-h="svelte-wwps3b">Review Solution</button> <a href="/practice" class="btn btn-primary flex-1 justify-center">Next Exercise
							${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 18 }, {}, {})}</a></div></div></div>` : ``}</div>` : `<div class="min-h-screen flex items-center justify-center" data-svelte-h="svelte-zvxlfb"><div class="text-center"><div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div> <p class="text-surface-400">Loading exercise...</p></div></div>`}`;
});
export {
  Page as default
};
