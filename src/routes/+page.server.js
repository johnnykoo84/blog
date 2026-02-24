import { postsPerPage } from '$lib/config';
import { fetchDbPosts } from '$lib/server/fetchDbPosts.js';

export const load = async () => {
	let dbPosts = [];
	try {
		dbPosts = await fetchDbPosts();
	} catch {
		// DB not available
	}

	const posts = dbPosts.slice(0, postsPerPage);
	const total = dbPosts.length;

	return { posts, total };
};
