import { fail, redirect } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title')?.trim();
		const slug = data.get('slug')?.trim();
		const content = data.get('content')?.trim();
		const excerpt = data.get('excerpt')?.trim() || '';
		const categoriesRaw = data.get('categories')?.trim() || '';
		const published = data.get('published') === 'on';

		if (!title || !slug || !content) {
			return fail(400, { error: 'Title, slug, and content are required', title, slug, content, excerpt, categories: categoriesRaw });
		}

		const categories = JSON.stringify(
			categoriesRaw
				.split(',')
				.map((c) => c.trim())
				.filter(Boolean)
		);

		try {
			await sql`
				INSERT INTO posts (slug, title, content, excerpt, categories, published)
				VALUES (${slug}, ${title}, ${content}, ${excerpt}, ${categories}, ${published})
			`;
		} catch (error) {
			if (error.message?.includes('unique')) {
				return fail(400, { error: 'A post with this slug already exists', title, slug, content, excerpt, categories: categoriesRaw });
			}
			throw error;
		}

		throw redirect(302, '/admin');
	}
};
