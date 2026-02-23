import { validateSession } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session_id');
	let session = null;
	try {
		session = await validateSession(sessionId);
	} catch {
		// DB unavailable, treat as not logged in
	}

	event.locals.isAdmin = !!session;
	event.locals.user = session ? { email: session.email } : null;

	return resolve(event);
}
