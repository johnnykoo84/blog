import { error } from '@sveltejs/kit';

export const load = async ({ params, data }) => {
	// If the server already found a DB post, pass it through
	if (data.source === 'db') {
		return data;
	}

	// Otherwise, try loading from .md file
	try {
		const post = await import(`../../lib/posts/${params.post}.md`);

		if (post.metadata.published === false && !data.isAdmin) {
			error(404, 'Post not found');
		}

		return {
			source: 'md',
			isAdmin: data.isAdmin,
			isDraft: post.metadata.published === false,
			PostContent: post.default,
			meta: { ...post.metadata, slug: params.post }
		};
	} catch (err) {
		error(404, err);
	}
};
