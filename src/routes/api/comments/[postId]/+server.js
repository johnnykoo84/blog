import { json } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';

// GET /api/comments/[postId] - Get all comments for a post
export async function GET({ params }) {
	const { postId } = params;

	try {
		console.log('Fetching comments for postId:', postId);
		const comments = await sql`
			SELECT id, post_id, author_name, content, created_at
			FROM comments
			WHERE post_id = ${postId}
			ORDER BY created_at ASC
		`;

		console.log('Found comments:', comments.length);
		return json({ comments });
	} catch (error) {
		console.error('Error fetching comments:', error);
		console.error('Error details:', error.message);
		return json({ error: 'Failed to fetch comments', details: error.message }, { status: 500 });
	}
}

// POST /api/comments/[postId] - Create a new comment
export async function POST({ params, request, getClientAddress }) {
	const { postId } = params;

	try {
		const { author_name, author_email, content } = await request.json();

		// Basic validation
		if (!author_name || !content) {
			return json({ error: 'Name and comment are required' }, { status: 400 });
		}

		if (author_name.length > 100) {
			return json({ error: 'Name is too long (max 100 characters)' }, { status: 400 });
		}

		if (content.length > 5000) {
			return json({ error: 'Comment is too long (max 5000 characters)' }, { status: 400 });
		}

		// Email validation (optional field)
		if (author_email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(author_email)) {
				return json({ error: 'Invalid email address' }, { status: 400 });
			}
		}

		// Get client info for spam protection
		const ipAddress = getClientAddress();
		const userAgent = request.headers.get('user-agent');

		// Insert comment
		const result = await sql`
			INSERT INTO comments (post_id, author_name, author_email, content, ip_address, user_agent)
			VALUES (${postId}, ${author_name}, ${author_email || null}, ${content}, ${ipAddress}, ${userAgent})
			RETURNING id, post_id, author_name, content, created_at
		`;

		return json({ comment: result[0] }, { status: 201 });
	} catch (error) {
		console.error('Error creating comment:', error);
		return json({ error: 'Failed to create comment' }, { status: 500 });
	}
}
