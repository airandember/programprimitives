

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.B8R3zxhv.js","_app/immutable/chunks/DkEzLcvr.js","_app/immutable/chunks/DZ5nV7Jh.js","_app/immutable/chunks/_EsgkS-G.js","_app/immutable/chunks/cqVsLGO1.js","_app/immutable/chunks/kIsqTAem.js","_app/immutable/chunks/CYnsottm.js","_app/immutable/chunks/B1EAyWdy.js","_app/immutable/chunks/C7eQp15L.js","_app/immutable/chunks/BLkGpTV1.js","_app/immutable/chunks/CNxXY4nc.js","_app/immutable/chunks/BsXjKJ3D.js","_app/immutable/chunks/D36hTZXp.js","_app/immutable/chunks/B4sgX6Dd.js"];
export const stylesheets = ["_app/immutable/assets/0.CyVhzu3x.css"];
export const fonts = [];
