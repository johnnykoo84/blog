import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';

export const prerender = false;

// GET /api/reactions/[postId] - Get likes and dislikes
export async function GET({ params }) {
	const { postId } = params;

	try {
		const rows = await sql`
			SELECT likes, dislikes FROM post_reactions WHERE post_id = ${postId}
		`;
		if (rows.length > 0) {
			return json({ likes: rows[0].likes, dislikes: rows[0].dislikes });
		}
		return json({ likes: 0, dislikes: 0 });
	} catch (error) {
		console.error('Error fetching reactions:', error);
		return json({ likes: 0, dislikes: 0 });
	}
}

// POST /api/reactions/[postId] - Add/remove/switch reaction
// Body: { action: "like" | "dislike", previous: "none" | "like" | "dislike" }
export async function POST({ params, request }) {
	const { postId } = params;

	try {
		const { action, previous } = await request.json();

		if (!['like', 'dislike'].includes(action)) {
			return json({ error: 'Invalid action' }, { status: 400 });
		}
		if (!['none', 'like', 'dislike'].includes(previous)) {
			return json({ error: 'Invalid previous state' }, { status: 400 });
		}

		// Ensure row exists
		await sql`
			INSERT INTO post_reactions (post_id, likes, dislikes)
			VALUES (${postId}, 0, 0)
			ON CONFLICT (post_id) DO NOTHING
		`;

		if (action === previous) {
			// Toggle off: remove existing reaction
			if (action === 'like') {
				await sql`
					UPDATE post_reactions SET likes = GREATEST(likes - 1, 0) WHERE post_id = ${postId}
				`;
			} else {
				await sql`
					UPDATE post_reactions SET dislikes = GREATEST(dislikes - 1, 0) WHERE post_id = ${postId}
				`;
			}
		} else if (previous === 'none') {
			// New reaction
			if (action === 'like') {
				await sql`
					UPDATE post_reactions SET likes = likes + 1 WHERE post_id = ${postId}
				`;
			} else {
				await sql`
					UPDATE post_reactions SET dislikes = dislikes + 1 WHERE post_id = ${postId}
				`;
			}
		} else {
			// Switch: remove old, add new
			if (action === 'like') {
				await sql`
					UPDATE post_reactions
					SET likes = likes + 1, dislikes = GREATEST(dislikes - 1, 0)
					WHERE post_id = ${postId}
				`;
			} else {
				await sql`
					UPDATE post_reactions
					SET dislikes = dislikes + 1, likes = GREATEST(likes - 1, 0)
					WHERE post_id = ${postId}
				`;
			}
		}

		// Return updated counts
		const rows = await sql`
			SELECT likes, dislikes FROM post_reactions WHERE post_id = ${postId}
		`;
		return json({ likes: rows[0].likes, dislikes: rows[0].dislikes });
	} catch (error) {
		console.error('Error updating reaction:', error);
		return json({ error: 'Failed to update reaction' }, { status: 500 });
	}
}
