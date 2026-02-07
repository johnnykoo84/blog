import { sql } from '$lib/server/db.js';

export async function load() {
	const posts = await sql`
		SELECT id, slug, title, published, created_at, updated_at
		FROM posts
		ORDER BY created_at DESC
	`;

	return { posts };
}
