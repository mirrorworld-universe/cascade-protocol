CREATE TABLE IF NOT EXISTS "sol_price" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"value" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "test_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256)
);
