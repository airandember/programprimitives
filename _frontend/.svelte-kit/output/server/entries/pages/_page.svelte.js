import { c as create_ssr_component, v as validate_component, e as each, b as escape, m as missing_component } from "../../chunks/ssr.js";
import { I as Icon } from "../../chunks/Icon.js";
import { B as Book_open } from "../../chunks/book-open.js";
import { C as Code_2 } from "../../chunks/code-2.js";
import { Z as Zap } from "../../chunks/zap.js";
import { T as Trophy } from "../../chunks/trophy.js";
const Arrow_right = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "arrow-right" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Check_circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M22 11.08V12a10 10 0 1 1-5.93-9.14"
      }
    ],
    ["path", { "d": "m9 11 3 3L22 4" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check-circle" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Globe = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    [
      "path",
      {
        "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
      }
    ],
    ["path", { "d": "M2 12h20" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "globe" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const features = [
    {
      icon: Code_2,
      title: "Tool-First Learning",
      description: "Learn the universal primitives of programming - loops, conditionals, functions - before diving into syntax."
    },
    {
      icon: Globe,
      title: "Any Language",
      description: "Apply your knowledge to Python, JavaScript, Go, C++, and more. One concept, many implementations."
    },
    {
      icon: Zap,
      title: "Interactive Practice",
      description: "Write real code in our secure sandbox. Get instant feedback and learn from your mistakes."
    },
    {
      icon: Trophy,
      title: "Track Progress",
      description: "Build streaks, earn badges, and watch your mastery grow. Gamified learning that sticks."
    }
  ];
  const primitiveCategories = [
    {
      name: "Fundamentals",
      count: 12,
      color: "primary"
    },
    {
      name: "Data Structures",
      count: 8,
      color: "accent"
    },
    {
      name: "Functions",
      count: 10,
      color: "primary"
    },
    {
      name: "Advanced",
      count: 6,
      color: "accent"
    }
  ];
  const testimonials = [
    {
      quote: "Finally, a platform that teaches HOW to think, not just what to type.",
      author: "Sarah K.",
      role: "Junior Developer"
    },
    {
      quote: "Switching from Python to Go was easy because I already knew the primitives.",
      author: "Marcus R.",
      role: "Full Stack Engineer"
    },
    {
      quote: "The gamification keeps me coming back. 47 day streak and counting!",
      author: "Alex T.",
      role: "CS Student"
    }
  ];
  return `<div class="relative overflow-hidden"> <section class="relative py-20 sm:py-32"> <div class="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent"></div> <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[128px]"></div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center max-w-4xl mx-auto"> <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-800/50 border border-surface-700 mb-8" data-svelte-h="svelte-1rwy47v"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span> <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span></span> <span class="text-sm text-surface-300">Now in beta — join 2,000+ learners</span></div>  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6" data-svelte-h="svelte-sg2sg0">Master the
					<span class="text-gradient">Physics of Code</span></h1> <p class="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10" data-svelte-h="svelte-ueiork">Stop memorizing syntax. Learn the universal tools of programming that work in
					<em>any</em> language. Loops, conditionals, functions — the building blocks of everything.</p>  <div class="flex flex-col sm:flex-row items-center justify-center gap-4"><a href="/register" class="btn btn-primary text-lg px-8 py-3">Start Learning Free
						${validate_component(Arrow_right, "ArrowRight").$$render($$result, { size: 20 }, {}, {})}</a> <a href="/learn" class="btn btn-secondary text-lg px-8 py-3">${validate_component(Book_open, "BookOpen").$$render($$result, { size: 20 }, {}, {})}
						Explore Primitives</a></div>  <div class="flex items-center justify-center gap-8 mt-12 text-surface-500 text-sm"><div class="flex items-center gap-2">${validate_component(Check_circle, "CheckCircle").$$render($$result, { size: 16, class: "text-primary-500" }, {}, {})} <span data-svelte-h="svelte-1ncpwsj">No credit card required</span></div> <div class="flex items-center gap-2">${validate_component(Check_circle, "CheckCircle").$$render($$result, { size: 16, class: "text-primary-500" }, {}, {})} <span data-svelte-h="svelte-fd2ohe">7 languages supported</span></div> <div class="flex items-center gap-2">${validate_component(Check_circle, "CheckCircle").$$render($$result, { size: 16, class: "text-primary-500" }, {}, {})} <span data-svelte-h="svelte-1hovk95">100+ exercises</span></div></div></div></div></section>  <section class="py-20 bg-surface-900/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-16" data-svelte-h="svelte-11glq1d"><h2 class="text-3xl sm:text-4xl font-display font-bold mb-4">Why ProgramPrimitives?</h2> <p class="text-surface-400 max-w-2xl mx-auto">Traditional coding education focuses on syntax. We focus on concepts that transfer
					across every language you&#39;ll ever learn.</p></div> <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">${each(features, (feature, i) => {
    return `<div class="card p-6 animate-fade-in" style="${"animation-delay: " + escape(i * 100, true) + "ms"}"><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4">${validate_component(feature.icon || missing_component, "svelte:component").$$render($$result, { size: 24, class: "text-primary-400" }, {}, {})}</div> <h3 class="font-semibold text-lg mb-2">${escape(feature.title)}</h3> <p class="text-surface-400 text-sm">${escape(feature.description)}</p> </div>`;
  })}</div></div></section>  <section class="py-20"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid lg:grid-cols-2 gap-12 items-center"><div><h2 class="text-3xl sm:text-4xl font-display font-bold mb-6" data-svelte-h="svelte-n56ghg">36 Primitives Across 4 Categories</h2> <p class="text-surface-400 mb-8" data-svelte-h="svelte-11ez6m1">From basic loops to advanced concurrency patterns. Each primitive is explained,
						demonstrated, and practiced in the language of your choice.</p> <div class="space-y-4">${each(primitiveCategories, (category) => {
    return `<div class="card-hover p-4"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><div class="${"w-10 h-10 rounded-lg bg-" + escape(category.color, true) + "-500/20 flex items-center justify-center"}">${validate_component(Code_2, "Code2").$$render(
      $$result,
      {
        size: 20,
        class: "text-" + category.color + "-400"
      },
      {},
      {}
    )}</div> <span class="font-medium">${escape(category.name)}</span></div> <span class="text-surface-500">${escape(category.count)} primitives</span></div> </div>`;
  })}</div> <a href="/learn" class="btn btn-primary mt-8">Browse All Primitives
						${validate_component(Arrow_right, "ArrowRight").$$render($$result, { size: 18 }, {}, {})}</a></div>  <div class="relative"><div class="code-block text-sm"><div class="flex items-center gap-2 mb-4 pb-4 border-b border-surface-800" data-svelte-h="svelte-k950g2"><div class="w-3 h-3 rounded-full bg-red-500"></div> <div class="w-3 h-3 rounded-full bg-yellow-500"></div> <div class="w-3 h-3 rounded-full bg-green-500"></div> <span class="ml-2 text-surface-500">for-loop.js</span></div> <pre class="text-surface-300"><span class="text-purple-400" data-svelte-h="svelte-17czmvj">// The For Loop Primitive</span>
