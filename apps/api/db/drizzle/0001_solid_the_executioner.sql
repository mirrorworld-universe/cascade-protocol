ALTER TABLE "sol_price" RENAME COLUMN "id" TO "uuid1";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'sol_price'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "sol_price" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "sol_price" ALTER COLUMN "uuid1" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "sol_price" ALTER COLUMN "uuid1" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "sol_price" ALTER COLUMN "uuid1" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "test_table" ADD COLUMN "uuid1" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "test_table" DROP COLUMN IF EXISTS "id";