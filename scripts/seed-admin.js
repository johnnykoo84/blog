import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
	console.error('Usage: bun run scripts/seed-admin.js <email> <password>');
	process.exit(1);
}

if (!process.env.DATABASE_URL) {
	console.error('DATABASE_URL environment variable is required');
	process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const passwordHash = await bcrypt.hash(password, 10);

try {
	await sql`
		INSERT INTO users (email, password_hash)
		VALUES (${email}, ${passwordHash})
		ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}
	`;
	console.log(`Admin user created/updated: ${email}`);
} catch (error) {
	console.error('Failed to seed admin user:', error.message);
	process.exit(1);
}
