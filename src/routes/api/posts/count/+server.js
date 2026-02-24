import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';

export const GET = async () => {
	try {
		const rows = await sql`SELECT COUNT(*)::int AS count FROM posts WHERE published = true`;
		return json(rows[0].count);
	} catch {
		return json(0);
	}
};
