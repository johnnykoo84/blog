import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';

export const GET = async () => {
	const mdPosts = import.meta.glob(`$lib/posts/*.md`);
	const mdCount = Object.keys(mdPosts).length;

	let dbCount = 0;
	try {
		const rows = await sql`SELECT COUNT(*) as count FROM posts WHERE published = true`;
		dbCount = parseInt(rows[0].count, 10);
	} catch {
		// DB not available (e.g. during prerender)
	}

	return json(mdCount + dbCount);
};