<span class="text-blue-400" data-svelte-h="svelte-rfijt3">for</span> (<span class="text-orange-400" data-svelte-h="svelte-110kivv">let</span> i = <span class="text-green-400" data-svelte-h="svelte-100hqll">0</span>; i &lt; <span class="text-green-400" data-svelte-h="svelte-1p2v54y">5</span>; i++) ${escape("{")} 
  console.<span class="text-yellow-400" data-svelte-h="svelte-177xj7c">log</span>(<span class="text-green-400">\`Iteration $${escape("{")}i${escape("}")}\`</span>);
${escape("}")}

<span class="text-purple-400" data-svelte-h="svelte-ek8m1z">// Same concept in Python:</span>
<span class="text-blue-400" data-svelte-h="svelte-rfijt3">for</span> i <span class="text-blue-400" data-svelte-h="svelte-1bhx1x9">in</span> <span class="text-yellow-400" data-svelte-h="svelte-1g8p7dd">range</span>(<span class="text-green-400" data-svelte-h="svelte-1p2v54y">5</span>):
    <span class="text-yellow-400" data-svelte-h="svelte-425psb">print</span>(<span class="text-green-400">f&quot;Iteration ${escape("{")}i${escape("}")}&quot;</span>)</pre></div>  <div class="absolute -top-4 -right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg shadow-primary-500/25" data-svelte-h="svelte-130p3rc">Same concept, different syntax</div></div></div></div></section>  <section class="py-20 bg-surface-900/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-16" data-svelte-h="svelte-njt657"><h2 class="text-3xl sm:text-4xl font-display font-bold mb-4">Loved by Developers</h2></div> <div class="grid md:grid-cols-3 gap-6">${each(testimonials, (testimonial, i) => {
    return `<div class="card p-6 animate-slide-up" style="${"animation-delay: " + escape(i * 150, true) + "ms"}"><p class="text-surface-300 mb-4 italic">&quot;${escape(testimonial.quote)}&quot;</p> <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500"></div> <div><div class="font-medium">${escape(testimonial.author)}</div> <div class="text-surface-500 text-sm">${escape(testimonial.role)}</div> </div></div> </div>`;
  })}</div></div></section>  <section class="py-20"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 class="text-3xl sm:text-4xl font-display font-bold mb-6" data-svelte-h="svelte-cpo88a">Ready to Master the Fundamentals?</h2> <p class="text-surface-400 text-lg mb-8" data-svelte-h="svelte-1ej1nhd">Join thousands of developers who are building a rock-solid foundation. Start free, upgrade
				when you&#39;re ready.</p> <a href="/register" class="btn btn-primary text-lg px-8 py-3">Get Started — It&#39;s Free
				${validate_component(Arrow_right, "ArrowRight").$$render($$result, { size: 20 }, {}, {})}</a></div></section></div>`;
});
export {
  Page as default
};
