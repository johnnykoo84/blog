import { redirect } from '@sveltejs/kit';

export const prerender = false;

export async function load({ locals, url }) {
	// Allow access to login page without session
	if (url.pathname === '/admin/login') {
		return {};
	}

	if (!locals.isAdmin) {
		throw redirect(302, '/admin/login');
	}

	return { user: locals.user };
}
