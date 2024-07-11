import { config } from "dotenv";
import { resolve } from "path";

config({
  path: "../../.env",
});

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, client } from "./db.migrate";

// This will run migrations on the database, skipping the ones already applied
const MIGRATIONS_FOLDER = resolve(__dirname, "./drizzle");
console.log(
  "Migrating database from migrations directory...",
  MIGRATIONS_FOLDER
);
await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
// Don't forget to close the connection, otherwise the script will hang
await client.end();
