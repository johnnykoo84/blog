import { redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';

export const prerender = false;

export async function load({ cookies, url }) {
	// Allow access to login page without session
	if (url.pathname === '/admin/login') {
		return {};
	}

	const sessionId = cookies.get('session_id');
	const session = await validateSession(sessionId);

	if (!session) {
		throw redirect(302, '/admin/login');
	}

	return { user: { email: session.email } };
}
