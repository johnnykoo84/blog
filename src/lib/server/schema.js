import { pgTable, serial, varchar, integer, text, timestamp, index } from 'drizzle-orm/pg-core';

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
