import { sql } from '$lib/server/db.js';

export async function fetchDbPosts({ includeUnpublished = false } = {}) {
	const rows = includeUnpublished
		? await sql`
			SELECT slug, title, excerpt, categories, created_at, published
			FROM posts
			ORDER BY created_at DESC
		`
		: await sql`
			SELECT slug, title, excerpt, categories, created_at, published
			FROM posts
			WHERE published = true
			ORDER BY created_at DESC
		`;

	return rows.map((row) => ({
		title: row.title,
		slug: row.slug,
		excerpt: row.excerpt || '',
		date: new Date(row.created_at).toISOString().split('T')[0],
		categories: JSON.parse(row.categories || '[]'),
		published: row.published,
		source: 'db'
	}));
}
