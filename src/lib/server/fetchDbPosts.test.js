import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module
vi.mock('$lib/server/db.js', () => ({
	sql: vi.fn()
}));

import { fetchDbPosts } from './fetchDbPosts.js';
import { sql } from '$lib/server/db.js';

describe('fetchDbPosts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const mockRows = [
		{
			slug: 'first-post',
			title: 'First Post',
			excerpt: 'My first post',
			categories: '["tech","life"]',
			created_at: '2024-06-15T10:00:00Z',
			published: true
		},
		{
			slug: 'second-post',
			title: 'Second Post',
			excerpt: null,
			categories: null,
			created_at: '2024-01-01T00:00:00Z',
			published: true
		}
	];

	it('fetches published posts by default', async () => {
		sql.mockResolvedValueOnce(mockRows);

		const posts = await fetchDbPosts();

		expect(posts).toHaveLength(2);
		// Verify the SQL was called (it's a tagged template, so the mock is called directly)
		expect(sql).toHaveBeenCalled();
	});

	it('transforms rows correctly', async () => {
		sql.mockResolvedValueOnce([mockRows[0]]);

		const posts = await fetchDbPosts();
		const post = posts[0];

		expect(post.title).toBe('First Post');
		expect(post.slug).toBe('first-post');
		expect(post.excerpt).toBe('My first post');
		expect(post.categories).toEqual(['tech', 'life']);
		expect(post.date).toBe('2024-06-15');
		expect(post.source).toBe('db');
		expect(post.published).toBe(true);
	});

	it('handles null excerpt as empty string', async () => {
		sql.mockResolvedValueOnce([mockRows[1]]);

		const posts = await fetchDbPosts();
		expect(posts[0].excerpt).toBe('');
	});

	it('handles null categories as empty array', async () => {
		sql.mockResolvedValueOnce([mockRows[1]]);

		const posts = await fetchDbPosts();
		expect(posts[0].categories).toEqual([]);
	});

	it('returns ISO date format (YYYY-MM-DD)', async () => {
		sql.mockResolvedValueOnce([mockRows[0]]);

		const posts = await fetchDbPosts();
		expect(posts[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('handles empty result set', async () => {
		sql.mockResolvedValueOnce([]);

		const posts = await fetchDbPosts();
		expect(posts).toEqual([]);
	});

	it('passes includeUnpublished option', async () => {
		sql.mockResolvedValueOnce(mockRows);

		await fetchDbPosts({ includeUnpublished: true });
		// The function should call sql - we verify it was called
		expect(sql).toHaveBeenCalled();
	});
});
