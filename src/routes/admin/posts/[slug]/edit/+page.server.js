import { error, fail, redirect } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';

export async function load({ params }) {
	const rows = await sql`SELECT * FROM posts WHERE slug = ${params.slug}`;
	const post = rows[0];

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post: {
			slug: post.slug,
			title: post.title,
			content: post.content,
			excerpt: post.excerpt || '',
			categories: JSON.parse(post.categories || '[]').join(', '),
			published: post.published
		}
	};
}

export const actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		const title = data.get('title')?.trim();
		const slug = data.get('slug')?.trim();
		const content = data.get('content')?.trim();
		const excerpt = data.get('excerpt')?.trim() || '';
		const categoriesRaw = data.get('categories')?.trim() || '';
		const published = data.get('published') === 'on';

		if (!title || !slug || !content) {
			return fail(400, {
				error: 'Title, slug, and content are required',
				title,
				slug,
				content,
				excerpt,
				categories: categoriesRaw
			});
		}

		const categories = JSON.stringify(
			categoriesRaw
				.split(',')
				.map((c) => c.trim())
				.filter(Boolean)
		);

		try {
			await sql`
				UPDATE posts
				SET title = ${title}, slug = ${slug}, content = ${content},
				    excerpt = ${excerpt}, categories = ${categories},
				    published = ${published}, updated_at = NOW()
				WHERE slug = ${params.slug}
			`;
		} catch (error) {
			if (error.message?.includes('unique')) {
				return fail(400, {
					error: 'A post with this slug already exists',
					title,
					slug,
					content,
					excerpt,
					categories: categoriesRaw
				});
			}
			throw error;
		}

		throw redirect(302, '/admin');
	}
};
