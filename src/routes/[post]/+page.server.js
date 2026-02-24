import { error } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';
import { marked } from 'marked';

export async function load({ params, locals }) {
	const isAdmin = locals.isAdmin;

	const rows = await sql`
		SELECT * FROM posts WHERE slug = ${params.post}
	`;
	const post = rows[0];

	if (!post) {
		throw error(404, 'Post not found');
	}

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
