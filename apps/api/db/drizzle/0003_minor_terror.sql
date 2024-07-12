ALTER TABLE "sol_price" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "sol_price" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "sol_price" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sol_price" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "test_table" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "test_table" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "test_table" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "test_table" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sol_price" DROP COLUMN IF EXISTS "date";--> statement-breakpoint
ALTER TABLE "sol_price" DROP COLUMN IF EXISTS "value";--> statement-breakpoint
ALTER TABLE "test_table" DROP COLUMN IF EXISTS "name";