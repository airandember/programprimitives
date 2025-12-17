import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@braids': path.resolve(__dirname, '../braids'),
			// Ensure packages resolve from frontend's node_modules when imported from braids
			'zod': path.resolve(__dirname, 'node_modules/zod'),
			'svelte': path.resolve(__dirname, 'node_modules/svelte'),
			'svelte/store': path.resolve(__dirname, 'node_modules/svelte/store'),
			'svelte/transition': path.resolve(__dirname, 'node_modules/svelte/transition'),
		}
	},
	server: {
		port: 5173,
		strictPort: false
	}
});

