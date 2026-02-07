import {
	pgTable,
	serial,
	varchar,
	integer,
	text,
	timestamp,
	index,
	boolean
} from 'drizzle-orm/pg-core';

export const siteSettings = pgTable('site_settings', {
	key: varchar('key', { length: 100 }).primaryKey(),
	value: text('value').notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	postId: varchar('post_id', { length: 255 }).notNull(),
	authorName: varchar('author_name', { length: 100 }).notNull(),
	authorEmail: varchar('author_email', { length: 255 }),
	content: text('content').notNull(),
	ipAddress: varchar('ip_address', { length: 45 }),
	userAgent: text('user_agent'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const postViews = pgTable('post_views', {
	id: serial('id').primaryKey(),
	postId: varchar('post_id', { length: 255 }).notNull().unique(),
	viewCount: integer('view_count').notNull().default(0)
});

export const postViewLogs = pgTable(
	'post_view_logs',
	{
		id: serial('id').primaryKey(),
		postId: varchar('post_id', { length: 255 }).notNull(),
		ipAddress: varchar('ip_address', { length: 45 }),
		userAgent: text('user_agent'),
		viewedAt: timestamp('viewed_at', { withTimezone: true }).defaultNow()
	},
	(table) => [index('idx_post_view_logs_dedup').on(table.postId, table.ipAddress, table.viewedAt)]
);

export const postReactions = pgTable('post_reactions', {
	id: serial('id').primaryKey(),
	postId: varchar('post_id', { length: 255 }).notNull().unique(),
	likes: integer('likes').notNull().default(0),
	dislikes: integer('dislikes').notNull().default(0)
});

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	title: varchar('title', { length: 500 }).notNull(),
	content: text('content').notNull(),
	excerpt: text('excerpt'),
	categories: text('categories').notNull().default('[]'),
	published: boolean('published').default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});
