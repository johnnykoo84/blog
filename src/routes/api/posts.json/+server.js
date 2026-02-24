import { postsPerPage } from '$lib/config';
import { fetchDbPosts } from '$lib/server/fetchDbPosts.js';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page')) || 1;
	const offset = (page - 1) * postsPerPage;

	let posts = [];
	try {
		posts = await fetchDbPosts();
	} catch {
		// DB not available
	}

	return json(posts.slice(offset, offset + postsPerPage));
};
