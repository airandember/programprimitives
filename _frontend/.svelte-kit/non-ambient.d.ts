
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/achievements" | "/dashboard" | "/learn" | "/learn/[primitive]" | "/practice" | "/practice/[primitive]" | "/practice/[primitive]/[exercise]";
		RouteParams(): {
			"/learn/[primitive]": { primitive: string };
			"/practice/[primitive]": { primitive: string };
			"/practice/[primitive]/[exercise]": { primitive: string; exercise: string }
		};
		LayoutParams(): {
			"/": { primitive?: string; exercise?: string };
			"/achievements": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/learn": { primitive?: string };
			"/learn/[primitive]": { primitive: string };
			"/practice": { primitive?: string; exercise?: string };
			"/practice/[primitive]": { primitive: string; exercise?: string };
			"/practice/[primitive]/[exercise]": { primitive: string; exercise: string }
		};
		Pathname(): "/" | "/achievements" | "/achievements/" | "/dashboard" | "/dashboard/" | "/learn" | "/learn/" | `/learn/${string}` & {} | `/learn/${string}/` & {} | "/practice" | "/practice/" | `/practice/${string}` & {} | `/practice/${string}/` & {} | `/practice/${string}/${string}` & {} | `/practice/${string}/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | "/LOGO_dark.png" | "/LOGO_dark.webp" | "/LOGO_light.png" | "/LOGO_light.webp" | string & {};
	}
}