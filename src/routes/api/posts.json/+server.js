import { postsPerPage } from '$lib/config';
import fetchPosts from '$lib/assets/js/fetchPosts';
import { fetchDbPosts } from '$lib/server/fetchDbPosts.js';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page')) || 1;
	const offset = (page - 1) * postsPerPage;

	const { posts: mdPosts } = await fetchPosts({ limit: -1 });

	let dbPosts = [];
	try {
		dbPosts = await fetchDbPosts();
	} catch {
		// DB not available, continue with md posts only
	}

	// Merge and deduplicate (DB posts take priority by slug)
	const dbSlugs = new Set(dbPosts.map((p) => p.slug));
	const merged = [...dbPosts, ...mdPosts.filter((p) => !dbSlugs.has(p.slug))]
		.filter((p) => p.published !== false)
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	return json(merged.slice(offset, offset + postsPerPage));
};
