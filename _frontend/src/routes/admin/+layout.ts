// Disable server-side rendering for admin pages
// This ensures client-side routing works correctly
export const ssr = false;

// Don't prerender admin pages (they require auth)
export const prerender = false;
