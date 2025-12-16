import { c as create_ssr_component, a as subscribe, v as validate_component, b as escape, e as each, d as add_attribute } from "../../../chunks/ssr.js";
import { p as primitives, s as selectedLanguage, a as supportedLanguages } from "../../../chunks/primitives.js";
import { f as mockExercises, g as getPrimitiveById } from "../../../chunks/mock-data.js";
import { F as Flame } from "../../../chunks/flame.js";
import { T as Trophy } from "../../../chunks/trophy.js";
import { C as Clock } from "../../../chunks/clock.js";
import { P as Play } from "../../../chunks/play.js";
import { T as Target } from "../../../chunks/target.js";
import { S as Star } from "../../../chunks/star.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredExercises;
  let exercisesByPrimitive;
  let $primitives, $$unsubscribe_primitives;
  let $$unsubscribe_selectedLanguage;
  $$unsubscribe_primitives = subscribe(primitives, (value) => $primitives = value);
  $$unsubscribe_selectedLanguage = subscribe(selectedLanguage, (value) => value);
  let selectedDifficulty = "all";
  let selectedPrimitive = "all";
  const completedExercises = /* @__PURE__ */ new Set(["ex-001", "ex-004", "ex-005"]);
  const exerciseScores = {
    "ex-001": 95,
    "ex-004": 100,
    "ex-005": 88
  };
  function getPrimitiveName(id) {
    const p = getPrimitiveById(id);
    return p?.name || id;
  }
  function getPrimitiveIcon(id) {
    const p = getPrimitiveById(id);
    return p?.icon || "📦";
  }
  const dailyChallenge = {
    title: "Today's Challenge: FizzBuzz",
    xpReward: 100,
    timeLimit: "15 min",
    exerciseId: "ex-003",
    primitiveId: "for-loop"
  };
  filteredExercises = mockExercises.filter((e) => {
    const matchesDifficulty = selectedDifficulty === "all";
    const matchesPrimitive = selectedPrimitive === "all";
    return matchesDifficulty && matchesPrimitive;
  });
  exercisesByPrimitive = filteredExercises.reduce(
    (acc, ex) => {
      if (!acc[ex.primitiveId]) {
        acc[ex.primitiveId] = [];
      }
      acc[ex.primitiveId].push(ex);
      return acc;
    },
    {}
  );
  $$unsubscribe_primitives();
  $$unsubscribe_selectedLanguage();
  return `<div class="min-h-screen"> <div class="bg-gradient-to-b from-accent-500/10 via-surface-900/50 to-transparent py-16" data-svelte-h="svelte-olucr1"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h1 class="text-4xl sm:text-5xl font-display font-bold mb-4"><span class="text-gradient">Practice</span></h1> <p class="text-surface-400 text-lg max-w-2xl">Put your knowledge to the test. Complete exercises, earn XP, and build your streak.</p></div></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-4"> <div class="card bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 border-primary-500/30 p-6 mb-8 relative overflow-hidden"> <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl"></div> <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl"></div> <div class="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div class="flex items-center gap-4"><div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">${validate_component(Flame, "Flame").$$render($$result, { size: 28, class: "text-white" }, {}, {})}</div> <div><div class="flex items-center gap-2 mb-1" data-svelte-h="svelte-1kb5u4"><span class="text-sm font-medium text-primary-400">Daily Challenge</span> <span class="text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full">New today!</span></div> <h3 class="font-semibold text-lg">${escape(dailyChallenge.title)}</h3> <div class="flex items-center gap-4 text-sm text-surface-400 mt-1"><span class="flex items-center gap-1">${validate_component(Trophy, "Trophy").$$render($$result, { size: 14, class: "text-accent-400" }, {}, {})} ${escape(dailyChallenge.xpReward)} XP</span> <span class="flex items-center gap-1">${validate_component(Clock, "Clock").$$render($$result, { size: 14 }, {}, {})} ${escape(dailyChallenge.timeLimit)}</span></div></div></div> <a href="${"/practice/" + escape(dailyChallenge.primitiveId, true) + "/" + escape(dailyChallenge.exerciseId, true)}" class="btn btn-primary shadow-lg shadow-primary-500/25">${validate_component(Play, "Play").$$render($$result, { size: 18 }, {}, {})}
					Start Challenge</a></div></div>  <div class="card p-4 mb-8"><div class="flex flex-col sm:flex-row gap-4"> <select class="input w-full sm:w-auto"><option value="all" data-svelte-h="svelte-yxbgbs">All Primitives</option>${each($primitives, (p) => {
    return `<option${add_attribute("value", p.id, 0)}>${escape(p.icon)} ${escape(p.name)}</option>`;
  })}</select>  <select class="input w-full sm:w-auto"><option value="all" data-svelte-h="svelte-p5rce3">All Difficulties</option><option value="1" data-svelte-h="svelte-1w6d2zx">⭐ Beginner</option><option value="2" data-svelte-h="svelte-4xm7nm">⭐⭐ Easy</option><option value="3" data-svelte-h="svelte-ndas2i">⭐⭐⭐ Medium</option><option value="4" data-svelte-h="svelte-vybaip">⭐⭐⭐⭐ Hard</option><option value="5" data-svelte-h="svelte-4pi95n">⭐⭐⭐⭐⭐ Expert</option></select>  <select class="input w-full sm:w-auto">${each(supportedLanguages, (lang) => {
    return `<option${add_attribute("value", lang.id, 0)}>${escape(lang.icon)} ${escape(lang.name)}</option>`;
  })}</select></div></div>  ${each(Object.entries(exercisesByPrimitive), ([primitiveId, exercises]) => {
    return `<div class="mb-10"><div class="flex items-center gap-3 mb-4"><span class="text-2xl">${escape(getPrimitiveIcon(primitiveId))}</span> <h2 class="text-xl font-semibold">${escape(getPrimitiveName(primitiveId))}</h2> <span class="text-surface-500 text-sm">(${escape(exercises.length)} exercises)</span></div> <div class="space-y-3">${each(exercises, (exercise) => {
      let isCompleted = completedExercises.has(exercise.id), score = exerciseScores[exercise.id];
      return `  <a href="${"/practice/" + escape(exercise.primitiveId, true) + "/" + escape(exercise.id, true)}" class="card p-5 flex items-center gap-4 group hover:border-primary-500/50 transition-all"> <div class="${"w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors " + escape(
        isCompleted ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "bg-surface-800 text-surface-500 group-hover:bg-surface-700",
        true
      )}">${isCompleted ? `${validate_component(Target, "Target").$$render($$result, { size: 24 }, {}, {})}` : `${validate_component(Play, "Play").$$render($$result, { size: 24 }, {}, {})}`}</div>  <div class="flex-1 min-w-0"><h3 class="font-semibold mb-1 group-hover:text-primary-400 transition-colors truncate">${escape(exercise.title)}</h3> <p class="text-sm text-surface-500 mb-2 line-clamp-1">${escape(exercise.description)}</p> <div class="flex items-center gap-4 text-sm text-surface-500"><span class="flex items-center gap-1">${validate_component(Clock, "Clock").$$render($$result, { size: 14 }, {}, {})} ${escape(exercise.estimatedMinutes)} min</span> <div class="flex items-center gap-0.5">${each(Array(exercise.difficulty), (_) => {
        return `${validate_component(Star, "Star").$$render(
          $$result,
          {
            size: 12,
            class: "fill-primary-500 text-primary-500"
          },
          {},
          {}
        )}`;
      })} ${each(Array(5 - exercise.difficulty), (_) => {
        return `${validate_component(Star, "Star").$$render($$result, { size: 12, class: "text-surface-700" }, {}, {})}`;
      })}</div> </div></div>  <div class="shrink-0 text-right">${isCompleted && score ? `<div class="${"text-2xl font-bold " + escape(
        score >= 90 ? "text-primary-400" : score >= 70 ? "text-yellow-400" : "text-orange-400",
        true
      )}">${escape(score)}%</div> <div class="text-sm text-surface-500" data-svelte-h="svelte-cqpg66">Score</div>` : `<div class="text-surface-600 text-sm" data-svelte-h="svelte-duj8th">Not started</div>`}</div> ${validate_component(Chevron_right, "ChevronRight").$$render(
        $$result,
        {
          size: 20,
          class: "text-surface-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all shrink-0"
        },
        {},
        {}
      )} </a>`;
    })}</div> </div>`;
  })}  ${filteredExercises.length === 0 ? `<div class="text-center py-20" data-svelte-h="svelte-1ufiv8r"><div class="text-6xl mb-4">🎯</div> <h3 class="text-xl font-semibold mb-2">No exercises found</h3> <p class="text-surface-400">Try adjusting your filters</p></div>` : ``}</div></div>`;
});
export {
  Page as default
};
