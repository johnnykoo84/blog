import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

let _sql;

export function getSql() {
	if (!_sql) {
		_sql = neon(env.DATABASE_URL);
	}
	return _sql;
}

// Proxy that lazily initializes the neon connection
export const sql = new Proxy(function () {}, {
	apply(_, __, args) {
		return getSql()(...args);
	},
	get(_, prop) {
		return getSql()[prop];
	}
});
