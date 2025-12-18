import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@braids': path.resolve(__dirname, '../braids'),
		},
		// Ensure braids folder can find node_modules
		dedupe: ['svelte', 'zod'],
	},
	server: {
		port: 5173,
		strictPort: false,
		fs: {
			// Allow serving files from braids folder
			allow: ['..'],
		},
	},
});

