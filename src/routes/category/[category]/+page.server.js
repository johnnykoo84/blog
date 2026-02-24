import { fetchDbPosts } from '$lib/server/fetchDbPosts.js';

export const load = async ({ params }) => {
	const category = params.category;

	let dbPosts = [];
	try {
		dbPosts = await fetchDbPosts();
	} catch {
		// DB not available
	}

	const posts = dbPosts.filter(
		(p) => p.categories && p.categories.includes(category)
	);

	return {
		posts,
		category,
		page: 1,
		total: posts.length
	};
};
