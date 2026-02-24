import { redirect } from '@sveltejs/kit';
import { postsPerPage } from '$lib/config';
import { fetchDbPosts } from '$lib/server/fetchDbPosts.js';

export const prerender = false;

export const load = async ({ params }) => {
	const page = parseInt(params.page) || 1;
	const { category } = params;

	if (page <= 1) {
		redirect(301, `/category/${category}`);
	}

	let dbPosts = [];
	try {
		dbPosts = await fetchDbPosts();
	} catch {
		// DB not available
	}

	const filtered = dbPosts.filter(
		(p) => p.categories && p.categories.includes(category)
	);

	const offset = (page - 1) * postsPerPage;
	const posts = filtered.slice(offset, offset + postsPerPage);

	return {
		posts,
		page,
		category,
		totalPosts: filtered.length
	};
};
