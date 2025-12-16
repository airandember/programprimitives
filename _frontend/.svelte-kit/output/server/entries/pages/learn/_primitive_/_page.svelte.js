import { c as create_ssr_component, v as validate_component, a as subscribe, b as escape, e as each } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import { s as selectedLanguage, a as supportedLanguages } from "../../../../chunks/primitives.js";
import { g as getPrimitiveById, d as getExercisesForPrimitive, e as getMasteryForPrimitive } from "../../../../chunks/mock-data.js";
import { A as Arrow_left, L as Lightbulb, X } from "../../../../chunks/x.js";
import { B as Book_open } from "../../../../chunks/book-open.js";
import { P as Play } from "../../../../chunks/play.js";
import { C as Check } from "../../../../chunks/check.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
const Alert_triangle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "alert-triangle" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
function getMasteryName(level) {
  const names = ["Unexplored", "Introduced", "Practicing", "Familiar", "Proficient", "Mastered"];
  return names[level] || "Unknown";
}
function getMasteryColorClass(level) {
  const classes = [
    "text-surface-500",
    "text-surface-400",
    "text-yellow-500",
    "text-orange-500",
    "text-primary-500",
    "text-accent-400"
  ];
  return classes[level] || classes[0];
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let primitiveId;
  let primitive;
  let exercises;
  let mastery;
  let currentSyntax;
  let $selectedLanguage, $$unsubscribe_selectedLanguage;
  let $page, $$unsubscribe_page;
  $$unsubscribe_selectedLanguage = subscribe(selectedLanguage, (value) => $selectedLanguage = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const syntaxExamples = {
    "for-loop": {
      javascript: {
        syntax: "for (let i = 0; i < count; i++) {\n  // code\n}",
        example: "for (let i = 0; i < 5; i++) {\n  console.log(`Iteration ${i}`);\n}\n// Output: Iteration 0, 1, 2, 3, 4"
      },
      python: {
        syntax: "for i in range(count):\n    # code",
        example: 'for i in range(5):\n    print(f"Iteration {i}")\n# Output: Iteration 0, 1, 2, 3, 4'
      },
      go: {
        syntax: "for i := 0; i < count; i++ {\n    // code\n}",
        example: 'for i := 0; i < 5; i++ {\n    fmt.Printf("Iteration %d\\n", i)\n}\n// Output: Iteration 0, 1, 2, 3, 4'
      }
    },
    variables: {
      javascript: {
        syntax: "let name = value;\nconst name = value;",
        example: 'let count = 0;        // Can be reassigned\nconst MAX = 100;      // Cannot be reassigned\nlet name = "Alice";   // String'
      },
      python: {
        syntax: "name = value",
        example: 'count = 0           # Integer\nMAX = 100           # Convention: UPPERCASE\nname = "Alice"      # String'
      }
    }
  };
  primitiveId = $page.params.primitive;
  primitive = getPrimitiveById(primitiveId);
  exercises = getExercisesForPrimitive(primitiveId);
  mastery = getMasteryForPrimitive(primitiveId, $selectedLanguage);
  currentSyntax = syntaxExamples[primitiveId]?.[$selectedLanguage] || {
    syntax: "// Syntax example coming soon",
    example: "// Example coming soon"
  };
  $$unsubscribe_selectedLanguage();
  $$unsubscribe_page();
  return `${primitive ? `<div class="min-h-screen"> <div class="bg-gradient-to-b from-primary-500/10 via-surface-900/50 to-transparent py-12"><div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"> <a href="/learn" class="inline-flex items-center gap-2 text-surface-400 hover:text-surface-200 mb-6 transition-colors">${validate_component(Arrow_left, "ArrowLeft").$$render($$result, { size: 18 }, {}, {})}
					Back to Primitives</a> <div class="flex flex-col md:flex-row md:items-start gap-6"> <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center text-4xl shrink-0">${escape(primitive.icon || "📦")}</div> <div class="flex-1"><div class="flex items-center gap-3 mb-2"><span class="badge badge-primary">${escape(primitive.category)}</span> ${primitive.isPremium ? `<span class="badge badge-accent" data-svelte-h="svelte-1fk0svf">Premium</span>` : ``}</div> <h1 class="text-3xl sm:text-4xl font-display font-bold mb-3">${escape(primitive.name)}</h1> <p class="text-surface-400 text-lg">${escape(primitive.description)}</p></div>  ${mastery ? `<div class="card p-4 min-w-48"><div class="text-sm text-surface-500 mb-1" data-svelte-h="svelte-1g4c0ch">Your Mastery</div> <div class="flex items-center gap-2 mb-2"><span class="${"text-2xl font-bold " + escape(getMasteryColorClass(mastery.level), true)}">Level ${escape(mastery.level)}</span></div> <div class="text-sm text-surface-400">${escape(getMasteryName(mastery.level))}</div> <div class="progress-bar mt-3"><div class="progress-fill" style="${"width: " + escape(mastery.level / 5 * 100, true) + "%"}"></div></div></div>` : ``}</div></div></div> <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"> <div class="flex items-center gap-4 mb-8 -mt-4"><span class="text-surface-500 text-sm" data-svelte-h="svelte-u3jgyp">View syntax in:</span> <div class="flex gap-2">${each(supportedLanguages.slice(0, 4), (lang) => {
    return `<button class="${"px-3 py-1.5 rounded-lg text-sm font-medium transition-all " + escape(
      $selectedLanguage === lang.id ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "bg-surface-800/50 text-surface-400 border border-transparent hover:border-surface-700",
      true
    )}">${escape(lang.icon)} ${escape(lang.name)} </button>`;
  })}</div></div> <div class="grid lg:grid-cols-3 gap-8"> <div class="lg:col-span-2 space-y-8"> <section class="card p-6"><h2 class="text-xl font-semibold mb-4 flex items-center gap-2">${validate_component(Book_open, "BookOpen").$$render($$result, { size: 20, class: "text-primary-400" }, {}, {})}
							Why It Matters</h2> <p class="text-surface-300 leading-relaxed">${escape(primitive.whyItMatters)}</p></section>  <section class="card overflow-hidden"><div class="p-4 border-b border-surface-800 flex items-center justify-between"><h2 class="text-lg font-semibold" data-svelte-h="svelte-17r51tg">Syntax</h2> <span class="text-surface-500 text-sm">${escape($selectedLanguage)}</span></div> <div class="bg-surface-950 p-4"><pre class="font-mono text-sm text-surface-300 overflow-x-auto">${escape(currentSyntax.syntax)}</pre></div></section>  <section class="card overflow-hidden"><div class="p-4 border-b border-surface-800 flex items-center justify-between"><h2 class="text-lg font-semibold" data-svelte-h="svelte-1caruvp">Example</h2> <button class="btn btn-ghost text-sm py-1">${validate_component(Play, "Play").$$render($$result, { size: 14 }, {}, {})}
								Run</button></div> <div class="bg-surface-950 p-4"><pre class="font-mono text-sm text-surface-300 overflow-x-auto">${escape(currentSyntax.example)}</pre></div></section>  <div class="grid sm:grid-cols-2 gap-6"> <section class="card p-6"><h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-primary-400">${validate_component(Lightbulb, "Lightbulb").$$render($$result, { size: 18 }, {}, {})}
								Best Practices</h2> <ul class="space-y-3">${each(primitive.bestPractices || [], (practice) => {
    return `<li class="flex items-start gap-2 text-sm">${validate_component(Check, "Check").$$render(
      $$result,
      {
        size: 16,
        class: "text-primary-500 mt-0.5 shrink-0"
      },
      {},
      {}
    )} <span class="text-surface-300">${escape(practice)}</span> </li>`;
  })}</ul></section>  <section class="card p-6"><h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-400">${validate_component(Alert_triangle, "AlertTriangle").$$render($$result, { size: 18 }, {}, {})}
								Common Pitfalls</h2> <ul class="space-y-3">${each(primitive.pitfalls || [], (pitfall) => {
    return `<li class="flex items-start gap-2 text-sm">${validate_component(X, "X").$$render(
      $$result,
      {
        size: 16,
        class: "text-orange-500 mt-0.5 shrink-0"
      },
      {},
      {}
    )} <span class="text-surface-300">${escape(pitfall)}</span> </li>`;
  })}</ul></section></div></div>  <div class="space-y-6"><div class="card p-6"><h2 class="text-lg font-semibold mb-4" data-svelte-h="svelte-sm3l67">Practice Exercises</h2> ${exercises.length > 0 ? `<div class="space-y-3">${each(exercises, (exercise) => {
    return `<a href="${"/practice/" + escape(primitive.id, true) + "/" + escape(exercise.id, true)}" class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors group"><div class="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center">${validate_component(Play, "Play").$$render(
      $$result,
      {
        size: 14,
        class: "text-surface-400 group-hover:text-primary-400 transition-colors"
      },
      {},
      {}
    )}</div> <div class="flex-1 min-w-0"><div class="font-medium text-sm truncate group-hover:text-primary-400 transition-colors">${escape(exercise.title)}</div> <div class="text-xs text-surface-500">${escape(exercise.estimatedMinutes)} min · Difficulty ${escape(exercise.difficulty)} </div></div> ${validate_component(Chevron_right, "ChevronRight").$$render(
      $$result,
      {
        size: 16,
        class: "text-surface-600 group-hover:text-primary-400 transition-colors"
      },
      {},
      {}
    )} </a>`;
  })}</div>` : `<p class="text-surface-500 text-sm" data-svelte-h="svelte-19eg3sv">No exercises available yet.</p>`} <a href="${"/practice?primitive=" + escape(primitive.id, true)}" class="btn btn-primary w-full mt-4 justify-center">Start Practicing
							${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 18 }, {}, {})}</a></div>  <div class="card p-6" data-svelte-h="svelte-hpq0ty"><h2 class="text-lg font-semibold mb-4">Related Primitives</h2> <div class="space-y-2"><a href="/learn/while-loop" class="block p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"><div class="font-medium text-sm">While Loop</div> <div class="text-xs text-surface-500">Similar iteration pattern</div></a> <a href="/learn/arrays" class="block p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"><div class="font-medium text-sm">Arrays</div> <div class="text-xs text-surface-500">Often used with loops</div></a></div></div></div></div></div></div>` : `<div class="min-h-screen flex items-center justify-center"><div class="text-center"><div class="text-6xl mb-4" data-svelte-h="svelte-o7z9f5">🔍</div> <h2 class="text-2xl font-bold mb-2" data-svelte-h="svelte-1agrqfo">Primitive not found</h2> <p class="text-surface-400 mb-6">The primitive &quot;${escape(primitiveId)}&quot; doesn&#39;t exist.</p> <a href="/learn" class="btn btn-primary" data-svelte-h="svelte-101jtmx">Back to Primitives</a></div></div>`}`;
});
export {
  Page as default
};
