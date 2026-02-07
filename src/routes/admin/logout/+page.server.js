import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/auth.js';

export const actions = {
	default: async ({ cookies }) => {
		const sessionId = cookies.get('session_id');
		if (sessionId) {
			await deleteSession(sessionId);
		}
		cookies.delete('session_id', { path: '/' });
		throw redirect(302, '/admin/login');
	}
};
