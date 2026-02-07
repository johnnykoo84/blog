import { postsPerPage } from '$lib/config';
import fetchPosts from '$lib/assets/js/fetchPosts';
import { fetchDbPosts } from '$lib/server/fetchDbPosts.js';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const { posts: mdPosts } = await fetchPosts({ limit: -1 });

	let dbPosts = [];
	try {
		dbPosts = await fetchDbPosts();
	} catch {
		// DB not available (e.g. during prerender), continue with md posts only
	}

	// Merge and deduplicate (DB posts take priority by slug)
	const slugs = new Set(dbPosts.map((p) => p.slug));
	const merged = [...dbPosts, ...mdPosts.filter((p) => !slugs.has(p.slug))];
	merged.sort((a, b) => new Date(b.date) - new Date(a.date));

	return json(merged.slice(0, postsPerPage));
};
