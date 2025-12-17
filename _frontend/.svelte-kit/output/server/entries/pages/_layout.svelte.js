import { c as create_ssr_component, v as validate_component, a as subscribe, e as each, b as escape, d as add_attribute, m as missing_component } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { d as derived, w as writable } from "../../chunks/index.js";
import { m as mockUser, a as mockProgress, b as mockMastery } from "../../chunks/mock-data.js";
import { F as Flame } from "../../chunks/flame.js";
import { Z as Zap } from "../../chunks/zap.js";
import { I as Icon } from "../../chunks/Icon.js";
import { B as Book_open } from "../../chunks/book-open.js";
import { C as Code_2 } from "../../chunks/code-2.js";
import { T as Trophy } from "../../chunks/trophy.js";
const user = writable(mockUser);
const isAuthenticated = derived(user, ($user) => !!$user);
derived(
  user,
  ($user) => $user?.subscriptionTier !== "free"
);
const userProgress = writable(mockProgress);
const masteryLevels = writable(mockMastery);
const currentStreak = derived(userProgress, ($p) => $p?.currentDailyStreak || 0);
const totalXp = derived(userProgress, ($p) => $p?.totalXp || 0);
const currentLevel = derived(userProgress, ($p) => $p?.currentLevel || 1);
derived(masteryLevels, ($levels) => {
  if ($levels.length === 0) return 0;
  const totalPossible = $levels.length * 5;
  const totalAchieved = $levels.reduce((sum, l) => sum + l.level, 0);
  return Math.round(totalAchieved / totalPossible * 100);
});
const Bar_chart_3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M3 3v18h18" }],
    ["path", { "d": "M18 17V9" }],
    ["path", { "d": "M13 17V5" }],
    ["path", { "d": "M8 17v-3" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "bar-chart-3" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      }
    ],
    ["polyline", { "points": "9 22 9 12 15 12 15 22" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "home" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "6",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "menu" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $isAuthenticated, $$unsubscribe_isAuthenticated;
  let $currentStreak, $$unsubscribe_currentStreak;
  let $totalXp, $$unsubscribe_totalXp;
  let $currentLevel, $$unsubscribe_currentLevel;
  let $user, $$unsubscribe_user;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => $isAuthenticated = value);
  $$unsubscribe_currentStreak = subscribe(currentStreak, (value) => $currentStreak = value);
  $$unsubscribe_totalXp = subscribe(totalXp, (value) => $totalXp = value);
  $$unsubscribe_currentLevel = subscribe(currentLevel, (value) => $currentLevel = value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    {
      href: "/learn",
      label: "Learn",
      icon: Book_open
    },
    {
      href: "/practice",
      label: "Practice",
      icon: Code_2
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Bar_chart_3
    },
    {
      href: "/achievements",
      label: "Achievements",
      icon: Trophy
    }
  ];
  function isActive(href) {
    if (href === "/") return $page.url.pathname === "/";
    return $page.url.pathname.startsWith(href);
  }
  $$unsubscribe_page();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_currentStreak();
  $$unsubscribe_totalXp();
  $$unsubscribe_currentLevel();
  $$unsubscribe_user();
  return `${$$result.head += `<!-- HEAD_svelte-1sqfmb9_START -->${$$result.title = `<title>ProgramPrimitives - Master the Physics of Code</title>`, ""}<!-- HEAD_svelte-1sqfmb9_END -->`, ""} <div class="min-h-screen flex flex-col"> <header class="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-lg border-b border-surface-800"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"> <a href="/" class="flex items-center gap-3 group" data-svelte-h="svelte-1qf690s"><img src="/LOGO_light.webp" alt="ProgramPrimitives" class="h-9 w-auto transition-transform group-hover:scale-105"> <span class="font-display font-semibold text-lg hidden sm:block">Program<span class="text-gradient">Primitives</span></span></a>  <nav class="hidden md:flex items-center gap-1">${each(navItems, (item) => {
    return `<a${add_attribute("href", item.href, 0)} class="${"flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors " + escape(
      isActive(item.href) ? "bg-surface-800 text-primary-400" : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/50",
      true
    )}">${validate_component(item.icon || missing_component, "svelte:component").$$render($$result, { size: 18 }, {}, {})} ${escape(item.label)} </a>`;
  })}</nav>  <div class="flex items-center gap-4">${$isAuthenticated ? ` <div class="hidden sm:flex items-center gap-4 text-sm"><div class="flex items-center gap-1.5 text-orange-500">${validate_component(Flame, "Flame").$$render($$result, { size: 18, class: "fill-orange-500/30" }, {}, {})} <span class="font-semibold">${escape($currentStreak)}</span></div> <div class="flex items-center gap-1.5 text-accent-400">${validate_component(Zap, "Zap").$$render($$result, { size: 18, class: "fill-accent-400/30" }, {}, {})} <span class="font-semibold">${escape($totalXp)}</span></div> <div class="badge badge-primary">Lvl ${escape($currentLevel)}</div></div>  <div class="relative"><button class="flex items-center gap-2 p-1 rounded-full hover:bg-surface-800 transition-colors"><div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">${escape($user?.displayName?.charAt(0).toUpperCase() || "U")}</div></button></div>` : `<a href="/login" class="btn btn-ghost text-sm" data-svelte-h="svelte-ojxb3g">Log in</a> <a href="/register" class="btn btn-primary text-sm" data-svelte-h="svelte-p0zpb9">Get Started</a>`}  <button class="md:hidden p-2 rounded-lg hover:bg-surface-800 transition-colors">${`${validate_component(Menu, "Menu").$$render($$result, { size: 24 }, {}, {})}`}</button></div></div></div>  ${``}</header>  <main class="flex-1">${slots.default ? slots.default({}) : ``}</main>  <footer class="border-t border-surface-800 py-12 mt-auto bg-surface-950/50" data-svelte-h="svelte-tye6xv"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"> <div class="sm:col-span-2 lg:col-span-1"><a href="/" class="flex items-center gap-3 mb-4"><img src="/LOGO_light.webp" alt="ProgramPrimitives" class="h-8 w-auto"></a> <p class="text-surface-500 text-sm">Master the physics of code, not just the vocabulary.</p></div>  <div><h4 class="font-semibold mb-4">Learn</h4> <ul class="space-y-2 text-sm text-surface-400"><li><a href="/learn" class="hover:text-surface-200 transition-colors">All Primitives</a></li> <li><a href="/learn?category=fundamentals" class="hover:text-surface-200 transition-colors">Fundamentals</a></li> <li><a href="/learn?category=data-structures" class="hover:text-surface-200 transition-colors">Data Structures</a></li> <li><a href="/learn?category=advanced" class="hover:text-surface-200 transition-colors">Advanced</a></li></ul></div>  <div><h4 class="font-semibold mb-4">Practice</h4> <ul class="space-y-2 text-sm text-surface-400"><li><a href="/practice" class="hover:text-surface-200 transition-colors">Exercises</a></li> <li><a href="/practice?challenge=daily" class="hover:text-surface-200 transition-colors">Daily Challenge</a></li> <li><a href="/achievements" class="hover:text-surface-200 transition-colors">Achievements</a></li> <li><a href="/leaderboard" class="hover:text-surface-200 transition-colors">Leaderboard</a></li></ul></div>  <div><h4 class="font-semibold mb-4">Company</h4> <ul class="space-y-2 text-sm text-surface-400"><li><a href="/about" class="hover:text-surface-200 transition-colors">About</a></li> <li><a href="/pricing" class="hover:text-surface-200 transition-colors">Pricing</a></li> <li><a href="/privacy" class="hover:text-surface-200 transition-colors">Privacy</a></li> <li><a href="/terms" class="hover:text-surface-200 transition-colors">Terms</a></li></ul></div></div> <div class="pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4"><div class="text-surface-500 text-sm">© 2024 ProgramPrimitives. All rights reserved.</div> <div class="flex items-center gap-6 text-surface-500"><a href="https://github.com" class="hover:text-surface-300 transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg></a> <a href="https://twitter.com" class="hover:text-surface-300 transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></a> <a href="https://discord.com" class="hover:text-surface-300 transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"></path></svg></a></div></div></div></footer></div>`;
});
export {
  Layout as default
};
