import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';

export const prerender = false;

// GET /api/views/[postId] - Get view count
export async function GET({ params }) {
	const { postId } = params;

	try {
		const rows = await sql`
			SELECT view_count FROM post_views WHERE post_id = ${postId}
		`;
		const viewCount = rows.length > 0 ? rows[0].view_count : 0;
		return json({ viewCount });
	} catch (error) {
		console.error('Error fetching view count:', error);
		return json({ viewCount: 0 });
	}
}

// POST /api/views/[postId] - Increment view count with IP dedup (30min window)
export async function POST({ params, getClientAddress, request }) {
	const { postId } = params;

	try {
		const ipAddress = getClientAddress();
		const userAgent = request.headers.get('user-agent');

		// Check if this IP viewed this post in the last 30 minutes
		const recentView = await sql`
			SELECT id FROM post_view_logs
			WHERE post_id = ${postId}
				AND ip_address = ${ipAddress}
				AND viewed_at > NOW() - INTERVAL '30 minutes'
			LIMIT 1
		`;

		if (recentView.length > 0) {
			// Already viewed recently, just return current count
			const rows = await sql`
				SELECT view_count FROM post_views WHERE post_id = ${postId}
			`;
			return json({ viewCount: rows.length > 0 ? rows[0].view_count : 0, deduplicated: true });
		}

		// Log this view
		await sql`
			INSERT INTO post_view_logs (post_id, ip_address, user_agent)
			VALUES (${postId}, ${ipAddress}, ${userAgent})
		`;

		// Increment view count (upsert)
		const rows = await sql`
			INSERT INTO post_views (post_id, view_count)
			VALUES (${postId}, 1)
			ON CONFLICT (post_id)
			DO UPDATE SET view_count = post_views.view_count + 1
			RETURNING view_count
		`;

		return json({ viewCount: rows[0].view_count });
	} catch (error) {
		console.error('Error recording view:', error);
		return json({ viewCount: 0, error: 'Failed to record view' }, { status: 500 });
	}
}
