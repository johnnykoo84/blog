import { redirect } from '@sveltejs/kit';

export const load = async ({ url, params, fetch }) => {
	const page = parseInt(params.page) || 1;

	// Keeps from duplicating the blog index route as page 1
	if (page <= 1) {
		redirect(301, '/');
	}

	const [postRes, totalRes] = await Promise.all([
		fetch(`${url.origin}/api/posts.json?page=${page}`),
		fetch(`${url.origin}/api/posts/count`)
	]);

	const posts = await postRes.json();
	const total = await totalRes.json();

	return {
		posts,
		page,
		totalPosts: total
	};
};
