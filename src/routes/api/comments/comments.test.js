import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module
vi.mock('$lib/server/db.js', () => ({
	sql: vi.fn()
}));

import { GET, POST } from './[postId]/+server.js';
import { sql } from '$lib/server/db.js';

function makeParams(postId) {
	return { params: { postId } };
}

function makePostRequest(postId, body, { ip = '127.0.0.1', userAgent = 'test-agent' } = {}) {
	return {
		params: { postId },
		request: {
			json: () => Promise.resolve(body),
			headers: { get: (name) => (name === 'user-agent' ? userAgent : null) }
		},
		getClientAddress: () => ip
	};
}

describe('GET /api/comments/[postId]', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns comments for a post', async () => {
		const mockComments = [
			{ id: 1, post_id: 'post-1', author_name: 'Alice', content: 'Great!', created_at: '2024-01-01' }
		];
		sql.mockResolvedValueOnce(mockComments);

		const response = await GET(makeParams('post-1'));
		const data = await response.json();

		expect(data.comments).toEqual(mockComments);
	});

	it('returns empty array when no comments', async () => {
		sql.mockResolvedValueOnce([]);

		const response = await GET(makeParams('post-1'));
		const data = await response.json();

		expect(data.comments).toEqual([]);
	});

	it('returns 500 on database error', async () => {
		sql.mockRejectedValueOnce(new Error('DB error'));

		const response = await GET(makeParams('post-1'));

		expect(response.status).toBe(500);
		const data = await response.json();
		expect(data.error).toBeDefined();
	});
});

describe('POST /api/comments/[postId]', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates a comment successfully', async () => {
		const created = {
			id: 1,
			post_id: 'post-1',
			author_name: 'Bob',
			content: 'Nice post!',
			created_at: '2024-01-01'
		};
		sql.mockResolvedValueOnce([created]);

		const req = makePostRequest('post-1', {
			author_name: 'Bob',
			content: 'Nice post!'
		});
		const response = await POST(req);

		expect(response.status).toBe(201);
		const data = await response.json();
		expect(data.comment).toEqual(created);
	});

	it('rejects missing author_name', async () => {
		const req = makePostRequest('post-1', { content: 'No name' });
		const response = await POST(req);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toContain('required');
	});

	it('rejects missing content', async () => {
		const req = makePostRequest('post-1', { author_name: 'Bob' });
		const response = await POST(req);

		expect(response.status).toBe(400);
	});

	it('rejects name longer than 100 characters', async () => {
		const req = makePostRequest('post-1', {
			author_name: 'A'.repeat(101),
			content: 'Hello'
		});
		const response = await POST(req);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toContain('too long');
	});

	it('rejects content longer than 5000 characters', async () => {
		const req = makePostRequest('post-1', {
			author_name: 'Bob',
			content: 'A'.repeat(5001)
		});
		const response = await POST(req);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toContain('too long');
	});

	it('rejects invalid email', async () => {
		const req = makePostRequest('post-1', {
			author_name: 'Bob',
			content: 'Hello',
			author_email: 'not-an-email'
		});
		const response = await POST(req);

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.error).toContain('email');
	});

	it('accepts valid email', async () => {
		sql.mockResolvedValueOnce([{ id: 1 }]);

		const req = makePostRequest('post-1', {
			author_name: 'Bob',
			content: 'Hello',
			author_email: 'bob@example.com'
		});
		const response = await POST(req);

		expect(response.status).toBe(201);
	});

	it('accepts comment without email', async () => {
		sql.mockResolvedValueOnce([{ id: 1 }]);

		const req = makePostRequest('post-1', {
			author_name: 'Bob',
			content: 'Hello'
		});
		const response = await POST(req);

		expect(response.status).toBe(201);
	});

	it('returns 500 on database error', async () => {
		sql.mockRejectedValueOnce(new Error('DB error'));

		const req = makePostRequest('post-1', {
			author_name: 'Bob',
			content: 'Hello'
		});
		const response = await POST(req);

		expect(response.status).toBe(500);
	});
});
