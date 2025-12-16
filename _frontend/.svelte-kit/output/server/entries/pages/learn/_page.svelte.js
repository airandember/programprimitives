import { c as create_ssr_component, v as validate_component, a as subscribe, d as add_attribute, e as each, b as escape } from "../../../chunks/ssr.js";
import { p as primitives, s as selectedLanguage, c as categories, a as supportedLanguages } from "../../../chunks/primitives.js";
import { b as mockMastery } from "../../../chunks/mock-data.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { L as Lock } from "../../../chunks/lock.js";
import { C as Check } from "../../../chunks/check.js";
import { S as Star } from "../../../chunks/star.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
const Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "11", "cy": "11", "r": "8" }],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "search" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
function getMasteryColor(level) {
  const colors = [
    "bg-surface-700",
    "bg-surface-600",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-primary-500",
    "bg-accent-400"
  ];
  return colors[level] || colors[0];
}
function getDifficultyLabel(d) {
  const labels = ["", "Beginner", "Easy", "Medium", "Hard", "Expert"];
  return labels[d] || "";
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredPrimitives;
  let groupedPrimitives;
  let $primitives, $$unsubscribe_primitives;
  let $selectedLanguage, $$unsubscribe_selectedLanguage;
  $$unsubscribe_primitives = subscribe(primitives, (value) => $primitives = value);
  $$unsubscribe_selectedLanguage = subscribe(selectedLanguage, (value) => $selectedLanguage = value);
  let searchQuery = "";
  let selectedCategory = "all";
  function getMasteryLevel(primitiveId) {
    const mastery = mockMastery.find((m) => m.primitiveId === primitiveId && m.language === $selectedLanguage);
    return mastery?.level || 0;
  }
  filteredPrimitives = $primitives.filter((p) => {
    const matchesSearch = searchQuery === "";
    const matchesCategory = selectedCategory === "all";
    return matchesSearch && matchesCategory;
  });
  groupedPrimitives = categories.map((cat) => ({
    ...cat,
    primitives: filteredPrimitives.filter((p) => p.category === cat.id)
  })).filter((cat) => cat.primitives.length > 0);
  $$unsubscribe_primitives();
  $$unsubscribe_selectedLanguage();
  return `<div class="min-h-screen"> <div class="bg-gradient-to-b from-primary-500/10 via-surface-900/50 to-transparent py-16" data-svelte-h="svelte-spk0or"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h1 class="text-4xl sm:text-5xl font-display font-bold mb-4">Learn <span class="text-gradient">Primitives</span></h1> <p class="text-surface-400 text-lg max-w-2xl">Master the building blocks of programming. Each primitive is explained with examples in your
				preferred language.</p></div></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-4"> <div class="card p-4 mb-8"><div class="flex flex-col sm:flex-row gap-4"> <div class="relative flex-1">${validate_component(Search, "Search").$$render(
    $$result,
    {
      size: 18,
      class: "absolute left-3 top-1/2 -translate-y-1/2 text-surface-500"
    },
    {},
    {}
  )} <input type="text" placeholder="Search primitives..." class="input pl-10"${add_attribute("value", searchQuery, 0)}></div>  <select class="input w-full sm:w-48"><option value="all" data-svelte-h="svelte-16sr5ty">All Categories</option>${each(categories, (category) => {
    return `<option${add_attribute("value", category.id, 0)}>${escape(category.icon)} ${escape(category.name)}</option>`;
  })}</select>  <select class="input w-full sm:w-44">${each(supportedLanguages, (lang) => {
    return `<option${add_attribute("value", lang.id, 0)}>${escape(lang.icon)} ${escape(lang.name)}</option>`;
  })}</select></div></div>  ${each(groupedPrimitives, (category) => {
    return `<div class="mb-12"><div class="flex items-center gap-3 mb-6"><span class="text-3xl">${escape(category.icon)}</span> <div><h2 class="text-2xl font-display font-semibold">${escape(category.name)}</h2> <p class="text-surface-500 text-sm">${escape(category.primitives.length)} primitives</p> </div></div> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${each(category.primitives, (primitive) => {
      let mastery = getMasteryLevel(primitive.id);
      return ` <a href="${"/learn/" + escape(primitive.id, true)}" class="card group relative overflow-hidden transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"> ${primitive.isPremium ? `<div class="absolute top-0 right-0 bg-gradient-to-bl from-accent-500/20 to-transparent p-4">${validate_component(Lock, "Lock").$$render($$result, { size: 16, class: "text-accent-400" }, {}, {})} </div>` : ``} <div class="p-5"> <div class="flex items-start justify-between mb-4"><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center text-2xl border border-surface-700 group-hover:border-primary-500/30 transition-colors">${escape(primitive.icon || "📦")}</div>  <div class="flex items-center gap-1">${each(Array(5), (_, i) => {
        return `<div class="${"w-2 h-2 rounded-full transition-all duration-300 " + escape(
          i < mastery ? getMasteryColor(mastery) : "bg-surface-800",
          true
        )}"></div>`;
      })} ${mastery === 5 ? `${validate_component(Check, "Check").$$render($$result, { size: 14, class: "text-accent-400 ml-1" }, {}, {})}` : ``} </div></div>  <h3 class="font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors">${escape(primitive.name)}</h3> <p class="text-surface-400 text-sm mb-4 line-clamp-2">${escape(primitive.description)}</p>  <div class="flex items-center justify-between text-sm"><div class="flex items-center gap-2 text-surface-500"><div class="flex items-center gap-0.5">${each(Array(primitive.difficulty), (_) => {
        return `${validate_component(Star, "Star").$$render(
          $$result,
          {
            size: 12,
            class: "fill-primary-500 text-primary-500"
          },
          {},
          {}
        )}`;
      })} ${each(Array(5 - primitive.difficulty), (_) => {
        return `${validate_component(Star, "Star").$$render($$result, { size: 12, class: "text-surface-700" }, {}, {})}`;
      })}</div> <span class="text-xs">${escape(getDifficultyLabel(primitive.difficulty))}</span></div> ${validate_component(Chevron_right, "ChevronRight").$$render(
        $$result,
        {
          size: 18,
          class: "text-surface-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
        },
        {},
        {}
      )} </div></div>  <div class="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div> </a>`;
    })}</div> </div>`;
  })}  ${filteredPrimitives.length === 0 ? `<div class="text-center py-20" data-svelte-h="svelte-7c30aw"><div class="text-6xl mb-4">🔍</div> <h3 class="text-xl font-semibold mb-2">No primitives found</h3> <p class="text-surface-400">Try adjusting your search or filters</p></div>` : ``}</div></div>`;
});
export {
  Page as default
};
