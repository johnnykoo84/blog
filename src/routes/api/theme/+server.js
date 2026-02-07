import { json } from '@sveltejs/kit';
import { getActiveTheme } from '$lib/server/theme.js';

export const prerender = false;

export async function GET() {
	const theme = await getActiveTheme();
	return json({ theme });
}
