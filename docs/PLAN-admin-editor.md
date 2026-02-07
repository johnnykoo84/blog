# Plan: DB-backed Posts with Admin Editor

## Context
Posts currently live as `.md` files in `src/lib/posts/` loaded via mdsvex `import.meta.glob`. The post page loader (`[post]/+page.js`) does `import(`../../lib/posts/${params.post}.md`)`. We want to store posts in the database so they can be created/edited from an admin UI without redeploying. The admin route needs simple email+password auth with session cookies.

## Approach: Hybrid (MD files + DB posts)
- Keep existing `.md` posts working as-is (no migration needed)
- New/edited posts stored in a `posts` table in Neon DB
- Post page loader tries DB first, falls back to `.md` file
- `fetchPosts` merges both sources for the blog listing
- DB post markdown rendered to HTML server-side with `marked`

## Database Schema (new tables)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    categories TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## New Dependencies
- `marked` — markdown→HTML renderer (for DB posts)
- `bcryptjs` — password hashing (pure JS, works on serverless)

## Files to Create

### Auth
| File | Purpose |
|------|---------|
| `src/lib/server/auth.js` | `createSession()`, `validateSession()`, `deleteSession()`, `hashPassword()`, `verifyPassword()` |
| `src/routes/admin/+layout.server.js` | Check session cookie, redirect to `/admin/login` if not authenticated |
| `src/routes/admin/+layout.svelte` | Minimal admin layout (passes children) |
| `src/routes/admin/login/+page.svelte` | Email + password login form |
| `src/routes/admin/login/+page.server.js` | Form action: verify credentials, set session cookie |
| `src/routes/admin/logout/+page.server.js` | Form action: delete session, clear cookie |

### Admin Post Editor
| File | Purpose |
|------|---------|
| `src/routes/admin/+page.svelte` | Dashboard: list all DB posts with edit/create links |
| `src/routes/admin/+page.server.js` | Load all DB posts for listing |
| `src/routes/admin/posts/new/+page.svelte` | Create form: title, slug, categories, excerpt, markdown textarea + preview |
| `src/routes/admin/posts/new/+page.server.js` | Form action: insert post into DB |
| `src/routes/admin/posts/[slug]/edit/+page.svelte` | Edit form (same as create, pre-filled) |
| `src/routes/admin/posts/[slug]/edit/+page.server.js` | Load post + form action: update post |

### Seed Script
| File | Purpose |
|------|---------|
| `scripts/seed-admin.js` | One-time script: `bun run scripts/seed-admin.js email password` |

## Files to Modify

### `src/lib/server/schema.js`
- Add `users`, `sessions`, `posts` drizzle table definitions

### `src/routes/[post]/+page.js` → convert to `+page.server.js`
- Try DB first: `SELECT * FROM posts WHERE slug = ? AND published = true`
- If not found, fall back to `.md` import
- For DB posts: render markdown→HTML with `marked` and return HTML string + meta
- For `.md` posts: keep existing behavior (return component + meta)

### `src/routes/[post]/+page.svelte`
- Handle two modes:
  - `.md` file: render `<PostContent />` (Svelte component, existing behavior)
  - DB post: render `{@html htmlContent}` (pre-rendered HTML string)

### `src/routes/api/posts.json/+server.js`
- Include published DB posts merged with `.md` posts, sorted by date

## Auth Flow
1. Visit `/admin` → layout server checks `session_id` cookie
2. No valid session → redirect to `/admin/login`
3. Login POSTs email+password → verify with bcrypt → create session row + set httpOnly cookie
4. Logout: delete session row, clear cookie

## Admin Editor UI
- Retro-themed (monospace, same CSS variables as blog)
- Markdown textarea + live preview (side by side on desktop)
- Fields: title, slug (auto-from title, editable), categories (comma-separated), excerpt, content, published toggle
- Save via SvelteKit form actions

## Verification
1. `bun run db:generate && bun run db:migrate`
2. `bun run scripts/seed-admin.js admin@example.com password`
3. `bun dev` → `/admin/login` → log in → create post → verify on blog
4. Edit post → verify changes
5. Existing `.md` posts still work unchanged
