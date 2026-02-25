import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module
vi.mock('$lib/server/db.js', () => ({
	sql: vi.fn()
}));

import { hashPassword, verifyPassword, createSession, validateSession, deleteSession } from './auth.js';
import { sql } from '$lib/server/db.js';

describe('hashPassword', () => {
	it('returns a hash string', async () => {
		const hash = await hashPassword('mypassword');
		expect(typeof hash).toBe('string');
		expect(hash.length).toBeGreaterThan(0);
	});

	it('returns different hash for same password (salted)', async () => {
		const hash1 = await hashPassword('mypassword');
		const hash2 = await hashPassword('mypassword');
		expect(hash1).not.toBe(hash2);
	});

	it('produces bcrypt-formatted hash', async () => {
		const hash = await hashPassword('test');
		// bcrypt hashes start with $2a$ or $2b$
		expect(hash).toMatch(/^\$2[ab]\$/);
	});
});

describe('verifyPassword', () => {
	it('returns true for matching password', async () => {
		const hash = await hashPassword('correct');
		const result = await verifyPassword('correct', hash);
		expect(result).toBe(true);
	});

	it('returns false for wrong password', async () => {
		const hash = await hashPassword('correct');
		const result = await verifyPassword('wrong', hash);
		expect(result).toBe(false);
	});
});

describe('createSession', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns session id and expiry', async () => {
		sql.mockResolvedValueOnce([]);

		const session = await createSession(1);

		expect(session).toHaveProperty('id');
		expect(session).toHaveProperty('expiresAt');
		expect(typeof session.id).toBe('string');
		expect(session.expiresAt).toBeInstanceOf(Date);
	});

	it('generates a 64-character hex session id', async () => {
		sql.mockResolvedValueOnce([]);

		const session = await createSession(1);
		expect(session.id).toMatch(/^[0-9a-f]{64}$/);
	});

	it('sets expiry to approximately 7 days in the future', async () => {
		sql.mockResolvedValueOnce([]);

		const before = Date.now();
		const session = await createSession(1);
		const after = Date.now();

		const sevenDays = 7 * 24 * 60 * 60 * 1000;
		const expiresMs = session.expiresAt.getTime();

		expect(expiresMs).toBeGreaterThanOrEqual(before + sevenDays);
		expect(expiresMs).toBeLessThanOrEqual(after + sevenDays);
	});

	it('calls sql to insert session', async () => {
		sql.mockResolvedValueOnce([]);

		await createSession(42);
		expect(sql).toHaveBeenCalled();
	});
});

describe('validateSession', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns null for falsy session id', async () => {
		const result = await validateSession(null);
		expect(result).toBeNull();

		const result2 = await validateSession('');
		expect(result2).toBeNull();

		const result3 = await validateSession(undefined);
		expect(result3).toBeNull();
	});

	it('returns session data when valid', async () => {
		const sessionData = {
			id: 'abc123',
			user_id: 1,
			expires_at: new Date(Date.now() + 86400000),
			email: 'admin@example.com'
		};
		sql.mockResolvedValueOnce([sessionData]);

		const result = await validateSession('abc123');
		expect(result).toEqual(sessionData);
	});

	it('returns null when no matching session found', async () => {
		sql.mockResolvedValueOnce([]);

		const result = await validateSession('nonexistent');
		expect(result).toBeNull();
	});
});

describe('deleteSession', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls sql to delete the session', async () => {
		sql.mockResolvedValueOnce([]);

		await deleteSession('session-id-123');
		expect(sql).toHaveBeenCalled();
	});
});
