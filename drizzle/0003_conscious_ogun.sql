CREATE TABLE "site_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);

INSERT INTO "site_settings" ("key", "value") VALUES ('theme', 'hitel');
