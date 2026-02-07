CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" varchar(255) NOT NULL,
	"author_name" varchar(100) NOT NULL,
	"author_email" varchar(255),
	"content" text NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);
