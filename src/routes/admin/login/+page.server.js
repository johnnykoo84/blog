import { fail, redirect } from '@sveltejs/kit';
import { sql } from '$lib/server/db.js';
import { verifyPassword, createSession } from '$lib/server/auth.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
		const user = rows[0];

		if (!user || !(await verifyPassword(password, user.password_hash))) {
			return fail(401, { error: 'Invalid email or password', email });
		}

		const session = await createSession(user.id);

		cookies.set('session_id', session.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: true,
			maxAge: 7 * 24 * 60 * 60
		});

		throw redirect(302, '/admin');
	}
};
