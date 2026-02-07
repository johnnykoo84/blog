CREATE TABLE "post_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"dislikes" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "post_reactions_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "post_view_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"viewed_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "post_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "post_views_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE INDEX "idx_post_view_logs_dedup" ON "post_view_logs" USING btree ("post_id","ip_address","viewed_at");