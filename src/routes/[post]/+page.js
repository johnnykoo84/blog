import { error } from '@sveltejs/kit';

export const load = async ({ params, data }) => {
	// If the server already found a DB post, pass it through
	if (data.source === 'db') {
		return data;
	}

	// Otherwise, try loading from .md file
	try {
		const post = await import(`../../lib/posts/${params.post}.md`);

		return {
			source: 'md',
			PostContent: post.default,
			meta: { ...post.metadata, slug: params.post }
		};
	} catch (err) {
		error(404, err);
	}
};
