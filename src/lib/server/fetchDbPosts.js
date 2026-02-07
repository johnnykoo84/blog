import { sql } from '$lib/server/db.js';

export async function fetchDbPosts() {
	const rows = await sql`
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
		source: 'db'
	}));
}
