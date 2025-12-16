import { c as create_ssr_component, b as escape, e as each, v as validate_component, m as missing_component } from "../../../chunks/ssr.js";
import { c as mockAchievements } from "../../../chunks/mock-data.js";
import { T as Trophy } from "../../../chunks/trophy.js";
import { T as Target } from "../../../chunks/target.js";
import { F as Flame } from "../../../chunks/flame.js";
import { Z as Zap } from "../../../chunks/zap.js";
import { S as Star } from "../../../chunks/star.js";
import { L as Lock } from "../../../chunks/lock.js";
function getRarityColor(rarity) {
  const colors = {
    common: "from-surface-600 to-surface-700 border-surface-500",
    rare: "from-blue-600 to-blue-800 border-blue-500",
    epic: "from-purple-600 to-purple-800 border-purple-500",
    legendary: "from-yellow-500 to-orange-600 border-yellow-400"
  };
  return colors[rarity] || colors.common;
}
function getRarityTextColor(rarity) {
  const colors = {
    common: "text-surface-400",
    rare: "text-blue-400",
    epic: "text-purple-400",
    legendary: "text-yellow-400"
  };
  return colors[rarity] || colors.common;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredAchievements;
  let unlockedCount;
  let totalXpEarned;
  let selectedCategory = "all";
  const categories = [
    { id: "all", name: "All", icon: Trophy },
    {
      id: "milestone",
      name: "Milestones",
      icon: Target
    },
    {
      id: "consistency",
      name: "Consistency",
      icon: Flame
    },
    { id: "skill", name: "Skills", icon: Zap },
    {
      id: "mastery",
      name: "Mastery",
      icon: Star
    }
  ];
  filteredAchievements = mockAchievements.filter((a) => selectedCategory === "all");
  unlockedCount = mockAchievements.filter((a) => a.unlocked).length;
  totalXpEarned = mockAchievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);
  return `<div class="min-h-screen"> <div class="bg-gradient-to-b from-accent-500/10 via-surface-900/50 to-transparent py-16"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-col md:flex-row md:items-end justify-between gap-6"><div data-svelte-h="svelte-d4bc86"><h1 class="text-4xl sm:text-5xl font-display font-bold mb-4"><span class="text-gradient">Achievements</span></h1> <p class="text-surface-400 text-lg">Unlock badges, earn rewards, and showcase your coding journey.</p></div>  <div class="flex gap-6"><div class="text-center"><div class="text-3xl font-bold text-primary-400">${escape(unlockedCount)}</div> <div class="text-sm text-surface-500" data-svelte-h="svelte-kdm9tb">Unlocked</div></div> <div class="text-center"><div class="text-3xl font-bold text-surface-400">${escape(mockAchievements.length - unlockedCount)}</div> <div class="text-sm text-surface-500" data-svelte-h="svelte-1gyjcro">Locked</div></div> <div class="text-center"><div class="text-3xl font-bold text-accent-400">${escape(totalXpEarned)}</div> <div class="text-sm text-surface-500" data-svelte-h="svelte-1g7dg8d">XP Earned</div></div></div></div></div></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-4"> <div class="flex gap-2 mb-8 overflow-x-auto pb-2">${each(categories, (cat) => {
    return `<button class="${"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all " + escape(
      selectedCategory === cat.id ? "bg-primary-500/20 text-primary-400 border border-primary-500/30" : "bg-surface-800/50 text-surface-400 border border-transparent hover:border-surface-700",
      true
    )}">${validate_component(cat.icon || missing_component, "svelte:component").$$render($$result, { size: 16 }, {}, {})} ${escape(cat.name)} </button>`;
  })}</div>  <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">${each(filteredAchievements, (achievement) => {
    return `<div class="${"card overflow-hidden group " + escape(achievement.unlocked ? "" : "opacity-60", true)}"> <div class="${"h-24 bg-gradient-to-br " + escape(getRarityColor(achievement.rarity), true) + " border-b flex items-center justify-center relative"}"><span class="${"text-5xl " + escape(achievement.unlocked ? "" : "grayscale opacity-50", true)}">${escape(achievement.icon)}</span> ${!achievement.unlocked ? `<div class="absolute inset-0 flex items-center justify-center bg-black/40">${validate_component(Lock, "Lock").$$render($$result, { size: 24, class: "text-surface-400" }, {}, {})} </div>` : ``}  <div class="${"absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium capitalize " + escape(getRarityTextColor(achievement.rarity), true) + " bg-black/30"}">${escape(achievement.rarity)} </div></div>  <div class="p-4"><h3 class="font-semibold mb-1">${escape(achievement.name)}</h3> <p class="text-sm text-surface-400 mb-3">${escape(achievement.description)}</p> <div class="flex items-center justify-between text-sm"><div class="flex items-center gap-1 text-accent-400">${validate_component(Zap, "Zap").$$render($$result, { size: 14 }, {}, {})} <span>+${escape(achievement.xpReward)} XP</span></div> ${achievement.unlocked && achievement.unlockedAt ? `<span class="text-surface-500 text-xs">${escape(new Date(achievement.unlockedAt).toLocaleDateString())} </span>` : ``} </div></div> </div>`;
  })}</div>  ${filteredAchievements.length === 0 ? `<div class="text-center py-20" data-svelte-h="svelte-odcajq"><div class="text-6xl mb-4">🏆</div> <h3 class="text-xl font-semibold mb-2">No achievements in this category</h3> <p class="text-surface-400">Keep practicing to unlock more!</p></div>` : ``}</div></div>`;
});
export {
  Page as default
};
