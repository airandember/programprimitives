import { c as create_ssr_component, v as validate_component, b as escape, e as each, d as add_attribute } from "../../../chunks/ssr.js";
import { F as Flame } from "../../../chunks/flame.js";
import { Z as Zap } from "../../../chunks/zap.js";
import { T as Target } from "../../../chunks/target.js";
import { C as Clock } from "../../../chunks/clock.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
const Award = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "8", "r": "6" }],
    [
      "path",
      {
        "d": "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "award" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "4",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "line",
      {
        "x1": "16",
        "x2": "16",
        "y1": "2",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "8",
        "x2": "8",
        "y1": "2",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "3",
        "x2": "21",
        "y1": "10",
        "y2": "10"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "calendar" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Trending_up = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["polyline", { "points": "22 7 13.5 15.5 8.5 10.5 2 17" }],
    ["polyline", { "points": "16 7 22 7 22 13" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "trending-up" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
function getActivityColor(level) {
  const colors = [
    "bg-surface-800",
    "bg-primary-900",
    "bg-primary-700",
    "bg-primary-500",
    "bg-primary-400"
  ];
  return colors[level] || colors[0];
}
function getMasteryColor(level) {
  const colors = [
    "text-surface-500",
    "text-surface-400",
    "text-yellow-500",
    "text-orange-500",
    "text-primary-500",
    "text-accent-400"
  ];
  return colors[level] || colors[0];
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const stats = {
    currentStreak: 7,
    longestStreak: 23,
    totalXp: 2450,
    level: 8,
    exercisesCompleted: 47,
    timeSpentHours: 12
  };
  const masteryData = [
    {
      name: "For Loop",
      language: "javascript",
      level: 5,
      progress: 100
    },
    {
      name: "While Loop",
      language: "javascript",
      level: 4,
      progress: 80
    },
    {
      name: "If/Else",
      language: "javascript",
      level: 5,
      progress: 100
    },
    {
      name: "Arrays",
      language: "javascript",
      level: 3,
      progress: 60
    },
    {
      name: "Functions",
      language: "javascript",
      level: 2,
      progress: 40
    },
    {
      name: "For Loop",
      language: "python",
      level: 3,
      progress: 60
    }
  ];
  const activityCalendar = Array(49).fill(0).map(() => Math.floor(Math.random() * 5));
  const recentAchievements = [
    {
      name: "Week Warrior",
      icon: "🔥",
      date: "2 days ago"
    },
    {
      name: "Loop Legend",
      icon: "🔄",
      date: "5 days ago"
    },
    {
      name: "First Steps",
      icon: "👣",
      date: "2 weeks ago"
    }
  ];
  return `<div class="min-h-screen"> <div class="bg-gradient-to-b from-surface-900 to-transparent py-12" data-svelte-h="svelte-1d37ue4"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h1 class="text-3xl sm:text-4xl font-display font-bold mb-4">Dashboard</h1> <p class="text-surface-400">Track your progress and keep the momentum going!</p></div></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"> <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"> <div class="card p-5"><div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">${validate_component(Flame, "Flame").$$render($$result, { size: 20, class: "text-orange-500" }, {}, {})}</div> <span class="text-surface-400 text-sm" data-svelte-h="svelte-1rrszk8">Current Streak</span></div> <div class="text-3xl font-bold">${escape(stats.currentStreak)} <span class="text-surface-500 text-lg font-normal" data-svelte-h="svelte-1ps2oal">days</span></div> <div class="text-surface-500 text-sm mt-1">Best: ${escape(stats.longestStreak)} days</div></div>  <div class="card p-5"><div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">${validate_component(Zap, "Zap").$$render($$result, { size: 20, class: "text-accent-500" }, {}, {})}</div> <span class="text-surface-400 text-sm" data-svelte-h="svelte-4fktt">Total XP</span></div> <div class="text-3xl font-bold">${escape(stats.totalXp.toLocaleString())}</div> <div class="text-surface-500 text-sm mt-1">Level ${escape(stats.level)}</div></div>  <div class="card p-5"><div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">${validate_component(Target, "Target").$$render($$result, { size: 20, class: "text-primary-500" }, {}, {})}</div> <span class="text-surface-400 text-sm" data-svelte-h="svelte-6frt2w">Exercises</span></div> <div class="text-3xl font-bold">${escape(stats.exercisesCompleted)}</div> <div class="text-surface-500 text-sm mt-1" data-svelte-h="svelte-19f9vbe">completed</div></div>  <div class="card p-5"><div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">${validate_component(Clock, "Clock").$$render($$result, { size: 20, class: "text-purple-500" }, {}, {})}</div> <span class="text-surface-400 text-sm" data-svelte-h="svelte-hi03a4">Time Spent</span></div> <div class="text-3xl font-bold">${escape(stats.timeSpentHours)} <span class="text-surface-500 text-lg font-normal" data-svelte-h="svelte-2nql9b">hrs</span></div> <div class="text-surface-500 text-sm mt-1" data-svelte-h="svelte-iwx8i3">learning</div></div></div> <div class="grid lg:grid-cols-3 gap-8"> <div class="lg:col-span-2 space-y-8"> <div class="card p-6"><div class="flex items-center justify-between mb-6"><h2 class="font-semibold text-lg flex items-center gap-2">${validate_component(Calendar, "Calendar").$$render($$result, { size: 20, class: "text-primary-400" }, {}, {})}
							Activity</h2> <span class="text-surface-500 text-sm" data-svelte-h="svelte-b247vm">Last 7 weeks</span></div> <div class="grid grid-cols-7 gap-1">${each(activityCalendar, (level) => {
    return `<div class="${"aspect-square rounded " + escape(getActivityColor(level), true)}" title="${escape(level, true) + " activities"}"></div>`;
  })}</div> <div class="flex items-center justify-end gap-2 mt-4 text-sm text-surface-500"><span data-svelte-h="svelte-fotiv">Less</span> ${each([0, 1, 2, 3, 4], (level) => {
    return `<div class="${"w-3 h-3 rounded " + escape(getActivityColor(level), true)}"></div>`;
  })} <span data-svelte-h="svelte-83s2i7">More</span></div></div>  <div class="card p-6"><div class="flex items-center justify-between mb-6"><h2 class="font-semibold text-lg flex items-center gap-2">${validate_component(Trending_up, "TrendingUp").$$render($$result, { size: 20, class: "text-primary-400" }, {}, {})}
							Primitive Mastery</h2> <a href="/dashboard/primitives" class="text-primary-400 text-sm hover:underline" data-svelte-h="svelte-1fagbnn">View all</a></div> <div class="space-y-4">${each(masteryData.slice(0, 5), (item) => {
    return `<div><div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2"><span class="font-medium">${escape(item.name)}</span> <span class="text-surface-500 text-xs">(${escape(item.language)})</span></div> <span${add_attribute("class", getMasteryColor(item.level), 0)}>Level ${escape(item.level)}</span></div> <div class="progress-bar"><div class="progress-fill" style="${"width: " + escape(item.progress, true) + "%"}"></div></div> </div>`;
  })}</div></div></div>  <div class="space-y-8"> <div class="card p-6"><h2 class="font-semibold text-lg mb-4" data-svelte-h="svelte-5blpp2">Level Progress</h2> <div class="text-center mb-4"><div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-3xl font-bold">${escape(stats.level)}</div></div> <div class="text-center mb-4" data-svelte-h="svelte-b1z228"><div class="text-surface-400 text-sm mb-1">Practitioner</div> <div class="text-surface-500 text-xs">550 XP to next level</div></div> <div class="progress-bar" data-svelte-h="svelte-bh5n0"><div class="progress-fill" style="width: 78%"></div></div></div>  <div class="card p-6"><div class="flex items-center justify-between mb-4"><h2 class="font-semibold text-lg flex items-center gap-2">${validate_component(Award, "Award").$$render($$result, { size: 20, class: "text-primary-400" }, {}, {})}
							Achievements</h2> <a href="/achievements" class="text-primary-400 text-sm hover:underline" data-svelte-h="svelte-1csrwe5">View all</a></div> <div class="space-y-3">${each(recentAchievements, (achievement) => {
    return `<div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50"><span class="text-2xl">${escape(achievement.icon)}</span> <div class="flex-1"><div class="font-medium">${escape(achievement.name)}</div> <div class="text-surface-500 text-xs">${escape(achievement.date)}</div></div> </div>`;
  })}</div></div>  <div class="card p-6"><h2 class="font-semibold text-lg mb-4" data-svelte-h="svelte-z3it8k">Continue Learning</h2> <div class="space-y-2"><a href="/practice/for-loop/ex-003" class="flex items-center justify-between p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"><div data-svelte-h="svelte-fv4q66"><div class="font-medium">Nested Loops</div> <div class="text-surface-500 text-sm">For Loop</div></div> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 18, class: "text-surface-500" }, {}, {})}</a> <a href="/learn/arrays" class="flex items-center justify-between p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"><div data-svelte-h="svelte-1wvai1h"><div class="font-medium">Learn Arrays</div> <div class="text-surface-500 text-sm">Next primitive</div></div> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 18, class: "text-surface-500" }, {}, {})}</a></div></div></div></div></div></div>`;
});
export {
  Page as default
};
