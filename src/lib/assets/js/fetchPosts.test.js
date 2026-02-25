import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock $lib/config
vi.mock('$lib/config', () => ({
	postsPerPage: 2
}));

// We can't directly test fetchPosts because it uses import.meta.glob,
// so we extract and test the core filtering/sorting/pagination logic.

describe('fetchPosts logic', () => {
	const makePosts = () => [
		{
			title: 'Post A',
			slug: 'post-a',
			date: '2024-01-01',
			categories: ['tech'],
			excerpt: 'A',
			published: true
		},
		{
			title: 'Post B',
			slug: 'post-b',
			date: '2024-06-15',
			categories: ['life'],
			excerpt: 'B',
			published: true
		},
		{
			title: 'Draft',
			slug: 'draft',
			date: '2024-03-01',
			categories: ['tech'],
			excerpt: 'Draft',
			published: false
		},
		{
			title: 'Post C',
			slug: 'post-c',
			date: '2024-12-01',
			categories: ['tech', 'life'],
			excerpt: 'C',
			published: true
		},
		{
			title: 'No Category',
			slug: 'no-cat',
			date: '2024-02-01',
			categories: null,
			excerpt: 'No cat',
			published: true
		}
	];

	// Replicate the core logic from fetchPosts
	function filterSortPaginate(posts, { offset = 0, limit = 2, category = '' } = {}) {
		let sorted = posts
			.filter((post) => post.published !== false)
			.sort((a, b) => new Date(b.date) - new Date(a.date));

		if (category) {
			sorted = sorted.filter(
				(post) =>
					post.categories &&
					Array.isArray(post.categories) &&
					post.categories.includes(category)
			);
		}

		if (offset) {
			sorted = sorted.slice(offset);
		}

		if (limit && limit < sorted.length && limit != -1) {
			sorted = sorted.slice(0, limit);
		}

		sorted = sorted.map((post) => ({
			title: post.title,
			slug: post.slug,
			excerpt: post.excerpt,
			coverImage: post.coverImage,
			coverWidth: post.coverWidth,
			coverHeight: post.coverHeight,
			date: post.date.toString(),
			categories: post.categories
		}));

		return { posts: sorted };
	}

	it('filters out unpublished posts', () => {
		const result = filterSortPaginate(makePosts(), { limit: -1 });
		const slugs = result.posts.map((p) => p.slug);
		expect(slugs).not.toContain('draft');
	});

	it('sorts posts by date descending', () => {
		const result = filterSortPaginate(makePosts(), { limit: -1 });
		const dates = result.posts.map((p) => new Date(p.date).getTime());
		for (let i = 1; i < dates.length; i++) {
			expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
		}
	});

	it('filters by category', () => {
		const result = filterSortPaginate(makePosts(), { category: 'tech', limit: -1 });
		result.posts.forEach((post) => {
			expect(post.categories).toContain('tech');
		});
	});

	it('excludes posts without matching category', () => {
		const result = filterSortPaginate(makePosts(), { category: 'life', limit: -1 });
		const slugs = result.posts.map((p) => p.slug);
		expect(slugs).not.toContain('post-a'); // only has 'tech'
	});

	it('handles null categories gracefully', () => {
		const result = filterSortPaginate(makePosts(), { category: 'tech', limit: -1 });
		const slugs = result.posts.map((p) => p.slug);
		expect(slugs).not.toContain('no-cat');
	});

	it('applies offset', () => {
		const all = filterSortPaginate(makePosts(), { limit: -1 });
		const offsetResult = filterSortPaginate(makePosts(), { offset: 1, limit: -1 });
		expect(offsetResult.posts.length).toBe(all.posts.length - 1);
		expect(offsetResult.posts[0].slug).toBe(all.posts[1].slug);
	});

	it('applies limit', () => {
		const result = filterSortPaginate(makePosts(), { limit: 2 });
		expect(result.posts.length).toBe(2);
	});

	it('limit -1 returns all posts', () => {
		const result = filterSortPaginate(makePosts(), { limit: -1 });
		// 5 posts minus 1 draft = 4 published
		expect(result.posts.length).toBe(4);
	});

	it('applies offset and limit together', () => {
		const result = filterSortPaginate(makePosts(), { offset: 1, limit: 2 });
		expect(result.posts.length).toBe(2);
	});

	it('returns correct post shape', () => {
		const result = filterSortPaginate(makePosts(), { limit: 1 });
		const post = result.posts[0];
		expect(post).toHaveProperty('title');
		expect(post).toHaveProperty('slug');
		expect(post).toHaveProperty('excerpt');
		expect(post).toHaveProperty('date');
		expect(post).toHaveProperty('categories');
	});

	it('converts date to string', () => {
		const result = filterSortPaginate(makePosts(), { limit: 1 });
		expect(typeof result.posts[0].date).toBe('string');
	});
});
