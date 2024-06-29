CREATE TABLE IF NOT EXISTS "sol_price" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"value" numeric NOT NULL
);
