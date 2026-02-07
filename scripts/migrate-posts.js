import { neon } from '@neondatabase/serverless';
import matter from 'gray-matter';
import { readdir, readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
	console.error('DATABASE_URL environment variable is required');
	process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const postsDir = join(import.meta.dirname, '..', 'src', 'lib', 'posts');

const files = (await readdir(postsDir)).filter((f) => f.endsWith('.md'));
console.log(`Found ${files.length} markdown files in ${postsDir}\n`);

let inserted = 0;
let skipped = 0;

for (const file of files) {
	const slug = basename(file, '.md');
	const raw = await readFile(join(postsDir, file), 'utf-8');
	const { data: frontmatter, content } = matter(raw);

	const title = frontmatter.title;
	const excerpt = frontmatter.excerpt || '';
	const categories = JSON.stringify(frontmatter.categories || []);
	const createdAt = frontmatter.date ? new Date(frontmatter.date) : new Date();
	const body = content.trim();

	if (!title) {
		console.warn(`  SKIP ${file} — missing title`);
		skipped++;
		continue;
	}

	try {
		const result = await sql`
			INSERT INTO posts (slug, title, content, excerpt, categories, published, created_at, updated_at)
			VALUES (${slug}, ${title}, ${body}, ${excerpt}, ${categories}, true, ${createdAt}, ${createdAt})
			ON CONFLICT (slug) DO NOTHING
		`;
		// neon returns an array; empty means conflict (already existed)
		if (result.length === 0) {
			console.log(`  EXISTS ${slug}`);
			skipped++;
		} else {
			console.log(`  INSERT ${slug}`);
			inserted++;
		}
	} catch (error) {
		console.error(`  ERROR ${slug}:`, error.message);
		skipped++;
	}
}

console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}, Total files: ${files.length}`);
