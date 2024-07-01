import { config } from "dotenv";
import { resolve } from "path";

config({
  path: "../../.env",
});

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, client } from "./db.migrate";

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: resolve(__dirname, "./drizzle") });
// Don't forget to close the connection, otherwise the script will hang
await client.end();
