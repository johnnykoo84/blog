import { sql } from '$lib/server/db.js';

export async function getActiveTheme() {
	const rows = await sql`
		SELECT value FROM site_settings WHERE key = 'theme'
	`;
	return rows[0]?.value ?? 'hitel';
}

export async function setActiveTheme(themeId) {
	await sql`
		INSERT INTO site_settings (key, value, updated_at)
		VALUES ('theme', ${themeId}, NOW())
		ON CONFLICT (key) DO UPDATE SET value = ${themeId}, updated_at = NOW()
	`;
}
