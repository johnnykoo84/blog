import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$lib/server/db.js', () => ({
	sql: vi.fn()
}));

import { GET, POST } from './[postId]/+server.js';
import { sql } from '$lib/server/db.js';

function makeGetRequest(postId) {
	return { params: { postId } };
}

function makePostRequest(postId, { ip = '127.0.0.1', userAgent = 'test-agent' } = {}) {
	return {
		params: { postId },
		getClientAddress: () => ip,
		request: {
			headers: { get: (name) => (name === 'user-agent' ? userAgent : null) }
		}
	};
}

describe('GET /api/views/[postId]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('returns view count when it exists', async () => {
		sql.mockResolvedValueOnce([{ view_count: 42 }]);

		const response = await GET(makeGetRequest('post-1'));
		const data = await response.json();

		expect(data).toEqual({ viewCount: 42 });
	});

	it('returns 0 when no views recorded', async () => {
		sql.mockResolvedValueOnce([]);

		const response = await GET(makeGetRequest('post-1'));
		const data = await response.json();

		expect(data).toEqual({ viewCount: 0 });
	});

	it('returns 0 on database error', async () => {
		sql.mockRejectedValueOnce(new Error('DB error'));

		const response = await GET(makeGetRequest('post-1'));
		const data = await response.json();

		expect(data).toEqual({ viewCount: 0 });
	});
});

describe('POST /api/views/[postId]', () => {
	beforeEach(() => vi.clearAllMocks());

	it('increments view count for new visitor', async () => {
		sql.mockResolvedValueOnce([]); // no recent view
		sql.mockResolvedValueOnce([]); // insert view log
		sql.mockResolvedValueOnce([{ view_count: 1 }]); // upsert + return

		const response = await POST(makePostRequest('post-1'));
		const data = await response.json();

		expect(data.viewCount).toBe(1);
		expect(data.deduplicated).toBeUndefined();
	});

	it('deduplicates within 30-minute window', async () => {
		sql.mockResolvedValueOnce([{ id: 1 }]); // recent view exists
		sql.mockResolvedValueOnce([{ view_count: 5 }]); // current count

		const response = await POST(makePostRequest('post-1'));
		const data = await response.json();

		expect(data.deduplicated).toBe(true);
		expect(data.viewCount).toBe(5);
	});

	it('returns 0 view count when deduplicated and no views row', async () => {
		sql.mockResolvedValueOnce([{ id: 1 }]); // recent view exists
		sql.mockResolvedValueOnce([]); // no views row yet

		const response = await POST(makePostRequest('post-1'));
		const data = await response.json();

		expect(data.deduplicated).toBe(true);
		expect(data.viewCount).toBe(0);
	});

	it('returns 500 on database error', async () => {
		sql.mockRejectedValueOnce(new Error('DB error'));

		const response = await POST(makePostRequest('post-1'));

		expect(response.status).toBe(500);
		const data = await response.json();
		expect(data.viewCount).toBe(0);
	});

	it('handles different IPs as separate visitors', async () => {
		// First visitor
		sql.mockResolvedValueOnce([]); // no recent view
		sql.mockResolvedValueOnce([]); // insert log
		sql.mockResolvedValueOnce([{ view_count: 1 }]); // upsert

		const response1 = await POST(makePostRequest('post-1', { ip: '1.1.1.1' }));
		const data1 = await response1.json();
		expect(data1.viewCount).toBe(1);

		// Second visitor
		sql.mockResolvedValueOnce([]); // no recent view for this IP
		sql.mockResolvedValueOnce([]); // insert log
		sql.mockResolvedValueOnce([{ view_count: 2 }]); // upsert

		const response2 = await POST(makePostRequest('post-1', { ip: '2.2.2.2' }));
		const data2 = await response2.json();
		expect(data2.viewCount).toBe(2);
	});
});
