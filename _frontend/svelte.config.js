import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Static site generation for Fly.io
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // SPA fallback - Go server handles routing
			precompress: true,
			strict: false // Allow missing prerender routes
		}),
		alias: {
			$components: 'src/lib/components',
			$stores: 'src/lib/stores',
			$utils: 'src/lib/utils',
			$types: 'src/lib/types',
			'@braids': '../braids'
		},
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			// Don't fail on dynamic routes - they'll be handled client-side
			handleUnseenRoutes: 'ignore'
		}
	}
};

export default config;
