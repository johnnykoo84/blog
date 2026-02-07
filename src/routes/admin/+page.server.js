import { sql } from '$lib/server/db.js';
import { getActiveTheme, setActiveTheme } from '$lib/server/theme.js';
import { themeIds } from '$lib/themes.js';

export async function load() {
	const [posts, activeTheme] = await Promise.all([
		sql`
			SELECT
				p.id,
				p.slug,
				p.title,
				p.published,
				p.created_at,
				p.updated_at,
				COALESCE(v.view_count, 0) AS view_count,
				COALESCE(r.likes, 0) AS likes,
				COALESCE(r.dislikes, 0) AS dislikes,
				COALESCE(c.comment_count, 0)::int AS comment_count
			FROM posts p
			LEFT JOIN post_views v ON v.post_id = p.slug
			LEFT JOIN post_reactions r ON r.post_id = p.slug
			LEFT JOIN (
				SELECT post_id, COUNT(*)::int AS comment_count
				FROM comments
				GROUP BY post_id
			) c ON c.post_id = p.slug
			ORDER BY p.created_at DESC
		`,
		getActiveTheme()
	]);

	return { posts, activeTheme };
}

export const actions = {
	setTheme: async ({ request }) => {
		const data = await request.formData();
		const themeId = data.get('theme');

		if (!themeId || !themeIds.includes(themeId)) {
			return { success: false, error: 'Invalid theme' };
		}

		await setActiveTheme(themeId);
		return { success: true, theme: themeId };
	}
};
