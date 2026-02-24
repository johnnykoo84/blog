import { redirect } from '@sveltejs/kit';
import { postsPerPage } from '$lib/config';
import { fetchDbPosts } from '$lib/server/fetchDbPosts.js';

export const load = async ({ params }) => {
	const page = parseInt(params.page) || 1;

	if (page <= 1) {
		redirect(301, '/');
	}

	let dbPosts = [];
	try {
		dbPosts = await fetchDbPosts();
	} catch {
		// DB not available
	}

	const offset = (page - 1) * postsPerPage;
	const posts = dbPosts.slice(offset, offset + postsPerPage);

	return {
		posts,
		page,
		totalPosts: dbPosts.length
	};
};
