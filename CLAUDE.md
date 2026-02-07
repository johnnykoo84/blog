# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
# Install dependencies
bun install

# Run development server (http://localhost:5173)
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Format code
bun run format

# Run linter
bun run lint
```

## Architecture Overview

This is a SvelteKit-based static blog with the following key components:

### Blog Post System

- Posts are Markdown files in `/src/lib/posts/` with filename format `YYMMDD.md` or `YYMMDD-slug.md`
- Required frontmatter: `title`, `date`, `categories` (array), `excerpt`
- Posts are imported dynamically using Vite's `import.meta.glob`
- MDsveX processes Markdown files, allowing them to be imported as Svelte components

### Routing Structure

- `/` - Homepage showing README.md content
- `/blog` - Main blog listing with pagination
- `/blog/[post]` - Individual post pages (dynamic route)
- `/blog/category/[category]` - Category filtering
- `/about` - About page

### API Endpoints

All endpoints are in `/src/routes/api/`:

- `posts.json` - Returns paginated posts
- `posts/count` - Total post count
- `posts/page/[page]` - Pagination API
- `rss.xml` - RSS feed generation

### Key Patterns

- Server-side data loading via `+page.server.js` files
- Static site generation with `@sveltejs/adapter-static`
- Posts per page configured in `/src/lib/config.js` (default: 10)
- Uses Svelte 5 runes syntax (`$props()`)
- Component state management in `/src/lib/assets/js/store.js`

### Deployment

Built as a static site and deployed to Vercel. The build output is in the `build/` directory after running `pnpm build`.
