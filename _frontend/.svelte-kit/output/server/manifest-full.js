export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg","LOGO_dark.png","LOGO_dark.webp","LOGO_light.png","LOGO_light.webp"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".webp":"image/webp"},
	_: {
		client: {start:"_app/immutable/entry/start.D0fAPENE.js",app:"_app/immutable/entry/app.CYW_Gj_3.js",imports:["_app/immutable/entry/start.D0fAPENE.js","_app/immutable/chunks/Bqvrdh-z.js","_app/immutable/chunks/9MihJ8ZX.js","_app/immutable/chunks/BxziceAP.js","_app/immutable/entry/app.CYW_Gj_3.js","_app/immutable/chunks/9MihJ8ZX.js","_app/immutable/chunks/DOFYReD7.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/achievements",
				pattern: /^\/achievements\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/learn",
				pattern: /^\/learn\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/learn/[primitive]",
				pattern: /^\/learn\/([^/]+?)\/?$/,
				params: [{"name":"primitive","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/practice",
				pattern: /^\/practice\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/practice/[primitive]/[exercise]",
				pattern: /^\/practice\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"primitive","optional":false,"rest":false,"chained":false},{"name":"exercise","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
