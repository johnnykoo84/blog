import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';

export const GET = async () => {
	const mdPosts = import.meta.glob(`$lib/posts/*.md`);
	const mdSlugs = Object.keys(mdPosts).map((path) => path.split('/').pop().slice(0, -3));

	let dbSlugs = new Set();
	try {
		const rows = await sql`SELECT slug FROM posts WHERE published = true`;
		dbSlugs = new Set(rows.map((r) => r.slug));
	} catch {
		// DB not available
	}

	// Count: published DB posts + MD posts that don't overlap with DB
	const uniqueMdCount = mdSlugs.filter((s) => !dbSlugs.has(s)).length;
	return json(uniqueMdCount + dbSlugs.size);
};
