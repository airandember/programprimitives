

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.Ds3w_cZC.js","_app/immutable/chunks/9MihJ8ZX.js","_app/immutable/chunks/DOFYReD7.js","_app/immutable/chunks/D-dO8rDY.js","_app/immutable/chunks/r1de6Q5s.js","_app/immutable/chunks/Bqvrdh-z.js","_app/immutable/chunks/BxziceAP.js","_app/immutable/chunks/B1EAyWdy.js","_app/immutable/chunks/cFPGOxgD.js","_app/immutable/chunks/Bir50Ljh.js","_app/immutable/chunks/CPA3_pTO.js","_app/immutable/chunks/DwcysBda.js","_app/immutable/chunks/Bymhn9Fx.js","_app/immutable/chunks/BWp6TQbu.js"];
export const stylesheets = ["_app/immutable/assets/0.DB6W9kyW.css"];
export const fonts = [];
