import { error } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';
import { marked } from 'marked';

export async function load({ params, locals }) {
	const isAdmin = locals.isAdmin;

	// Try DB first
	try {
		const rows = await sql`
			SELECT * FROM posts WHERE slug = ${params.post}
		`;
		const post = rows[0];

		if (post) {
			if (!post.published && !isAdmin) {
				throw error(404, 'Post not found');
			}

			return {
				source: 'db',
				isAdmin,
				isDraft: !post.published,
				htmlContent: marked(post.content),
				meta: {
					title: post.title,
					slug: post.slug,
					excerpt: post.excerpt || '',
					date: post.created_at,
					categories: JSON.parse(post.categories || '[]')
				}
			};
		}
	} catch (err) {
		// Re-throw SvelteKit errors (like our 404)
		if (err?.status) throw err;
		// DB not available, fall through to .md
	}

	// No DB post found — let +page.js handle .md file
	return { source: 'md', isAdmin };
}
