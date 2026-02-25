import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$lib/server/db.js', () => ({
	sql: vi.fn()
}));

import { GET, POST } from './[postId]/+server.js';
import { sql } from '$lib/server/db.js';

function makeGetRequest(postId) {
	return { params: { postId } };
}

function makePostRequest(postId, body) {
	return {
		params: { postId },
		request: { json: () => Promise.resolve(body) }
	};
}

describe('GET /api/reactions/[postId]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('returns reactions when they exist', async () => {
		sql.mockResolvedValueOnce([{ likes: 5, dislikes: 2 }]);

		const response = await GET(makeGetRequest('post-1'));
		const data = await response.json();

		expect(data).toEqual({ likes: 5, dislikes: 2 });
	});

	it('returns zeros when no reactions exist', async () => {
		sql.mockResolvedValueOnce([]);

		const response = await GET(makeGetRequest('post-1'));
		const data = await response.json();

		expect(data).toEqual({ likes: 0, dislikes: 0 });
	});

	it('returns zeros on database error', async () => {
		sql.mockRejectedValueOnce(new Error('DB error'));

		const response = await GET(makeGetRequest('post-1'));
		const data = await response.json();

		expect(data).toEqual({ likes: 0, dislikes: 0 });
	});
});

describe('POST /api/reactions/[postId]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('rejects invalid action', async () => {
		const req = makePostRequest('post-1', { action: 'love', previous: 'none' });
		const response = await POST(req);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toContain('Invalid action');
	});

	it('rejects invalid previous state', async () => {
		const req = makePostRequest('post-1', { action: 'like', previous: 'invalid' });
		const response = await POST(req);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toContain('Invalid previous');
	});

	it('handles new like (previous=none, action=like)', async () => {
		// Upsert row, then increment likes, then return updated counts
		sql.mockResolvedValueOnce([]); // upsert
		sql.mockResolvedValueOnce([]); // update likes
		sql.mockResolvedValueOnce([{ likes: 1, dislikes: 0 }]); // return counts

		const req = makePostRequest('post-1', { action: 'like', previous: 'none' });
		const response = await POST(req);
		const data = await response.json();

		expect(data).toEqual({ likes: 1, dislikes: 0 });
	});

	it('handles new dislike (previous=none, action=dislike)', async () => {
		sql.mockResolvedValueOnce([]); // upsert
		sql.mockResolvedValueOnce([]); // update dislikes
		sql.mockResolvedValueOnce([{ likes: 0, dislikes: 1 }]); // return counts

		const req = makePostRequest('post-1', { action: 'dislike', previous: 'none' });
		const response = await POST(req);
		const data = await response.json();

		expect(data).toEqual({ likes: 0, dislikes: 1 });
	});

	it('handles toggle off like (previous=like, action=like)', async () => {
		sql.mockResolvedValueOnce([]); // upsert
		sql.mockResolvedValueOnce([]); // decrement likes
		sql.mockResolvedValueOnce([{ likes: 0, dislikes: 0 }]); // return counts

		const req = makePostRequest('post-1', { action: 'like', previous: 'like' });
		const response = await POST(req);
		const data = await response.json();

		expect(data).toEqual({ likes: 0, dislikes: 0 });
	});

	it('handles switch from like to dislike', async () => {
		sql.mockResolvedValueOnce([]); // upsert
		sql.mockResolvedValueOnce([]); // switch: +dislike, -like
		sql.mockResolvedValueOnce([{ likes: 0, dislikes: 1 }]); // return counts

		const req = makePostRequest('post-1', { action: 'dislike', previous: 'like' });
		const response = await POST(req);
		const data = await response.json();

		expect(data).toEqual({ likes: 0, dislikes: 1 });
	});

	it('handles switch from dislike to like', async () => {
		sql.mockResolvedValueOnce([]); // upsert
		sql.mockResolvedValueOnce([]); // switch: +like, -dislike
		sql.mockResolvedValueOnce([{ likes: 1, dislikes: 0 }]); // return counts

		const req = makePostRequest('post-1', { action: 'like', previous: 'dislike' });
		const response = await POST(req);
		const data = await response.json();

		expect(data).toEqual({ likes: 1, dislikes: 0 });
	});

	it('returns 500 on database error', async () => {
		sql.mockRejectedValueOnce(new Error('DB error'));

		const req = makePostRequest('post-1', { action: 'like', previous: 'none' });
		const response = await POST(req);

		expect(response.status).toBe(500);
	});
});
