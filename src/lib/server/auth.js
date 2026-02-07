import { sql } from '$lib/server/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password) {
	return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}

export async function createSession(userId) {
	const id = crypto.randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

	await sql`
		INSERT INTO sessions (id, user_id, expires_at)
		VALUES (${id}, ${userId}, ${expiresAt})
	`;

	return { id, expiresAt };
}

export async function validateSession(sessionId) {
	if (!sessionId) return null;

	const rows = await sql`
		SELECT s.id, s.user_id, s.expires_at, u.email
		FROM sessions s
		JOIN users u ON u.id = s.user_id
		WHERE s.id = ${sessionId} AND s.expires_at > NOW()
	`;

	return rows[0] || null;
}

export async function deleteSession(sessionId) {
	await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}
